import React, { useState, useEffect } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { Locations } from '../../api/location/LocationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions, nestedDistinct } from '../utilities/Functions';

/** handles submit for add medication. */
const submit = (data, callback) => {
  const { drug, drugType, minQuantity, quantity, isTabs, brand, lotId, expire, location, donated, note } = data;
  const collectionName = Medications.getCollectionName();
  const exists = Medications.findOne({ drug }); // returns the existing medication or undefined

  // if the medication does not exist:
  if (!exists) {
    // insert the new medication and lotId
    const newLot = { lotId, brand, expire, location, quantity, donated, note };
    const definitionData = { drug, drugType, minQuantity, isTabs, lotIds: [newLot] };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug}, ${lotId} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  } else {
    const { lotIds } = exists;
    const targetIndex = lotIds.findIndex((obj => obj.lotId === lotId));
    // if lotId exists, increment the quantity:
    if (targetIndex > -1) {
      lotIds[targetIndex].quantity += quantity;
    } else {
      // else append the new lotId
      lotIds.push({ lotId, brand, expire, location, quantity, donated, note });
    }
    const updateData = { id: exists._id, lotIds };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${drug} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/** validates the add medication form */
const validateForm = (data, callback) => {
  const submitData = { ...data };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['drug', 'drugType', 'minQuantity', 'lotId', 'brand', 'location', 'quantity'];

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
  const isDisabled = drugs.includes(fields.drug);

  const [newDrugs, setNewDrugs] = useState([]);
  useEffect(() => {
    setNewDrugs(drugs);
  }, [drugs]);
  const [newLotIds, setNewLotIds] = useState([]);
  useEffect(() => {
    setNewLotIds(lotIds);
  }, [lotIds]);
  const [newBrands, setNewBrands] = useState([]);
  useEffect(() => {
    setNewBrands(brands);
  }, [brands]);

  const onAddDrug = (event, { value }) => {
    if (!newDrugs.map(drug => drug.toLowerCase()).includes(value.toLowerCase())) {
      setNewDrugs([...newDrugs, value]);
    }
  };
  const onAddLotId = (event, { value }) => {
    if (!newLotIds.includes(value)) {
      setNewLotIds([...newLotIds, value]);
    }
  };
  const onAddBrand = (event, { value }) => {
    if (!newBrands.map(brand => brand.toLowerCase()).includes(value.toLowerCase())) {
      setNewBrands([...newBrands, value]);
    }
  };

  const handleChange = (event, { name, value, checked }) => {
    setFields({ ...fields, [name]: value !== undefined ? value : checked });
  };

  // autofill form on drug select
  const onDrugSelect = (event, { value: drug }) => {
    const medication = Medications.findOne({ drug });
    if (medication) {
      const { drugType, minQuantity, isTabs } = medication;
      setFields({ ...fields, drug, drugType, minQuantity, isTabs });
    } else {
      // setFields({ ...fields, drug, drugType: [], minQuantity: '', isTabs: true });
      setFields({ ...fields, drug });
    }
  };

  // autofill form on lotId select
  const onLotIdSelect = (event, { value: lotId }) => {
    const medication = Medications.findOne({ lotIds: { $elemMatch: { lotId } } });
    if (medication) {
      const targetObj = medication.lotIds.find(obj => obj.lotId === lotId);
      const { drug, drugType, minQuantity, isTabs } = medication;
      const { brand, expire, location, donated, note } = targetObj;
      const autoFields = { ...fields, lotId, drug, drugType, expire, brand, minQuantity, isTabs, location,
        donated, note };
      setFields(autoFields);
    } else {
      setFields({ ...fields, lotId });
    }
  };

  // const onBrandSelect = (event, { value }) => {
  //   setFields({ ...fields, brand: value });
  //   // filter drug dropdown
  //   const selector = value ? { brand: value } : {};
  //   const filteredData = distinct('drug', Medications, selector);
  //   // console.log(filteredData);
  //   setFilteredDrugs(filteredData);
  // };

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
                <Form.Select clearable search label='Drug Name' options={getOptions(newDrugs)}
                  placeholder="Benzonatate Capsules" name='drug'
                  onChange={onDrugSelect} value={fields.drug} allowAdditions onAddItem={onAddDrug} />
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable multiple search label='Drug Type(s)' disabled={isDisabled}
                  options={getOptions(drugTypes)} placeholder="Allergy & Cold Medicines"
                  name='drugType' onChange={handleChange} value={fields.drugType}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label='Minimum Quantity' type='number' min={1} name='minQuantity' className='quantity'
                    onChange={handleChange} value={fields.minQuantity} placeholder="100" disabled={isDisabled}/>
                  <Form.Select compact name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                    options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]}
                    disabled={isDisabled} />
                </Form.Group>
              </Grid.Column>
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(newLotIds)}
                  placeholder="Z9Z99" name='lotId'
                  onChange={onLotIdSelect} value={fields.lotId} allowAdditions onAddItem={onAddLotId} />
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Brand' options={getOptions(newBrands)}
                  placeholder="Zonatuss" name='brand'
                  onChange={handleChange} value={fields.brand} allowAdditions onAddItem={onAddBrand} />
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
                <Form.Select compact clearable search label='Location' options={getOptions(locations)}
                  placeholder="Case 2" name='location'
                  onChange={handleChange} value={fields.location}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Quantity' type='number' min={1} name='quantity'
                  onChange={handleChange} value={fields.quantity} placeholder="200"/>
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
    drugs: distinct('drug', Medications),
    drugTypes: distinct('drugType', DrugTypes),
    lotIds: nestedDistinct('lotId', Medications),
    locations: distinct('location', Locations),
    brands: nestedDistinct('brand', Medications),
    ready: typeSub.ready() && locationSub.ready() && medSub.ready(),
  };
})(AddMedication);
