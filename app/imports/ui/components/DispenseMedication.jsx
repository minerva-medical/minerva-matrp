import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Sites } from '../../api/site/SiteCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions } from '../utilities/Functions';

/** handle submit for Dispense Medication. */
const submit = (data, callback) => {
  const { lotId, quantity, drug } = data;
  const collectionName = Medications.getCollectionName();
  const histCollection = Historicals.getCollectionName();
  const medication = Medications.findOne({ lotId }); // find the existing medication
  const { _id, isTabs } = medication;

  if (quantity < medication.quantity) {
    // if dispense quantity < medication quantity:
    const updateData = { id: _id, quantity: medication.quantity - quantity }; // decrement the quantity
    const definitionData = { ...data };
    const promises = [updateMethod.callPromise({ collectionName, updateData }),
      defineMethod.callPromise({ collectionName: histCollection, definitionData })];
    Promise.all(promises)
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  } else if (quantity > medication.quantity) {
    // else if dispense quantity > medication quantity:
    swal('Error', `${drug} only has ${medication.quantity} ${isTabs ? 'tabs' : 'mL'} remaining.`, 'error');
  } else {
    // else if dispense quantity = medication quantity:
    const updateData = { id: _id, minQuantity: 1, quantity: 0, brand: 'N/A', lotId: 'N/A', expire: 'N/A',
      location: 'N/A', donated: false, note: 'N/A', drugType: ['N/A'], isTabs: true }; // reset all fields (exc. drug)
    const definitionData = { ...data };
    const promises = [updateMethod.callPromise({ collectionName, updateData }),
      defineMethod.callPromise({ collectionName: histCollection, definitionData })];
    Promise.all(promises)
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/** validates the dispense medication form */
const validateForm = (data, callback) => {
  const submitData = { ...data, dispensedFrom: data.dispensedFrom || Meteor.user().username };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['dispensedTo', 'site', 'drug', 'lotId', 'brand', 'quantity'];

  // check required fields
  requiredFields.forEach(field => {
    if (!submitData[field]) {
      errorMsg += `${field} cannot be empty.\n`;
    }
  });

  if (errorMsg) {
    swal('Error', `${errorMsg}`, 'error');
  } else {
    submitData.quantity = parseInt(data.quantity, 10);
    submit(submitData, callback);
  }
};

/** Renders the Page for Dispensing Medication. */
const DispenseMedication = ({ currentUser, ready, brands, drugs, lotIds, sites }) => {
  const [fields, setFields] = useState({
    site: '',
    dateDispensed: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    drug: '',
    quantity: '',
    isTabs: true,
    brand: '',
    lotId: '',
    expire: '',
    dispensedTo: '',
    dispensedFrom: '',
    note: '',
  });
  const [maxQuantity, setMaxQuantity] = useState(0);

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  // autofill form on lotId select
  const onLotIdSelect = (event, { value }) => {
    const medication = Medications.findOne({ lotId: value });
    if (medication) {
      const { drug, expire, brand, quantity, isTabs } = medication;
      const autoFields = { ...fields, lotId: value, drug, expire, brand, isTabs };
      setFields(autoFields);
      setMaxQuantity(quantity);
    } else {
      setFields({ ...fields, lotId: value });
      setMaxQuantity(0);
    }
  };

  const clearForm = () => setFields({ site: '', drug: '', quantity: '', isTabs: true, brand: '', lotId: '',
    expire: '', dispensedTo: '', dispensedFrom: '', note: '' });

  if (ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
              Dispense from Medication Inventory Form
            <Header.Subheader>
              <i>Please input the following information to dispense from the inventory,
                  to the best of your abilities.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        {/* Semantic UI Form used for functionality */}
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Input type="datetime-local" label='Date Dispensed' name='dateDispensed'
                  onChange={handleChange} value={fields.dateDispensed}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input label='Dispensed By' name='dispensedFrom' onChange={handleChange}
                  value={fields.dispensedFrom || currentUser.username} readOnly/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Dispensed To' placeholder="Patient Number"
                  name='dispensedTo' onChange={handleChange} value={fields.dispensedTo}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(sites)}
                  placeholder="Kaka’ako" name='site'
                  onChange={handleChange} value={fields.site}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(lotIds)}
                  placeholder="Z9Z99"
                  name='lotId' onChange={onLotIdSelect} value={fields.lotId}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Drug Name' options={getOptions(drugs)}
                  placeholder="Benzonatate Capsules"
                  name='drug' onChange={handleChange} value={fields.drug}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {/* expiration date may be null */}
                <Form.Field>
                  <label>Expiration Date</label>
                  <Form.Input type='date' name='expire' onChange={handleChange} value={fields.expire}/>
                  <Icon name='x' className='x-icon' onClick={() => setFields({ ...fields, expire: '' })}
                    style={{ visibility: fields.expire ? 'visible' : 'hidden' }}/>
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Brand' options={getOptions(brands)}
                  placeholder="Zonatuss"
                  name='brand' onChange={handleChange} value={fields.brand}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label={maxQuantity ? `Quantity (${maxQuantity} remaining)` : 'Quantity'}
                    type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} placeholder='30'/>
                  <Form.Select compact name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                    options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]} />
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
                  placeholder="Please add any additional notes, special instructions, or information that should be known here."/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <div className='buttons-div'>
          <Button className='clear-button' onClick={clearForm}>Clear Fields</Button>
          <Button className='submit-button' floated='right' onClick={() => validateForm(fields, clearForm)}>Submit</Button>
        </div>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Sites, Drugs, LotIds, and Brands in the props. */
DispenseMedication.propTypes = {
  currentUser: PropTypes.object,
  sites: PropTypes.array.isRequired,
  drugs: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  const historySub = Historicals.subscribeHistorical();
  const siteSub = Sites.subscribeSite();
  return {
    // TODO: exclude 'N/A'
    currentUser: Meteor.user(),
    sites: distinct('site', Sites),
    drugs: distinct('drug', Medications),
    lotIds: distinct('lotId', Medications),
    brands: distinct('brand', Medications),
    ready: siteSub.ready() && historySub.ready() && medSub.ready(),
  };
})(DispenseMedication);
