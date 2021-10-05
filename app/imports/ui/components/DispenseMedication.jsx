import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
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
  swal('Success', JSON.stringify(data), 'success');
};

// TODO: simplify
const validateForm = data => {
  const submitData = { ...data, dispensedFrom: data.dispensedFrom || Meteor.user().username };
  let errorMsg = '';
  // the required String fields
  const requiredFields = ['dateDispensed', 'dispensedTo', 'site', 'drug', 'lotId', 'brand', 'quantity'];

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
const DispenseMedication = (props) => {
  const [fields, setFields] = useState({
    site: '',
    newSite: '',
    dateDispensed: new Date().toLocaleDateString('fr-CA'),
    drug: '',
    quantity: '',
    isTabs: true,
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
                <Form.Input type="date" label='Date Dispensed' name='dateDispensed'
                  onChange={handleChange} value={fields.dateDispensed}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input label='Dispensed By' name='dispensedFrom' onChange={handleChange}
                  value={fields.dispensedFrom || props.currentUser.username} readOnly/>
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
                  placeholder="Acetaminophen, Albuterol, etc."
                  name='drug' onChange={handleChange} value={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Lot Number' options={getOptions(props.lotIds, 'lotId')}
                  placeholder="01ABC..."
                  name='lotId' onChange={handleChange} value={fields.lotId}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
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
                <Form.Select clearable search label='Brand' options={getOptions(props.brands, 'brand')}
                  placeholder="Moderna, Tylenol, etc."
                  name='brand' onChange={handleChange} value={fields.brand}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label='Quantity (tabs/mL)' type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} />
                  <Form.Select name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                    options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]} />
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
                  placeholder="Please write any additional notes, special instructions, or information that
                should be known here"/>
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
