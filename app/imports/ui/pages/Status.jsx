import React from 'react';
import { Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Input,
  Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Medications } from '../../api/medication/MedicationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Locations } from '../../api/location/LocationCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import MedStatusRow from '../components/MedStatusRow';

/** Renders the Page for Dispensing Inventory. */

/** convert array to dropdown options */
const getOptions = (arr, name) => {
  const options = _.pluck(arr, name).map(elem => ({ key: elem, text: elem, value: elem }));
  options.unshift({ key: '0', value: 'All', text: 'All' });
  return options;
};

const recordOptions = [
  { key: '0', value: '10', text: '10' },
  { key: '1', value: '25', text: '25' },
  { key: '2', value: '50', text: '50' },
  { key: '3', value: '100', text: '100' },
];

// TODO: do we need a brand filter?
const medicationBrand = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Tylenol', text: 'Tylenol' },
  { key: '2', value: 'Fluticasone', text: 'Fluticasone' },
  { key: '3', value: 'Advair', text: 'Advair' },
  { key: '4', value: 'Dex4', text: 'Dex4' },
  { key: '5', value: 'Janumet XR', text: 'Janumet XR' },
  { key: '6', value: 'Glyxambi', text: 'Glyxambi' },
  { key: '7', value: 'Advil', text: 'Advil' },
  { key: '8', value: 'Emergency Kit', text: 'Emergency Kit' },
  { key: '9', value: 'Chloraseptic', text: 'Chloraseptic' },
];

/** Render the form. */
const Status = (props) => {
  if (props.ready) {
    return (
      <Container id={PAGE_IDS.MED_STATUS}>
        <Segment>
          <Header as="h2">
            <Header.Content>
                Inventory Status
              <Header.Subheader>
                <i>Use the search filter to check for a specific drug or
                    click on the table header to sort the column.</i>
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Column width={4}>
              <Input placeholder='Filter by drug name...' icon='search'/>
            </Grid.Column>
          </Grid>
          <Divider/>
          <Grid divided columns="equal">
            <Grid.Row textAlign='center'>
              <Grid.Column>
                  Type of Medication: {' '}
                <Dropdown
                  inline={true}
                  options={getOptions(props.drugTypes, 'drugType')}
                  search
                  defaultValue={'All'}
                />
              </Grid.Column>
              <Grid.Column>
                  Medication Brand: {' '}
                <Dropdown
                  inline={true}
                  options={medicationBrand}
                  search
                  defaultValue={'All'}
                />
              </Grid.Column>
              <Grid.Column>
                  Medication Location: {' '}
                <Dropdown
                  inline={true}
                  options={getOptions(props.locations, 'location')}
                  search
                  defaultValue={'All'}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          <div>
              Records per page:{' '}
            <Dropdown
              inline={true}
              options={recordOptions}
              defaultValue={'10'}
            />
              Total count: {'200'}
          </div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Medication</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Brand</Table.HeaderCell>
                <Table.HeaderCell>LotId</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Location</Table.HeaderCell>
                <Table.HeaderCell>Expiration</Table.HeaderCell>
                <Table.HeaderCell>Purchased</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                props.medications.map(med => <MedStatusRow key={med._id} med={med} />)
              }
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="10">
                  <Pagination totalPages={10} activePage={1}/>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Segment>
      </Container>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

Status.propTypes = {
  medications: PropTypes.array.isRequired,
  drugTypes: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  const drugTypeSub = DrugTypes.subscribeDrugType();
  const locationSub = Locations.subscribeLocation();
  // Determine if the subscription is ready
  const ready = medSub.ready() && drugTypeSub.ready() && locationSub.ready();
  // Get the Stuff documents and sort them by name.
  const medications = Medications.find({}, { sort: { drug: 1 } }).fetch();
  const drugTypes = DrugTypes.find({}).fetch();
  const locations = Locations.find({}).fetch();
  return {
    medications,
    drugTypes,
    locations,
    ready,
  };
})(Status);
