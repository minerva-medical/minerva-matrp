import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Drugs } from '../../api/drug/DrugCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Brands } from '../../api/brand/BrandCollection';
import { Locations } from '../../api/location/LocationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';

/** convert array to dropdown options */
const getOptions = (arr, name) => {
  let options = _.pluck(arr, name);
  options = options.map(elem => ({ key: elem, text: elem, value: elem }));
  return options;
};

/** On submit, insert the data. */
const submit = data => {
  // TODO: handle submit
  swal('Success', JSON.stringify(data), 'success');
};

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

  const handleChange = (event, { name, value, checked }) => {
    setFields({ ...fields, [name]: value !== undefined ? value : checked });
  };

  // handle dropdown search query
  const handleSearch = (event, { name, searchQuery }) => {
    setFields({ ...fields, [name]: searchQuery });
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
                <Form.Select clearable search label='Drug Name' options={getOptions(props.drugs, 'drug')}
                  placeholder="Acetaminophen, Albuterol, etc." name='drug'
                  onChange={handleChange} value={fields.drug} onSearchChange={handleSearch} searchQuery={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable multiple search label='Drug Type(s)'
                  options={getOptions(props.drugTypes, 'drugType')} placeholder="Allergy & Cold Medicines, etc."
                  name='drugType' onChange={handleChange} value={fields.drugType}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Brand' options={getOptions(props.brands, 'brand')}
                  placeholder="Advil, Tylenol, etc." name='brand'
                  onChange={handleChange} value={fields.brand} onSearchChange={handleSearch} searchQuery={fields.brand}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(props.lotIds, 'lotId')}
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
                  onChange={handleChange} value={fields.minQuantity} />
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label='Quantity' type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} />
                  <Form.Select compact name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                    options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]} />
                </Form.Group>
              </Grid.Column>
              <Grid.Column>
                <Form.Select compact clearable search label='Location' options={getOptions(props.locations, 'location')}
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
  const lotIdSub = LotIds.subscribeLotId();
  const locationSub = Locations.subscribeLocation();
  const brandSub = Brands.subscribeBrand();
  return {
    drugs: Drugs.find({}).fetch(),
    drugTypes: DrugTypes.find({}).fetch(),
    lotIds: LotIds.find({}).fetch(),
    locations: Locations.find({}).fetch(),
    brands: Brands.find({}).fetch(),
    ready: drugSub.ready() && typeSub.ready() && lotIdSub.ready() && brandSub.ready() && locationSub.ready(),
  };
})(AddMedication);
