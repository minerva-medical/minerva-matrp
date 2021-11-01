import React, { useState, useEffect } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { Locations } from '../../api/location/LocationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions } from '../utilities/Functions';

/** handles submit for add medication. */
const submit = (data, callback) => {
  const { drug, drugType, minQuantity, quantity, unit, brand, lotId, expire, location, donated, note } = data;
  const collectionName = Medications.getCollectionName();
  const exists = Medications.findOne({ lotId }); // returns the existing medication or undefined
  const empty = Medications.findOne({ drug, quantity: 0 }); // returns the empty medication or undefined

  if (exists) {
    // if the medication w/ lotId exists:
    const updateData = { id: exists._id, quantity: exists.quantity + quantity }; // increment the quantity
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  } else if (empty) {
    // else if the medication w/ drug_name exists and its quantity is 0:
    const updateData = { id: empty._id, drugType, minQuantity, quantity, unit, brand, lotId, expire, location, donated,
      note }; // set the following
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  } else {
    // else insert the new medication
    const definitionData = { ...data };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/** validates the add medication form */
const validateForm = (data, callback) => {
  const submitData = { ...data };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['drug', 'drugType', 'brand', 'lotId', 'minQuantity', 'quantity', 'location'];

  // if the field is empty, append error message
  requiredFields.forEach(field => {
    if (!submitData[field] || (field === 'drugType' && !submitData.drugType.length)) {
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

/** Renders the Page for Add Medication. */
const AddMedication = ({ drugTypes, ready, drugs, lotIds, brands, locations }) => {
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

  const [filteredDrugs, setFilteredDrugs] = useState([]);
  useEffect(() => {
    setFilteredDrugs(drugs);
  }, [drugs]);

  const [filteredBrands, setFilteredBrands] = useState([]);
  useEffect(() => {
    setFilteredBrands(brands);
  }, [brands]);

  const handleChange = (event, { name, value, checked }) => {
    setFields({ ...fields, [name]: value !== undefined ? value : checked });
  };

  // handle dropdown search query
  const handleSearch = (event, { name, searchQuery }) => {
    setFields({ ...fields, [name]: searchQuery });
  };

  // autofill form on lotId select
  const onLotIdSelect = (event, { value }) => {
    const medication = Medications.findOne({ lotId: value });
    if (medication) {
      const { drug, drugType, expire, brand, minQuantity, isTabs, location, donated, note } = medication;
      const autoFields = { ...fields, lotId: value, drug, drugType, expire, brand, minQuantity, isTabs, location,
        donated, note };
      setFields(autoFields);
    } else {
      setFields({ ...fields, lotId: value });
    }
  };

  const onBrandSelect = (event, { value }) => {
    setFields({ ...fields, brand: value });
    // filter drug dropdown
    const selector = value ? { brand: value } : {};
    const filteredData = distinct('drug', Medications, selector);
    // console.log(filteredData);
    setFilteredDrugs(filteredData);
  };

  const clearForm = () => setFields({ drug: '', drugType: [], minQuantity: '', quantity: '', isTabs: true,
    brand: '', lotId: '', expire: '', location: '', donated: false, note: '' });

  if (ready) {
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
        {/* Semantic UI Form used for functionality */}
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Drug Name' options={getOptions(filteredDrugs)}
                  placeholder="Benzonatate Capsules" name='drug'
                  onChange={handleChange} value={fields.drug} onSearchChange={handleSearch} searchQuery={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable multiple search label='Drug Type(s)'
                  options={getOptions(drugTypes)} placeholder="Allergy & Cold Medicines"
                  name='drugType' onChange={handleChange} value={fields.drugType}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(lotIds)}
                  placeholder="Z9Z99" name='lotId'
                  onChange={onLotIdSelect} value={fields.lotId} onSearchChange={handleSearch} searchQuery={fields.lotId}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Brand' options={getOptions(filteredBrands)}
                  placeholder="Zonatuss" name='brand'
                  onChange={onBrandSelect} value={fields.brand} onSearchChange={handleSearch} searchQuery={fields.brand}/>
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
                  onChange={handleChange} value={fields.minQuantity} placeholder="100"/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label='Quantity' type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} placeholder="200"/>
                  <Form.Select compact name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                    options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]} />
                </Form.Group>
              </Grid.Column>
              <Grid.Column>
                <Form.Select compact clearable search label='Location' options={getOptions(locations)}
                  placeholder="Case 2" name='location'
                  onChange={handleChange} value={fields.location}/>
              </Grid.Column>
              <Grid.Column className='checkbox-column'>
                <Form.Checkbox label='Donated' name='donated' onChange={handleChange} checked={fields.donated} />
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

/** Require an array of Drugs, DrugTypes, LotIds, Locations, and Brands in the props. */
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
  const typeSub = DrugTypes.subscribeDrugType();
  const locationSub = Locations.subscribeLocation();
  const medSub = Medications.subscribeMedication();
  return {
    // TODO: exclude 'N/A'
    drugs: distinct('drug', Medications),
    drugTypes: distinct('drugType', DrugTypes),
    lotIds: distinct('lotId', Medications),
    locations: distinct('location', Locations),
    brands: distinct('brand', Medications),
    ready: typeSub.ready() && locationSub.ready() && medSub.ready(),
  };
})(AddMedication);
