import React from 'react';
import { Grid, Header, Form, Button, Container, Segment } from 'semantic-ui-react';
// import swal from 'sweetalert';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';

/** Renders the Page for Dispensing Inventory. */
class AddInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inventoryItem: undefined,
      drugName: undefined,
      drugBrand: undefined,
      lotNum: undefined,
      expDate: new Date().toISOString().slice(0, 10),
      quantity: undefined,
      locationDesc: undefined,
      purchasedDonated: undefined,
      donatedIdentity: undefined,
      site: undefined,
      additionalInfo: undefined,
    };

    this.inventoryItemType = [
      { key: '0', text: 'Medication', value: 'Medication' },
      { key: '1', text: 'Vaccination', value: 'Vaccination' },
      { key: '2', text: 'Patient Supplies', value: 'Patient Supplies' },
      { key: '3', text: 'Lab Testing Supplies', value: 'Lab Testing Supplies' },
    ];

    this.pd = [
      { key: '0', text: 'Purchased', value: 0 },
      { key: '1', text: 'Donated', value: 1 },
    ];
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** On submit, insert the data. */
  submit = event => {
    event.preventDefault();

    console.log('submitted');
  }

  /** convert array to dropdown options */
  getOptions = name => {
    let options = _.pluck(this.props[`${name}s`], name);
    options = options.map(elem => ({
      key: elem,
      text: elem,
      value: elem,
    }));
    if (name === 'site') {
      options.push({ key: 'OTHER', text: 'OTHER', value: 'OTHER' });
    }
    return options;
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (
      <Container id='add-form' text style={{ marginTop: '1em' }}>
        <Header as="h2">
          <Header.Content>
            Add to Inventory Form
            <Header.Subheader>
              <i>Please input all fields to add to the inventory</i>
            </Header.Subheader>
          </Header.Content>
        </Header>

        <Form onSubmit={this.submit}>
          <Segment text style={{ marginTop: '1em' }}>
            <Grid columns='equal'>
              <Grid.Row>
                <Grid.Column>
                  <Form.Select label='Item to be Added to the Inventory' name='inventoryItem'
                               onChange={this.handleChange} value={this.state.inventoryItem}
                               options={this.inventoryItemType}
                               placeholder="Medication / Vaccination / Patient Supplies / Lab Testing Supplies"/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Input label='Drug Name/Type:' name='drugName'
                              onChange={this.handleChange} value={this.state.drugName}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Input label='Brand:' name='drugBrand'
                              onChange={this.handleChange} value={this.state.drugBrand}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Input label='Lot Number' name='lotNum'
                              onChange={this.handleChange} value={this.state.lotNum}
                              placeholder="#A07812309"
                  />
                </Grid.Column>
                <Grid.Column>
                  <Form.Input type="date" label='Expiration Date' name='expDate'
                              onChange={this.handleChange} value={this.state.expDate}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Input label='Quantity' name='quantity'
                              onChange={this.handleChange} value={this.state.quantity}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Input label='Storage Location Description' name='locationDesc'
                              onChange={this.handleChange} value={this.state.locationDesc}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Select label='Purchased or Donated?' name='pd'
                               onChange={this.handleChange} value={this.state.purchasedDonated}
                               options={this.pd} placeholder="Purchased / Donated"/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Input label='If Donated, by who?' name='donatedIdentity'
                              onChange={this.handleChange} value={this.state.donatedIdentity}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Input label='Site' name='site'
                              onChange={this.handleChange} value={this.state.site}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Input label='Additional Information' name='additionalInfo' rows={2}
                              onChange={this.handleChange} value={this.state.additionalInfo}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <div className='submit-button'>
                  <Button type='submit' text style={{ marginTop: '1em', marginLeft: '1em' }}
                          color="green" floated="right">Submit</Button>
                </div>
              </Grid.Row>
            </Grid>
          </Segment>
        </Form>
      </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
AddInventory.propTypes = {
  ready: PropTypes.bool.isRequired,
};

export default AddInventory;
