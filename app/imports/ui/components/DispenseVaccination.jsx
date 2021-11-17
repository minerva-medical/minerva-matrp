import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon, Dropdown } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Sites } from '../../api/site/SiteCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { Historicals, dispenseTypes } from '../../api/historical/HistoricalCollection';
// import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions, nestedDistinct } from '../utilities/Functions';

/** handle submit for Dispense Vaccine. */
/*
const submit = (data, callback) => {
  const { lotId, quantity, brand } = data;
  const collectionName = Vaccines.getCollectionName();
  const histCollection = Historicals.getCollectionName();
  const vaccine = Vaccines.findOne({ brand }); // find the existing vaccine
  const { _id, isTabs, element } = vaccine;
  const targetIndex = element.findIndex((obj => obj.element.lotId === lotId)); // find the index of existing the lotId
  const { quantity: targetQuantity } = element[targetIndex];

  // if dispense quantity > lotId quantity:
  if (quantity > targetQuantity) {
    swal('Error', `${brand}, ${lotId} only has ${targetQuantity} remaining.`, 'error');
  } else {
    // if dispense quantity < lotId quantity:
    if (quantity < targetQuantity) {
      element[targetIndex].quantity -= quantity; // decrement the quantity
    } else {
      // else if dispense quantity === lotId quantity:
      lotIds.splice(targetIndex, 1); // remove the lotId
    }
    const updateData = { id: _id, lotIds };
    const { inventoryType, dispenseType, dateDispensed, dispensedFrom, dispensedTo, site, note, brand, expire } = data;
    const element = { lotId, brand, expire, quantity };
    // const { drug, quantity, unit, brand, lotId, expire, note, ...definitionData } = data;
    const definitionData = { inventoryType, dispenseType, dateDispensed, dispensedFrom, dispensedTo, site,
      name: drug, note, element };
    const promises = [updateMethod.callPromise({ collectionName, updateData }),
      defineMethod.callPromise({ collectionName: histCollection, definitionData })];
    Promise.all(promises)
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', `${drug}, ${lotId} updated successfully`, 'success', { buttons: false, timer: 3000 });
          callback(); // resets the form
        });
  }
};
*/
/** validates the dispense vaccine form */
const validateForm = (data) => { // don't forget to include "callback"
  const submitData = { ...data, dispensedFrom: Meteor.user().username };
  let errorMsg = '';
  // the required String fields
  // TODO: validation for non patient use
  const requiredFields = ['dispensedTo', 'site', 'brand', 'lotId', 'quantity', 'dose', 'visDate'];

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
    // submit(submitData, callback);
  }
};

/** Renders the Page for Dispensing Vaccine. */
const DispenseVaccination = ({ ready, brands, sites }) => {
  const [fields, setFields] = useState({
    site: '',
    // TODO: use moment?
    dateDispensed: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    dispensedTo: '',
    lotId: '',
    brand: '',
    expire: '',
    dose: '',
    visDate: '',
    note: '',
    inventoryType: 'Vaccine',
    dispenseType: 'Patient Use',
  });
  // const [maxQuantity, setMaxQuantity] = useState(0);
  const isDisabled = fields.dispenseType !== 'Patient Use';

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  // handle lotId select
  /*
  const onLotIdSelect = (event, { value: lotId }) => {
     const target = Vaccines.findOne({ element: { $elemMatch: { lotId } } });
    // if lotId is not empty:
    if (target) {
      // autofill the form with specific lotId info
      const targetLotId = target.lotId.find(obj => obj.lotId === lotId);
      const { drug, isTabs } = target;
      const { brand, expire, quantity } = targetLotId;
      const autoFields = { ...fields, lotId, brand, expire };
      setFields(autoFields);
      setMaxQuantity(quantity);
    } else {
      // else reset specific lotId info
      setFields({ ...fields, lotId, brand: '', expire: ''});
      setMaxQuantity(0);
    }
  };
  */
  const clearForm = () => {
    setFields({ ...fields, site: '', brand: '', quantity: '', lotId: '', expire: '', dose: '', visDate: '',
      dispensedTo: '', dispensedFrom: '', note: '' });
    // setMaxQuantity(0);
  };

  if (ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
            <Dropdown inline name='dispenseType' options={getOptions(dispenseTypes)}
              onChange={handleChange} value={fields.dispenseType} />
            Dispense from Vaccine Inventory Form
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
                  value={'' || Meteor.user().username} readOnly/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Dispensed To' placeholder="Patient Number"
                  name='dispensedTo' onChange={handleChange} value={fields.dispensedTo} disabled={isDisabled}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(sites)}
                  placeholder="Kaka’ako" name='site'
                  onChange={handleChange} value={fields.site} disabled={isDisabled}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input type="date" label='VIS Date' name='dateDispensed'
                    onChange={handleChange} value={fields.dateDispensed} disabled={isDisabled}/>
                  <Form.Input label='Dose #' type='number' min={1} max={5} name='quantity' className='dose'
                    onChange={handleChange} placeholder='1' disabled={isDisabled}/>
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Vaccine'
                  placeholder="J&J COVID"
                  name='name' onChange={handleChange} />
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number'
                  placeholder="Z9Z99"
                  name='lotId' value={fields.lotId}/>
              </Grid.Column>
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
                <Form.Select clearable search label='Manufacturer' options={getOptions(brands)}
                  placeholder="ACAM2000 Sanofi Pasteur"
                  name='brand' onChange={handleChange}/>
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
DispenseVaccination.propTypes = {
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
    sites: distinct('site', Sites),
    drugs: distinct('drug', Medications),
    lotIds: nestedDistinct('lotId', Medications),
    brands: nestedDistinct('brand', Medications),
    ready: siteSub.ready() && historySub.ready() && medSub.ready(),
  };
})(DispenseVaccination);
