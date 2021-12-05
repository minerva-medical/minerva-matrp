import React, { useEffect, useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Input } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Supplys } from '../../api/supply/SupplyCollection';
import { SupplyTypes } from '../../api/supplyType/SupplyTypeCollection';
import { Locations } from '../../api/location/LocationCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { distinct, getOptions } from '../utilities/Functions';

/** handles submit for add medication. */
const submit = (data, callback) => {
  const { supply, supplyType, minQuantity, quantity, location, donated, donatedBy, note } = data;
  const collectionName = Supplys.getCollectionName();
  const exists = Supplys.findOne({ supply }); // returns the existing supply or undefined

  // if the supply does not exist:
  if (!exists) {
    // insert the new supply and stock
    const newStock = { quantity, location, donated, donatedBy, note };
    const definitionData = { supply, supplyType, minQuantity, stock: [newStock] };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${supply} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  } else {
    console.log('I don\'t think it should ever get here so this can probably be deleted');
    const { stock } = exists;
    const updateData = { id: exists._id, stock };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${supply} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/** validates the add medication form */
const validateForm = (data, callback) => {
  const submitData = { ...data };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['supply', 'supplyType', 'minQuantity', 'location', 'quantity'];

  // if the field is empty, append error message
  requiredFields.forEach(field => {
    if (!submitData[field]) {
      errorMsg += `${field} cannot be empty.\n`;
    }
  });

  if (errorMsg) {
    swal('Error', `${errorMsg}`, 'error');
  } else {
    submitData.minQuantity = parseInt(data.minQuantity, 10);
    submitData.quantity = parseInt(data.quantity, 10);
    submit(submitData, callback);
  }
};

/** Renders the Page for Dispensing Inventory. */
const AddSupplies = ({ supplys, supplyTypes, locations, ready }) => {
  const [fields, setFields] = useState({
    supply: '',
    supplyType: [],
    minQuantity: '',
    quantity: '',
    location: '',
    note: '',
    donated: false,
    donatedBy: '',
  });
  // a copy of drugs, lotIds, and brands and their respective filters
  const [newSupplys, setNewSupplys] = useState([]);
  useEffect(() => {
    setNewSupplys(supplys);
  }, [supplys]);
  const [filteredSupplys, setFilteredSupplys] = useState([]);
  useEffect(() => {
    setFilteredSupplys(newSupplys);
  }, [newSupplys]);

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  const handleCheck = (event, { name, checked }) => {
    if (!checked) {
      setFields({ ...fields, [name]: checked, donatedBy: '' });
    } else {
      setFields({ ...fields, [name]: checked });
    }
  };

  if (ready) {
    return (
      <Tab.Pane id={COMPONENT_IDS.ADD_FORM}>
        <Header as="h2">
          <Header.Content>
            Add Patient Supplies to Inventory Form
            <Header.Subheader>
              <i>Please input all relative fields to add patient supplies to the inventory</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Supply Name' options={getOptions(filteredSupplys)}
                  placeholder="Example supply" name='supply' onChange={handleChange} value={fields.supply}
                  id={COMPONENT_IDS.ADD_SUPPLY_NAME} />
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Supply Type'
                  options={getOptions(supplyTypes)} placeholder="Supply type"
                  name='supplyType' onChange={handleChange} value={fields.supplyType} id={COMPONENT_IDS.ADD_SUPPLY_TYPE}/>
              </Grid.Column>
              <Grid.Column>

                <Form.Input label='Minimum Quantity' type='number' min={1} name='minQuantity' className='quantity'
                  onChange={handleChange} value={fields.minQuantity} placeholder="100"
                  id={COMPONENT_IDS.ADD_SUPPLY_MIN_QUANTITY} />
              </Grid.Column>
              <Grid.Column className='checkbox-column'>
              </Grid.Column>

            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>Quantity</label>
                  <Input
                    type='number' min={1} onChange={handleChange} value={fields.quantity} name='quantity'/>
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Location' options={getOptions(locations, 'location')}
                  name='location' onChange={handleChange} value={fields.location}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Donated</label>
                  <Form.Group>
                    <Form.Checkbox name='donated' className='donated-field'
                      onChange={handleCheck} checked={fields.donated}/>
                    <Form.Input name='donatedBy' className='donated-by-field' placeholder='Donated By'
                      onChange={handleChange} value={fields.donatedBy} disabled={!fields.donated} />
                  </Form.Group>
                </Form.Field>
              </Grid.Column>

            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}/>
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
AddSupplies.propTypes = {
  supplys: PropTypes.array.isRequired,
  supplyTypes: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const typeSub = SupplyTypes.subscribeSupplyType();
  const locationSub = Locations.subscribeLocation();
  return {
    supplys: distinct('supply', Supplys),
    supplyTypes: distinct('supplyType', SupplyTypes),
    locations: distinct('location', Locations),
    ready: typeSub.ready() && locationSub.ready(),
  };
})(AddSupplies);
