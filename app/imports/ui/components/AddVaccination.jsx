import React, { useState, useEffect } from 'react';
import { Grid, Header, Form, Button, Tab, Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Sites } from '../../api/site/SiteCollection';
import { Locations } from '../../api/location/LocationCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Vaccinations } from '../../api/vaccination/VaccinationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { distinct, getOptions, nestedDistinct } from '../utilities/Functions';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';

/** On submit, insert the data. */
const submit = (data, callback) => {
  const { vaccine, minQuantity, quantity, visDate, brand, lotId, expire, location, donated, donatedBy, note } = data;
  const collectionName = Vaccinations.getCollectionName();
  const exists = Vaccinations.findOne({ vaccine }); // returns the existing medication or undefined

  // if the medication does not exist:
  if (!exists) {
    // insert the new medication and lotId
    const newLot = { lotId, expire, location, quantity, donated, donatedBy, note };
    const definitionData = { vaccine, brand, minQuantity, visDate, lotIds: [newLot] };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${vaccine}, ${lotId} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  } else {
    const { lotIds } = exists;
    // const targetIndex = lotIds.findIndex((obj => obj.lotId === lotId));
    const target = lotIds.find(obj => obj.lotId === lotId);
    // if lotId exists, increment the quantity:
    if (target) {
      target.quantity += quantity;
    } else {
      // else append the new lotId
      lotIds.push({ lotId, brand, expire, visDate, location, quantity, donated, donatedBy, note });
    }
    const updateData = { id: exists._id, lotIds };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${vaccine} updated successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/** validates the add vaccination form */
const validateForm = (data, callback) => {
  const submitData = { ...data };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['vaccine', 'brand', 'minQuantity', 'visDate', 'lotId', 'brand', 'location', 'quantity'];

  // if the field is empty, append error message
  requiredFields.forEach(field => {
    if (!submitData[field] || (field === 'vaccine' && !submitData.vaccine.length)) {
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
const AddVaccination = ({ ready, vaccines, locations, lotIds, brands }) => {
  const [fields, setFields] = useState({
    vaccine: '',
    brand: '',
    minQuantity: '',
    visDate: '',
    lotId: '',
    expire: '',
    location: '',
    quantity: '',
    donated: false,
    donatedBy: '',
    note: '',
  });
  const isDisabled = vaccines.includes(fields.vaccine);

  // a copy of vaccines, lotIds, and brands and their respective filters
  const [newVaccines, setNewVaccines] = useState([]);
  useEffect(() => {
    setNewVaccines(vaccines);
  }, [vaccines]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  useEffect(() => {
    setFilteredVaccines(vaccines);
  }, [vaccines]);
  const [newBrands, setNewBrands] = useState([]);
  useEffect(() => {
    setNewBrands(brands);
  }, [brands]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  useEffect(() => {
    setFilteredBrands(brands);
  }, [brands]);
  const [newLotIds, setNewLotIds] = useState([]);
  useEffect(() => {
    setNewLotIds(lotIds);
  }, [lotIds]);
  const [filteredLotIds, setFilteredLotIds] = useState([]);
  useEffect(() => {
    setFilteredLotIds(newLotIds);
  }, [newLotIds]);

  // handles adding a new vaccine; IS case sensitive
  const onAddVaccine = (event, { value }) => {
    if (!newVaccines.map(vaccine => vaccine.toLowerCase()).includes(value.toLowerCase())) {
      setNewVaccines([...newVaccines, value]);
    }
  };
  // handles adding a new lotId; IS NOT case sensitive
  const onAddLotId = (event, { value }) => {
    if (!newLotIds.includes(value)) {
      setNewLotIds([...newLotIds, value]);
    }
  };

  // handles adding a new brand; IS case sensitive
  const onAddBrand = (event, { value }) => {
    if (!newBrands.map(brand => brand.toLowerCase()).includes(value.toLowerCase())) {
      setNewBrands([...newBrands, value]);
    }
  };

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

  // handles vaccine select
  const onVaccineSelect = (event, { value: vaccine }) => {
    const target = Vaccinations.findOne({ vaccine });
    // if the drug exists:
    if (target) {
      // autofill the form with specific drug info
      const { minQuantity, lotIds: lotIdObjs } = target;
      setFields({ ...fields, vaccine, minQuantity });
      // filter lotIds and brands
      // TODO: sort?
      setFilteredLotIds(_.pluck(lotIdObjs, 'lotId'));
      // setFilteredBrands(_.uniq(_.pluck(lotIdObjs, 'brand')));
    } else {
      // else reset specific drug info
      setFields({ ...fields, vaccine, minQuantity: '', expire: '', visDate: '',
        brand: '', location: '', donated: false, donatedBy: '', note: '' });
      // reset the filters
      setFilteredLotIds(newLotIds);
      setFilteredBrands(newBrands);
    }
  };

  // handles lotId select
  const onLotIdSelect = (event, { value: lotId }) => {
    const target = Vaccinations.findOne({ lotIds: { $elemMatch: { lotId } } });
    // if the lotId exists:
    if (target) {
      // autofill the form with specific lotId info
      const targetLotIds = target.lotIds.find(obj => obj.lotId === lotId);
      const { vaccine, minQuantity, brand, visDate } = target;
      const { expire, location, donated, donatedBy, note } = targetLotIds;
      const autoFields = { ...fields, lotId, vaccine, expire, brand, visDate, minQuantity, location,
        donated, donatedBy, note };
      setFields(autoFields);
    } else {
      // else reset specific lotId info
      setFields({ ...fields, lotId, expire: '', visDate: '', location: '', donated: false, donatedBy: '', note: '' });
      setFilteredBrands(newBrands);
    }
  };

  // handles brand select
  const onBrandSelect = (event, { value: brand }) => {
    setFields({ ...fields, brand });
    // filter drugs
    const filter = distinct('vaccine', Vaccinations, { brand });
    if (filter.length && !fields.vaccine) {
      setFilteredVaccines(filter);
    } else {
      setFilteredVaccines(newVaccines);
    }
  };

  const clearForm = () => {
    setFields({ vaccine: '', brand: '', minQuantity: '', visDate: '', lotId: '', expire: '',
      location: '', quantity: '', donated: false, donatedBy: '', note: '' });
    setFilteredVaccines(newVaccines);
    setFilteredLotIds(newLotIds);
    setFilteredBrands(newBrands);
  };

  if (ready) {
    return (
      <Tab.Pane id={COMPONENT_IDS.ADD_FORM}>
        <Header as="h2">
          <Header.Content>
              Add Vaccine to Inventory Form
            <Header.Subheader>
              <i>Please input all relative fields to add a vaccine to the inventory</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Vaccine Name'
                  placeholder=" J&J COVID" name='vaccine' options={getOptions(filteredVaccines)}
                  onChange={onVaccineSelect} value={fields.vaccine}
                  allowAdditions onAddItem={onAddVaccine} id={COMPONENT_IDS.ADD_VACCINATION_VACCINE}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              {/* TODO: expand drug type column */}
              <Grid.Column>
                <Form.Select clearable search label='Manufacturer Brand'
                  placeholder="ACAM2000 Sanofi Pasteur" options={getOptions(filteredBrands)}
                  name='brand' onChange={onBrandSelect} value={fields.brand}
                  allowAdditions onAddItem={onAddBrand} id={COMPONENT_IDS.ADD_VACCINATION_BRAND}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Minimum Quantity' type='number' min={1} name='minQuantity' className='quantity'
                  onChange={handleChange} value={fields.minQuantity} disabled={isDisabled}
                  placeholder="100" id={COMPONENT_IDS.ADD_VACCINATION_MIN_QUANTITY}/>
              </Grid.Column>
              <Grid.Column className='filler-column'/>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number'
                  placeholder="Z9Z99" name='lotId' options={getOptions(filteredLotIds)} onChange={onLotIdSelect}
                  value={fields.lotId} allowAdditions onAddItem={onAddLotId} id={COMPONENT_IDS.ADD_VACCINATION_LOT}/>
              </Grid.Column>
              <Grid.Column>
                {/* expiration date may be null */}
                <Form.Input type='date' label='Expiration Date' name='expire'
                  onChange={handleChange} value={fields.expire} id={COMPONENT_IDS.ADD_VACCINATION_EXPIRATION}/>
              </Grid.Column>
              <Grid.Column>
                {/* expiration date may be null */}
                <Form.Input type='date' label='VIS Date' name='visDate'
                  onChange={handleChange} value={fields.visDate}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select compact clearable search label='Location'
                  placeholder="Case 2" name='location' options={getOptions(locations)}
                  onChange={handleChange} value={fields.location} id={COMPONENT_IDS.ADD_VACCINATION_LOCATION}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Quantity' type='number' min={1} name='quantity'
                  onChange={handleChange} value={fields.quantity} placeholder="200"
                  id={COMPONENT_IDS.ADD_VACCINATION_QUANTITY}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Donated</label>
                  <Form.Group>
                    <Form.Checkbox name='donated' className='donated-field'
                      onChange={handleCheck} checked={fields.donated} id={COMPONENT_IDS.ADD_VACCINATION_DONATED}/>
                    <Form.Input name='donatedBy' className='donated-by-field' placeholder='Donated By'
                      onChange={handleChange} value={fields.donatedBy} disabled={!fields.donated}/>
                  </Form.Group>
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
                  id={COMPONENT_IDS.ADD_VACCINATION_NOTES}
                  placeholder="Please add any additional notes, special instructions, or information that should be known here."/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <div className='buttons-div'>
          <Button className='clear-button'onClick={clearForm} id={COMPONENT_IDS.ADD_VACCINATION_CLEAR}>Clear Fields</Button>
          <Button className='submit-button' floated='right' onClick={() => validateForm(fields, clearForm)}
            id={COMPONENT_IDS.ADD_VACCINATION_SUBMIT}>Submit</Button>
        </div>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Stuff documents in the props. */
AddVaccination.propTypes = {
  currentUser: PropTypes.object,
  sites: PropTypes.array.isRequired,
  vaccines: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// Currently vaccination subscribes to same drugType collection as medication collection.
/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const typeSub = DrugTypes.subscribeDrugType();
  const locationSub = Locations.subscribeLocation();
  const vacSub = Vaccinations.subscribeVaccination();
  return {
    currentUser: Meteor.user(),
    sites: Sites.find({}).fetch(),
    vaccines: distinct('vaccine', Vaccinations),
    lotIds: nestedDistinct('lotId', Vaccinations),
    locations: distinct('location', Locations),
    brands: distinct('brand', Vaccinations),
    ready: typeSub.ready() && locationSub.ready() && vacSub.ready(),

  };
})(AddVaccination);
