import React, { useState, useEffect } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { Brands } from '../../api/brand/BrandCollection';
import { Locations } from '../../api/location/LocationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions } from '../utilities/Functions';

/** On submit, insert the data. */
const submit = data => {
  // console.log(data)
  const { drug, minQuantity, quantity, brand, lotId, expire, location, donated, note } = data;
  const collectionName = Medications.getCollectionName();
  const exists = Medications.findOne({ lotId });
  const empty = Medications.findOne({ drug, quantity: 0 });
  if (exists) {
    // if lotId exists (if medication exists):
    const updateData = { id: exists._id, quantity, action: 'INC' };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  } else if (empty) {
    // else if drug exists w/ quantity 0:
    const updateData = { id: empty._id, minQuantity, quantity, brand, lotId, expire, location, donated,
      note, action: 'REFILL' };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  } else {
    // TODO: reset form
    const definitionData = { ...data };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item added successfully', 'success'));
  }
  // swal('Success', JSON.stringify(data), 'success', {
  //   buttons: false,
  //   timer: 3000,
  // });
};

// TODO: enforce lowercase
const validateForm = data => {
  const submitData = { ...data };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['drug', 'drugType', 'brand', 'lotId', 'expire', 'minQuantity', 'quantity', 'location'];

  // check required fields
  requiredFields.forEach(field => {
    if (!submitData[field] || !submitData[field].length) {
      errorMsg += `${field} cannot be empty.\n`;
    }
  });

  if (errorMsg) {
    swal('Error', `${errorMsg}`, 'error');
  } else {
    submitData.minQuantity = parseInt(data.minQuantity, 10);
    submitData.quantity = parseInt(data.quantity, 10);
    submit(submitData);
  }
};

/** Renders the Page for Dispensing Inventory. */
const AddMedication = (props) => {
  const [fields, setFields] = useState({
    drug: '',
    drugType: [],
    minQuantity: '',
    quantity: '',
    isTabs: true,
    brand: '',
    lotId: '',
    expire: '',
    location: '',
    donated: false,
    note: '',
  });

  const [drugTypes, setDrugTypes] = useState([]); // store drugTypes in state
  // update drugTypes if props.drugTypes changes
  useEffect(() => {
    setDrugTypes(props.drugTypes);
  }, [props.drugTypes]);

  const handleChange = (event, { name, value, checked }) => {
    setFields({ ...fields, [name]: value !== undefined ? value : checked });
  };

  // handle dropdown search query
  const handleSearch = (event, { name, searchQuery }) => {
    setFields({ ...fields, [name]: searchQuery });
  };

  // add user inputted drug type if not already added
  const addDrugType = (event, { value }) => {
    // const re = new RegExp(value, 'i');
    if (!drugTypes.includes(value.toLowerCase())) {
      setDrugTypes([...drugTypes, value]);
    }
  };

  if (props.ready) {
    return (
      <Tab.Pane id='add-form'>
        <Header as="h2">
          <Header.Content>
              Add to Inventory Form
            <Header.Subheader>
              <i>Please input the following information to add to the inventory, to the best of your abilities.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Drug Name' options={getOptions(props.drugs)}
                  placeholder="Acetaminophen, Albuterol, etc." name='drug'
                  onChange={handleChange} value={fields.drug} onSearchChange={handleSearch} searchQuery={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable multiple search label='Drug Type(s)'
                  options={getOptions(drugTypes)} placeholder="Allergy & Cold Medicines, etc."
                  name='drugType' onChange={handleChange} value={fields.drugType} allowAdditions onAddItem={addDrugType}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Brand' options={getOptions(props.brands)}
                  placeholder="Advil, Tylenol, etc." name='brand'
                  onChange={handleChange} value={fields.brand} onSearchChange={handleSearch} searchQuery={fields.brand}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(props.lotIds)}
                  placeholder="01ABC..." name='lotId'
                  onChange={handleChange} value={fields.lotId} onSearchChange={handleSearch} searchQuery={fields.lotId}/>
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
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input label='Minimum Quantity' type='number' min={1} name='minQuantity'
                  onChange={handleChange} value={fields.minQuantity} placeholder="Min. Inventory should have"/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label='Quantity' type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} placeholder="Amount to be added"/>
                  <Form.Select compact name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                    options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]} />
                </Form.Group>
              </Grid.Column>
              <Grid.Column>
                <Form.Select compact clearable search label='Location' options={getOptions(props.locations)}
                  placeholder="Case 1, Case 2, etc." name='location'
                  onChange={handleChange} value={fields.location} onSearchChange={handleSearch} searchQuery={fields.location}/>
              </Grid.Column>
              <Grid.Column className='checkbox-column'>
                <Form.Checkbox label='Donated' name='donated' onChange={handleChange} checked={fields.donated} />
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
AddMedication.propTypes = {
  drugs: PropTypes.array.isRequired,
  drugTypes: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const drugSub = Drugs.subscribeDrug();
  const typeSub = DrugTypes.subscribeDrugType();
  const locationSub = Locations.subscribeLocation();
  const brandSub = Brands.subscribeBrand();
  const medSub = Medications.subscribeMedication();
  return {
    drugs: distinct('drug', Medications, Drugs),
    drugTypes: distinct('drugType', Medications, DrugTypes),
    lotIds: distinct('lotId', Medications),
    locations: distinct('location', Medications, Locations),
    brands: distinct('brand', Medications, Brands),
    ready: drugSub.ready() && typeSub.ready() && brandSub.ready() && locationSub.ready() && medSub.ready(),
  };
})(AddMedication);
