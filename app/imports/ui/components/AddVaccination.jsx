import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Input, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Sites } from '../../api/site/SiteCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Brands } from '../../api/brand/BrandCollection';
import { Locations } from '../../api/location/LocationCollection';

/** convert array to dropdown options */
const getOptions = (arr, name) => {
  let options = _.pluck(arr, name);
  options = options.map(elem => ({ key: elem, text: elem, value: elem }));
  if (name === 'site') {
    options.push({ key: 'OTHER', text: 'OTHER', value: 'OTHER' });
  }
  return options;
};

/** On submit, insert the data. */
const submit = data => {
  // TODO: handle submit
  swal('Success', JSON.stringify(data), 'success');
};

// TODO: simplify
const validateForm = data => {
  const submitData = { ...data, dispensedFrom: data.dispensedFrom || Meteor.user().username };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['dateAdded', 'site', 'drug', 'lotId', 'brand', 'quantity'];

  // check required fields
  requiredFields.forEach(field => {
    if (!submitData[field]) {
      errorMsg += `${field} cannot be empty.\n`;
    }
  });

  // check new site; submit either site or newSite
  if (submitData.site === 'OTHER') {
    if (!submitData.newSite) {
      errorMsg += 'newSite cannot be empty.\n';
    } else {
      delete submitData.site;
    }
  } else {
    delete submitData.newSite;
  }

  if (errorMsg) {
    swal('Error', `${errorMsg}`, 'error');
  } else {
    submit(submitData);
  }
};

/** Renders the Page for Dispensing Inventory. */
const AddVaccination = (props) => {
  const [fields, setFields] = useState({
    site: '',
    newSite: '',
    dateAdded: new Date().toLocaleDateString('fr-CA'),
    drug: '',
    quantity: '',
    unit: '', // unit will autofill on selection of drug
    brand: '',
    lotId: '',
    expire: '',
    dispensedFrom: '',
    donorName: '',
    location: '',
    note: '',
    pd: '',
  });

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  const pd = [
    { key: '0', text: 'Purchased', value: 'Purchased' },
    { key: '1', text: 'Donated', value: 'Donated' },
  ];

  if (props.ready) {
    return (
      <Tab.Pane id='add-form'>
        <Header as="h2">
          <Header.Content>
            Add Vaccination to Inventory Form
            <Header.Subheader>
              <i>Please input all relative fields to add a vaccine to the inventory</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Input type="date" label='Date Added' name='dateAdded'
                            onChange={handleChange} value={fields.dateDispensed}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select label='Purchased/Donated' name='pd' options={pd}
                             onChange={handleChange} value={fields.pd}/>
                {
                  fields.pd === 'Donated' &&
                  <Form.Input placeholder="Input Donor Name Here"
                              name='donorName' onChange={handleChange}/>
                }
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(props.sites, 'site')}
                             placeholder="POST, Kaka’ako, etc."
                             name='site' onChange={handleChange} value={fields.site}/>
                {
                  fields.site === 'OTHER' &&
                  <Form.Input name='newSite' onChange={handleChange} value={fields.newSite}/>
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Drug Name' options={getOptions(props.drugs, 'drug')}
                             name='drug' onChange={handleChange} value={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(props.lotIds, 'lotId')}
                             name='lotId' onChange={handleChange} value={fields.lotId}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Location' options={getOptions(props.locations, 'location')}
                             name='location' onChange={handleChange} value={fields.location}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {/* expiration date may be null */}
                <Form.Input type='date' label='Expiration Date' className='date-input'
                            name='expire' onChange={handleChange} value={fields.expire}/>
                <Icon name='x' className='x-icon' onClick={() => setFields({ ...fields, expire: '' })}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Brand' options={getOptions(props.brands, 'brand')}
                             name='brand' onChange={handleChange} value={fields.brand}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Quantity (tabs/mL)</label>
                  <Input
                    label={{ basic: true, content: fields.quantity ? 'tabs' : '' }} labelPosition='right'
                    type='number' min={1} onChange={handleChange} value={fields.quantity} name='quantity'/>
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
AddVaccination.propTypes = {
  currentUser: PropTypes.object,
  sites: PropTypes.array.isRequired,
  drugs: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const siteSub = Sites.subscribeSite();
  const drugSub = Drugs.subscribeDrug();
  const lotIdSub = LotIds.subscribeLotId();
  const locationSub = Locations.subscribeLocation();
  const brandSub = Brands.subscribeBrand();
  return {
    currentUser: Meteor.user(),
    sites: Sites.find({}).fetch(),
    drugs: Drugs.find({}).fetch(),
    lotIds: LotIds.find({}).fetch(),
    locations: Locations.find({}).fetch(),
    brands: Brands.find({}).fetch(),
    ready: siteSub.ready() && drugSub.ready() && lotIdSub.ready() && brandSub.ready() && locationSub.ready(),
  };
})(AddVaccination);