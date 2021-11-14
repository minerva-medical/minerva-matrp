import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader } from 'semantic-ui-react';
// import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Sites } from '../../api/site/SiteCollection';
import { Supplys } from '../../api/supply/SupplyCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
// import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions } from '../utilities/Functions';

/** handle submit for Dispense Patient Supply. */

/** validates the dispense patient supply form */

/** Renders the Page for Dispensing Patient Supply. */
const DispensePatientSupplies = ({ currentUser, ready, sites, supplys }) => {
  const [fields, setFields] = useState({
    site: '',
    dateDispensed: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    supply: '',
    supplyType: '',
    stock: '',
    quantity: '',
    location: '',
    dispensedTo: '',
    dispensedFrom: '',
    note: '',
  });

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  // handle dropdown search query
  const handleSearch = (event, { name, searchQuery }) => {
    setFields({ ...fields, [name]: searchQuery });
  };

  const clearForm = () => setFields({ site: '', drug: '', quantity: '', unit: 'tab(s)', brand: '', lotId: '',
    expire: '', dispensedTo: '', dispensedFrom: '', note: '' });

  if (props.ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
            Dispense from Patient Supplies Inventory Form
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
                <Form.Input type="datetime-local" label='Date Dispensed' name='dateDispensed'
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
                <Form.Input label='Dispensed To' placeholder="Patient Number"
                  name='dispensedTo' onChange={handleChange} value={fields.dispensedTo}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(props.sites)}
                  placeholder="Kaka’ako" name='site'
                  onChange={handleChange} value={fields.site} onSearchChange={handleSearch} searchQuery={fields.site}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Supply Name' options={getOptions(props.drugs)}
                  placeholder="Wipes & Washables/Test Strips/Brace"
                  name='drug' onChange={handleChange} value={fields.drug}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Input label='Quantity' type='number' min={1} name='quantity' className='quantity'
                    onChange={handleChange} value={fields.quantity} placeholder='30'/>
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
          <Button className='clear-button' onClick={clearForm}>Clear Fields</Button>
          <Button className='submit-button' floated='right' onClick={() => validateForm(fields, clearForm)}>Submit</Button>
        </div>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Sites, Drugs, LotIds, and Brands in the props. */
DispensePatientSupplies.propTypes = {
  currentUser: PropTypes.object,
  sites: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const supSub = Supplys.subscribeSupply();
  const historySub = Historicals.subscribeHistorical(); // this will be used soon
  const siteSub = Sites.subscribeSite();
  return {
    // TODO: exclude 'N/A'
    currentUser: Meteor.user(),
    sites: distinct('site', Sites),
    supply: distinct('supply', Supplys),
    ready: siteSub.ready() && historySub.ready() && supSub.ready(),
  };
})(DispensePatientSupplies);
