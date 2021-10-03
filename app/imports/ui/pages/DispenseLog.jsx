import React from 'react';
import { Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Icon, Loader, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
// import { _ } from 'meteor/underscore';
import { Historicals } from '../../api/historical/HistoricalCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Locations } from '../../api/location/LocationCollection';

/** Renders the Page for Dispensing Inventory. */
const limitOptions = [
  { key: '0', value: '10', text: '10' },
  { key: '1', value: '25', text: '25' },
  { key: '2', value: '50', text: '50' },
  { key: '3', value: '100', text: '100' },
];

const sort = [
  { key: '0', value: 'Most Recent', text: 'Most Recent' },
  { key: '1', value: 'Oldest to Newest', text: 'Oldest to Newest' },
];

const reason = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Patient Use', text: 'Patient Use' },
  { key: '2', value: 'Expired', text: 'Expired' },
  { key: '3', value: 'Broken/Contaminated', text: 'Broken/Contaminated' },
];

const inventory = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Medication', text: 'Medication' },
  { key: '2', value: 'Vaccination', text: 'Vaccination' },
  { key: '3', value: 'Patient Supplies', text: 'Patient Supplies' },
  { key: '4', value: 'Lab Testing Supplies', text: 'Lab Testing Supplies' },
];

/** Render the form. */
const DispenseLog = (props) => {
  if (props.ready) {
    return (
      <div>
        <Container id='dispense-log'>
          <Grid id='dispense-log-grid' centered>
            <Segment>
              <Header as="h2">
                <Header.Content>
                  History Dispense Log
                  <Header.Subheader>
                    <i>Use the search filter to check for a specific drug or click on the table header to sort the
                      column.</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Divider/>
              <Grid>
                <Grid.Column width={4}>
                  <Input placeholder='Filter by patient number...' icon='search'/>
                </Grid.Column>
              </Grid>
              <Divider/>
              <Grid divided columns="equal">
                <Grid.Row textAlign='center'>
                  <Grid.Column>
                    Sort By: {' '}
                    <Dropdown
                      inline={true}
                      options={sort}
                      defaultValue={'Most Recent'}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    Dispense Type: {' '}
                    <Dropdown
                      inline={true}
                      options={reason}
                      defaultValue={'All'}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    Inventory Type: {' '}
                    <Dropdown
                      inline={true}
                      options={inventory}
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
                  options={limitOptions}
                  defaultValue={'10'}
                />
                Total count: {'200'}
              </div>
              <Table striped singleLine columns={11}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Date & Time</Table.HeaderCell>
                    <Table.HeaderCell>Dispense Type</Table.HeaderCell>
                    <Table.HeaderCell>Patient Number</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Medication</Table.HeaderCell>
                    <Table.HeaderCell>Brand</Table.HeaderCell>
                    <Table.HeaderCell>LotId</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Dispensed by</Table.HeaderCell>
                    <Table.HeaderCell>Detailed Notes</Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>2021-09-13 (12:25:30)</Table.Cell>
                    <Table.Cell>Patient Use</Table.Cell>
                    <Table.Cell>123456</Table.Cell>
                    <Table.Cell>Analgesics/Anti-Inflammatory</Table.Cell>
                    <Table.Cell>Acetaminophen 500 mg Caps</Table.Cell>
                    <Table.Cell>76543A21</Table.Cell>
                    <Table.Cell>60 tabs</Table.Cell>
                    <Table.Cell>johndoe@hawaii.edu</Table.Cell>
                    <Table.Cell><Icon name="info circle"/>See details</Table.Cell>
                    <Table.Cell><Icon name="info circle"/>See details</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan="11">
                      <Pagination totalPages={10} activePage={1}/>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Segment>
          </Grid>
        </Container>
      </div>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

DispenseLog.propTypes = {
  historicals: PropTypes.array.isRequired,
  drugTypes: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const historicalSub = Historicals.subscribeHistorical();
  const drugTypeSub = DrugTypes.subscribeDrugType();
  const locationSub = Locations.subscribeLocation();
  // Determine if the subscription is ready
  const ready = historicalSub.ready() && drugTypeSub.ready() && locationSub.ready();
  // Get the Stuff documents and sort them by name.
  const historicals = Historicals.find({}, { sort: { dateDispensed: 1 } }).fetch();
  const drugTypes = DrugTypes.find({}).fetch();
  const locations = Locations.find({}).fetch();
  return {
    historicals,
    drugTypes,
    locations,
    ready,
  };
})(DispenseLog);
