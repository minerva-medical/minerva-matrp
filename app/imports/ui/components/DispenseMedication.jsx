import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon, Dropdown } from 'semantic-ui-react';
import swal from 'sweetalert';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Sites } from '../../api/site/SiteCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Medications, allowedUnits } from '../../api/medication/MedicationCollection';
import { dispenseTypes } from '../../api/historical/HistoricalCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions, nestedDistinct } from '../utilities/Functions';

/** handle submit for Dispense Medication. */
const submit = (data, callback) => {
  const { lotId, quantity, drug } = data;
  const collectionName = Medications.getCollectionName();
  const medication = Medications.findOne({ drug }); // find the existing medication
  const { _id, unit, lotIds } = medication;
  const targetIndex = lotIds.findIndex((obj => obj.lotId === lotId)); // find the index of existing the lotId
  const { quantity: targetQuantity } = lotIds[targetIndex];

  // if dispense quantity > lotId quantity:
  if (quantity > targetQuantity) {
    swal('Error', `${drug}, ${lotId} only has ${targetQuantity} ${unit} remaining.`, 'error');
  } else {
    // if dispense quantity < lotId quantity:
    if (quantity < targetQuantity) {
      lotIds[targetIndex].quantity -= quantity; // decrement the quantity
    } else {
      // else if dispense quantity === lotId quantity:
      lotIds.splice(targetIndex, 1); // remove the lotId
    }
    const updateData = { id: _id, lotIds };
    const { inventoryType, dispenseType, dateDispensed, dispensedFrom, dispensedTo, site, note, brand, expire } = data;
    const element = { unit, lotId, brand, expire, quantity };
    // const { drug, quantity, unit, brand, lotId, expire, note, ...definitionData } = data;
    const definitionData = { inventoryType, dispenseType, dateDispensed, dispensedFrom, dispensedTo, site,
      name: drug, note, element };
    const promises = [updateMethod.callPromise({ collectionName, updateData }),
      defineMethod.callPromise({ collectionName: 'HistoricalsCollection', definitionData })];
    Promise.all(promises)
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug}, ${lotId} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/** validates the dispense medication form */
const validateForm = (data, callback) => {
  const submitData = { ...data, dispensedFrom: Meteor.user().username };

  if (data.dispenseType !== 'Patient Use') { // handle non patient use dispense
    submitData.dispensedTo = '-';
    submitData.site = '-';
  }

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
const DispenseMedication = ({ ready, brands, drugs, lotIds, sites }) => {
  const [fields, setFields] = useState({
    site: '',
    dateDispensed: moment().format('YYYY-MM-DDTHH:mm'),
    drug: '',
    quantity: '',
    unit: 'tab(s)',
    brand: '',
    lotId: '',
    expire: '',
    dispensedTo: '',
    note: '',
    inventoryType: 'Medication',
    dispenseType: 'Patient Use',
  });
  const [maxQuantity, setMaxQuantity] = useState(0);
  const isDisabled = fields.dispenseType !== 'Patient Use';

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  // handle lotId select
  const onLotIdSelect = (event, { value: lotId }) => {
    const target = Medications.findOne({ lotIds: { $elemMatch: { lotId } } });
    // if lotId is not empty:
    if (target) {
      // autofill the form with specific lotId info
      const targetLotId = target.lotIds.find(obj => obj.lotId === lotId);
      const { drug, unit } = target;
      const { brand, expire, quantity } = targetLotId;
      const autoFields = { ...fields, lotId, drug, expire, brand, unit };
      setFields(autoFields);
      setMaxQuantity(quantity);
    } else {
      // else reset specific lotId info
      setFields({ ...fields, lotId, drug: '', expire: '', brand: '', unit: 'tab(s)' });
      setMaxQuantity(0);
    }
  };

  const clearForm = () => {
    setFields({ ...fields, site: '', drug: '', quantity: '', unit: 'tab(s)', brand: '', lotId: '', expire: '',
      dispensedTo: '', dispensedFrom: '', note: '' });
    setMaxQuantity(0);
  };

  if (ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
            <Dropdown inline name='dispenseType' options={getOptions(dispenseTypes)}
              onChange={handleChange} value={fields.dispenseType} />
              Dispense from Medication Inventory Form
            <Header.Subheader>
              <i>Please input the following information to dispense from the inventory, to the best of your abilities.</i>
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
                  value={'' || Meteor.user().username} readOnly/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Dispensed To' placeholder="Patient Number" disabled={isDisabled}
                  name='dispensedTo' onChange={handleChange} value={fields.dispensedTo} id={COMPONENT_IDS.DISPENSE_MED_PT_NUM}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(sites)} disabled={isDisabled}
                  placeholder="Kaka’ako" name='site'
                  onChange={handleChange} value={fields.site}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(lotIds)}
                  placeholder="Z9Z99"
                  name='lotId' onChange={onLotIdSelect} value={fields.lotId} id={COMPONENT_IDS.DISPENSE_MED_LOT}/>
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
                    onChange={handleChange} value={fields.quantity} placeholder='30' id={COMPONENT_IDS.DISPENSE_MED_QUANTITY}/>
                  <Form.Select compact name='unit' onChange={handleChange} value={fields.unit} className='unit'
                    options={getOptions(allowedUnits)} />
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
                  placeholder="Please add any additional notes, special instructions, or information that should be known here."
                  id={COMPONENT_IDS.DISPENSE_MED_NOTES}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <div className='buttons-div'>
          <Button className='clear-button' onClick={clearForm} id={COMPONENT_IDS.DISPENSE_MED_CLEAR}>Clear Fields</Button>
          <Button className='submit-button' floated='right' onClick={() => validateForm(fields, clearForm)}>Submit</Button>
        </div>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Sites, Drugs, LotIds, and Brands in the props. */
DispenseMedication.propTypes = {
  sites: PropTypes.array.isRequired,
  drugs: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  const siteSub = Sites.subscribeSite();
  return {
    sites: distinct('site', Sites),
    drugs: distinct('drug', Medications),
    lotIds: nestedDistinct('lotId', Medications),
    brands: nestedDistinct('brand', Medications),
    ready: siteSub.ready() && medSub.ready(),
  };
})(DispenseMedication);
