import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Dropdown } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import moment from 'moment';
import { Sites } from '../../api/site/SiteCollection';
import { Supplys } from '../../api/supply/SupplyCollection';
import { dispenseTypes } from '../../api/historical/HistoricalCollection';
import { distinct, getOptions } from '../utilities/Functions';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** handle submit for Dispense Supply. */
const submit = (data, callback) => {
  const { supply, quantity } = data;
  const collectionName = Supplys.getCollectionName();
  const supplyItem = Supplys.findOne({ supply }); // find the existing supply
  const { _id, stock } = supplyItem;
  const targetIndex = stock.findIndex((obj => obj.quantity)); // find the index of existing the supply
  const { quantity: targetQuantity } = stock[targetIndex];

  // if dispense quantity > supply quantity:
  if (quantity > targetQuantity) {
    swal('Error', `${supply} only has ${targetQuantity}`, 'error');
  } else {
    // if dispense quantity < supply quantity:
    if (quantity < targetQuantity) {
      stock[targetIndex].quantity -= quantity; // decrement the quantity
    } else {
      // else if dispense quantity === supply quantity:
      stock.splice(targetIndex, 1); // remove the stock
    }
    const updateData = { id: _id, stock };
    const { inventoryType, dispenseType, dateDispensed, dispensedFrom, dispensedTo, site, note, supplyType } = data;
    const element = { supplyType, quantity };
    const definitionData = { inventoryType, dispenseType, dateDispensed, dispensedFrom, dispensedTo, site, name: supply, note, element };
    const promises = [updateMethod.callPromise({ collectionName, updateData }),
      defineMethod.callPromise({ collectionName: 'HistoricalsCollection', definitionData })];
    Promise.all(promises)
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${supply} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/** validates the dispense supply form */
const validateForm = (data, callback) => {
  const submitData = { ...data, dispensedFrom: Meteor.user().username };

  if (data.dispenseType !== 'Patient Use') { // handle non patient use dispense
    submitData.dispensedTo = '-';
    submitData.site = '-';
  }

  let errorMsg = '';
  // the required String fields
  const requiredFields = ['dispensedTo', 'site', 'supply', 'quantity'];

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

/** Renders the Page for Dispensing Supply. */
const DispenseSupplies = ({ ready, sites, supplys }) => {
  const [fields, setFields] = useState({
    site: '',
    dateDispensed: moment().format('YYYY-MM-DDTHH:mm'),
    supply: '',
    supplyType: '',
    quantity: '',
    dispensedTo: '',
    note: '',
    inventoryType: 'Supply',
    dispenseType: 'Patient Use',
  });
  const [maxQuantity, setMaxQuantity] = useState(0);
  const isDisabled = fields.dispenseType !== 'Patient Use';

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  // handle supply select
  const onSupplySelect = (event, { value: supply }) => {
    const target = Supplys.findOne({ supply });
    // if supply is not empty:
    if (target) {
      // autofill the form with specific supply info
      const { supplyType, stock } = target;
      const targetStockQuantity = target.stock.find(obj => obj.quantity);
      const { quantity } = targetStockQuantity;
      const autoFields = { ...fields, supply, supplyType, stock };
      setFields(autoFields);
      setMaxQuantity(quantity);
    } else {
      // else reset specific supply info
      setFields({ ...fields, supply, supplyType: '', stock: '' });
      setMaxQuantity(0);
    }
  };

  const clearForm = () => {
    setFields({ ...fields, site: '', supply: '', supplyType: '', quantity: '',
      dispensedTo: '', note: '' });
    setMaxQuantity(0);
  };
  if (ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
            <Dropdown inline name='dispenseType' options={getOptions(dispenseTypes)}
              onChange={handleChange} value={fields.dispenseType} />
            Dispense from Supplies Inventory Form
            <Header.Subheader>
              <i>Please input the following information, to the best of your abilities, to dispense a Patient or Lab/Testing supply from the inventory</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Input clearable type="datetime-local" label='Date Dispensed' name='dateDispensed'
                  onChange={handleChange} value={fields.dateDispensed}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input clearable label='Dispensed By' name='dispensedFrom' onChange={handleChange}
                  value={'' || Meteor.user().username} readOnly/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(sites)}
                  placeholder="Kaka’ako" name='site'
                  onChange={handleChange} disabled={isDisabled}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input clearable label='Dispensed To' placeholder="Patient Number"
                  disabled={isDisabled} name='dispensedTo' onChange={handleChange} value={fields.dispensedTo}
                  id={COMPONENT_IDS.DISPENSE_SUP_PT_NUM}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>

              <Grid.Column>
                <Form.Select clearable search label='Supply Name' options={getOptions(supplys)}
                  placeholder="Wipes & Washables/Test Strips/Brace"
                  name='supply' onChange={onSupplySelect} value={fields.supply}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input clearable label={maxQuantity ? `Quantity (${maxQuantity} remaining)` : 'Quantity'}
                    type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} placeholder='30'id={COMPONENT_IDS.DISPENSE_SUP_QUANTITY}/>
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
          <Button className='clear-button' onClick={clearForm} id={COMPONENT_IDS.DISPENSE_SUP_CLEAR}>Clear Fields</Button>
          <Button className='submit-button' floated='right' onClick={() => validateForm(fields, clearForm)}>Submit</Button>
        </div>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Sites, Drugs, LotIds, and Brands in the props. */
DispenseSupplies.propTypes = {
  currentUser: PropTypes.object,
  sites: PropTypes.array.isRequired,
  supplys: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const supSub = Supplys.subscribeSupply();
  const siteSub = Sites.subscribeSite();

  return {
    // TODO: exclude 'N/A'
    currentUser: Meteor.user(),
    sites: distinct('site', Sites),
    supplys: distinct('supply', Supplys),
    ready: siteSub.ready() && supSub.ready(),
  };
})(DispenseSupplies);
