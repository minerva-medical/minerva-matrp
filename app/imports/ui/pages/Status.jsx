import React, { useState, useEffect } from 'react';
import {
  Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Input,
  Loader, Icon, Popup,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Locations } from '../../api/location/LocationCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import MedStatusRow from '../components/MedStatusRow';
import { distinct, getOptions } from '../utilities/Functions';

// convert array to dropdown options
const getFilters = (arr) => [{ key: 'All', value: 0, text: 'All' }, ...getOptions(arr)];

const recordOptions = [
  // { key: 0, value: 10, text: '10' },
  { key: 1, value: 25, text: '25' },
  { key: 2, value: 50, text: '50' },
  { key: 3, value: 100, text: '100' },
];

const statusOptions = [
  { key: 'All', value: 0, text: 'All' },
  { key: 1, value: 'In Stock', text: 'In Stock' },
  { key: 2, value: 'Low Stock', text: 'Low Stock' },
  { key: 3, value: 'Out of Stock', text: 'Out of stock' },
];

// Render the form.
const Status = ({ ready, medications, drugTypes, locations, brands }) => {
  const [filteredMedications, setFilteredMedications] = useState([]);
  useEffect(() => {
    setFilteredMedications(medications);
  }, [medications]);

  const [searchQuery, setSearchQuery] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [typeFilter, setTypeFilter] = useState(0);
  const [brandFilter, setBrandFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState(0);
  const [maxRecords, setMaxRecords] = useState(25);

  // handles filtering
  useEffect(() => {
    let filter = JSON.parse(JSON.stringify(medications));
    if (searchQuery) {
      // filter = filter.filter((medication) => medication.drug.toLowerCase().includes(searchQuery.toLowerCase()));
      filter = filter.filter((medication) => (
        medication.drug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.expire.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.lotId.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
    if (typeFilter) {
      filter = filter.filter((medication) => medication.drugType.includes(typeFilter));
    }
    if (brandFilter) {
      filter = filter.filter((medication) => medication.brand === brandFilter);
    }
    if (locationFilter) {
      filter = filter.filter((medication) => medication.location === locationFilter);
    }
    if (statusFilter) {
      filter = filter.filter((medication) => {
        const percent = medication.quantity / medication.minQuantity;
        if (statusFilter === 'In Stock') {
          return percent > 0.3;
        }
        if (statusFilter === 'Low Stock') {
          return (percent > 0.05 && percent <= 0.3);
        }
        if (statusFilter === 'Out of Stock') {
          return percent <= 0.05;
        }
        return true;
      });
    }
    setFilteredMedications(filter);
  }, [searchQuery, typeFilter, brandFilter, locationFilter, statusFilter]);

  const handleSearch = (event, { value }) => setSearchQuery(value);
  const handleTypeFilter = (event, { value }) => setTypeFilter(value);
  const handleBrandFilter = (event, { value }) => setBrandFilter(value);
  const handleLocationFilter = (event, { value }) => setLocationFilter(value);
  const handleStatusFilter = (event, { value }) => setStatusFilter(value);
  const handleRecordLimit = (event, { value }) => setMaxRecords(value);

  if (ready) {
    return (
      <Container id={PAGE_IDS.MED_STATUS}>
        <Segment>
          <Header as="h2">
            <Header.Content>
                Inventory Status
              <Header.Subheader>
                <i>Use the search filter to check for a specific drug or
                    use the dropdown filters.</i>
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Column width={4}>
              <Input placeholder='Filter by drug name...' icon='search'
                onChange={handleSearch} value={searchQuery} />
              <Popup
                trigger={<Icon name='question circle' color="blue"/>}
                content='This allows you to filter the Inventory by medication, brand, LotID, location, and expiration.'
                inverted
              />
            </Grid.Column>
          </Grid>
          <Divider/>
          <Grid divided columns="equal">
            <Grid.Row textAlign='center'>
              <Grid.Column>
                  Medication Type: {' '}
                <Dropdown inline options={getFilters(drugTypes)} search
                  onChange={handleTypeFilter} value={typeFilter} />
              </Grid.Column>
              <Grid.Column>
                  Medication Brand: {' '}
                <Dropdown inline options={getFilters(brands)} search
                  onChange={handleBrandFilter} value={brandFilter} />
              </Grid.Column>
              <Grid.Column>
                  Medication Location: {' '}
                <Dropdown inline options={getFilters(locations)} search
                  onChange={handleLocationFilter} value={locationFilter} />
              </Grid.Column>
              <Grid.Column>
                Inventory Status: {' '}
                <Dropdown inline options={statusOptions} search
                  onChange={handleStatusFilter} value={statusFilter}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          <div>
            Records per page: {' '}
            <Dropdown inline options={recordOptions}
              onChange={handleRecordLimit} value={maxRecords}/>
            Total count: {filteredMedications.length}
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
                <Table.HeaderCell>Donated</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                filteredMedications.slice((pageNo - 1) * maxRecords, pageNo * maxRecords)
                  .map(med => <MedStatusRow key={med._id} med={med}/>)
              }
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="10">
                  <Pagination totalPages={Math.ceil(filteredMedications.length / maxRecords)} activePage={pageNo}
                    onPageChange={(event, data) => setPageNo(data.activePage)}/>
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
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  const drugTypeSub = DrugTypes.subscribeDrugType();
  const locationSub = Locations.subscribeLocation();
  // Determine if the subscription is ready
  const ready = medSub.ready() && drugTypeSub.ready() && locationSub.ready();
  // Get the Medication documents and sort them by name.
  const medications = Medications.find({}, { sort: { drug: 1 } }).fetch();
  const drugTypes = distinct('drugType', DrugTypes);
  const locations = distinct('location', Locations);
  const brands = distinct('brand', Medications);
  return {
    medications,
    drugTypes,
    locations,
    brands,
    ready,
  };
})(Status);
