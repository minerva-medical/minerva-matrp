import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Sites } from '../../api/site/SiteCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { Brands } from '../../api/brand/BrandCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions } from '../utilities/Functions';

/** On submit, insert the data. */
const submit = data => {
  const { lotId, quantity, drug } = data;
  const collectionName = Medications.getCollectionName();
  const histCollection = Historicals.getCollectionName();
  const medication = Medications.findOne({ lotId });
  const { _id } = medication;
  if (quantity < medication.quantity) {
    const updateData = { id: _id, quantity: -quantity, action: 'INC' };
    const definitionData = { ...data };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    // TODO: chain promises
    defineMethod.callPromise({ collectionName: histCollection, definitionData });
  } else if (quantity > medication.quantity) {
    swal('Error', `${drug} only has ${medication.quantity} remaining.`, 'error');
  } else {
    const updateData = { id: _id, action: 'RESET' };
    const definitionData = { ...data };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    // TODO: chain promises
    defineMethod.callPromise({ collectionName: histCollection, definitionData });
  }
  // swal('Success', JSON.stringify(data), 'success');
};

// TODO: simplify
const validateForm = data => {
  const submitData = { ...data, dispensedFrom: data.dispensedFrom || Meteor.user().username };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['dateDispensed', 'dispensedTo', 'site', 'drug', 'lotId', 'brand', 'quantity'];

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
    submit(submitData);
  }
};

/** Renders the Page for Dispensing Inventory. */
const DispenseMedication = (props) => {
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

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  // handle dropdown search query
  const handleSearch = (event, { name, searchQuery }) => {
    setFields({ ...fields, [name]: searchQuery });
  };

  if (props.ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
              Dispense from Inventory Form
            <Header.Subheader>
              <i>Please input the following information to dispense from the inventory,
                  to the best of your abilities.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
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
                  value={fields.dispensedFrom || props.currentUser.username} readOnly/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Dispensed To' placeholder="Patient Number"
                  name='dispensedTo' onChange={handleChange} value={fields.dispensedTo}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(props.sites)}
                  placeholder="POST, Kaka’ako, etc." name='site'
                  onChange={handleChange} value={fields.site} onSearchChange={handleSearch} searchQuery={fields.site}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Drug Name' options={getOptions(props.drugs)}
                  placeholder="Acetaminophen, Albuterol, etc."
                  name='drug' onChange={handleChange} value={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(props.lotIds)}
                  placeholder="01ABC..."
                  name='lotId' onChange={handleChange} value={fields.lotId}/>
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
                <Form.Select clearable search label='Brand' options={getOptions(props.brands)}
                  placeholder="Advil, Tylenol, etc."
                  name='brand' onChange={handleChange} value={fields.brand}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label='Quantity (tabs/mL)' type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} />
                  <Form.Select compact name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                    options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]} />
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
                  placeholder="Please write any additional notes, special instructions, or information that should be known here"/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <div className='buttons-div'>
          <Button className='clear-button'>Clear Fields</Button>
          <Button className='submit-button' floated='right' onClick={() => validateForm(fields)}>Submit</Button>
        </div>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Stuff documents in the props. */
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
  const drugSub = Drugs.subscribeDrug();
  const brandSub = Brands.subscribeBrand();
  return {
    currentUser: Meteor.user(),
    sites: distinct('site', Historicals, Sites), // TODO: get from Sites Collection only
    drugs: distinct('drug', Medications, Drugs),
    lotIds: distinct('lotId', Medications),
    brands: distinct('brand', Medications, Brands),
    ready: siteSub.ready() && drugSub.ready() && brandSub.ready() && historySub.ready() && medSub.ready(),
  };
})(DispenseMedication);
