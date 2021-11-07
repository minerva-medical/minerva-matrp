import React, { useState } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Icon } from 'semantic-ui-react';
// import swal from 'sweetalert';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import PropTypes from 'prop-types';
// import { Medications } from '../../api/medication/MedicationCollection';
// import { Historicals } from '../../api/historical/HistoricalCollection';
// import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
// import { distinct, getOptions, nestedDistinct } from '../utilities/Functions';

const NonPatientDispense = () => {
  const [fields, setFields] = useState({
    // TODO: use moment?
    dateDispensed: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    inventoryType: '',
    dispenseType: '',
    dispensedFrom: '',
    note: '',
  });

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  return (
    <Tab.Pane id='dispense-form'>
      <Header as="h2">
        <Header.Content>
          Non-Patient Dispense Form
          <Header.Subheader>
            <i>Dispense inventory that is broken, lost, contaminated, expired, etc.</i>
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
            <Grid.Column>
              <Form.Input label='Dispensed By' name='dispensedFrom' onChange={handleChange}
                value={fields.dispensedFrom} readOnly/>
            </Grid.Column>
            <Grid.Column className='filler-column'/>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form.Select clearable label='Inventory Type' name='inventoryType' options={[]}
                onChange={handleChange} value={fields.inventoryType} />
            </Grid.Column>
            <Grid.Column>
              <Form.Select clearable label='Dispense Type' name='dispenseType' options={[]}
                onChange={handleChange} value={fields.dispenseType} />
            </Grid.Column>
            <Grid.Column className='filler-column'/>
          </Grid.Row>
          {
            true &&
            <>
              <Grid.Row>
                <Grid.Column>
                  <Form.Select clearable search label='Lot Number' options={[]}
                    placeholder="Z9Z99"
                    name='lotId' onChange={handleChange} value={fields.lotId}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Select clearable search label='Drug Name' options={[]}
                    placeholder="Benzonatate Capsules"
                    name='drug' onChange={handleChange} value={fields.drug}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Select clearable search label='Brand' options={[]}
                    placeholder="Zonatuss"
                    name='brand' onChange={handleChange} value={fields.brand}/>
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
                  <Form.Group>
                    <Form.Input label={'Quantity'}
                      type='number' min={1} name='quantity' className='quantity'
                      onChange={handleChange} value={fields.quantity} placeholder='30'/>
                    <Form.Select compact name='isTabs' onChange={handleChange} value={fields.isTabs} className='unit'
                      options={[{ key: 'tabs', text: 'tabs', value: true }, { key: 'mL', text: 'mL', value: false }]} />
                  </Form.Group>
                </Grid.Column>
                <Grid.Column className='filler-column'/>
              </Grid.Row>
            </>
          }
          <Grid.Row>
            <Grid.Column>
              <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
                placeholder="Please add any additional notes, special instructions, or information that should be known here."/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
      <div className='buttons-div'>
        <Button className='clear-button'>Clear Fields</Button>
        <Button className='submit-button' floated='right'>Submit</Button>
      </div>
    </Tab.Pane>
  );
};

export default NonPatientDispense;
