import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Input } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Sites } from '../../api/site/SiteCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Brands } from '../../api/brand/BrandCollection';

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
  // swal('Success', 'Item added successfully', 'success');
  swal('Success', JSON.stringify(data), 'success');
};

// TODO: simplify
const validateForm = data => {
  let errorMsg = '';
  if (!data.dispensedTo) {
    errorMsg += 'Dispensed To cannot be empty.\n';
  }
  if (!data.site) {
    errorMsg += 'Site cannot be empty.\n';
  }
  if (!data.drug) {
    errorMsg += 'Drug Name cannot be empty.\n';
  }
  if (!data.lotId) {
    errorMsg += 'Lot Number cannot be empty.\n';
  }
  if (!data.brand) {
    errorMsg += 'Brand cannot be empty.\n';
  }
  if (!data.quantity) {
    errorMsg += 'Quantity cannot be empty.\n';
  }
  if (errorMsg) {
    swal('Error', `${errorMsg}`, 'error');
  } else {
    submit(data);
  }
};

/** Renders the Page for Dispensing Inventory. */
const DispenseMedication = (props) => {
  const [fields, setFields] = useState({
    site: '',
    newSite: '',
    dateDispensed: new Date().toLocaleDateString('fr-CA'),
    drug: '',
    quantity: '',
    brand: '',
    lotId: '',
    expire: '',
    dispensedTo: '',
    dispensedFrom: '',
    note: '',
  });

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  if (props.ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
            Dispense from Inventory Form
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
                <Form.Input type="date" label='Date Dispensed' name='dateDispensed' className='date-input'
                  onChange={handleChange} value={fields.dateDispensed}/>
              </Grid.Column>
              <Grid.Column />
              <Grid.Column />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input label='Dispensed By' name='dispensedFrom' onChange={handleChange}
                  value={fields.dispensedFrom || props.currentUser.username}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Dispensed To' placeholder="Patient's First Name, Last Name"
                  name='dispensedTo' onChange={handleChange} value={fields.dispensedTo}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(props.sites, 'site')}
                  placeholder="POST, Kaka’ako, etc."
                  name='site' onChange={handleChange} value={fields.site}/>
                {
                  fields.site === 'OTHER' &&
                  <Form.Input name='newSite' onChange={handleChange} value={fields.newSite}/>
                }
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Drug Name' options={getOptions(props.drugs, 'drug')}
                  name='drug' onChange={handleChange} value={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(props.lotIds, 'lotId')}
                  name='lotId' onChange={handleChange} value={fields.lotId}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input type='date' label='Expiration Date' className='date-input'
                  name='expire' onChange={handleChange} value={fields.expire}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Brand' options={getOptions(props.brands, 'brand')}
                  name='brand' onChange={handleChange} value={fields.brand}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Quantity</label>
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
DispenseMedication.propTypes = {
  currentUser: PropTypes.object,
  sites: PropTypes.array.isRequired,
  drugs: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const siteSub = Sites.subscribeSite();
  const drugSub = Drugs.subscribeDrug();
  const lotIdSub = LotIds.subscribeLotId();
  const brandSub = Brands.subscribeBrand();
  return {
    currentUser: Meteor.user(),
    sites: Sites.find({}).fetch(),
    drugs: Drugs.find({}).fetch(),
    lotIds: LotIds.find({}).fetch(),
    brands: Brands.find({}).fetch(),
    ready: siteSub.ready() && drugSub.ready() && lotIdSub.ready() && brandSub.ready(),
  };
})(DispenseMedication);
