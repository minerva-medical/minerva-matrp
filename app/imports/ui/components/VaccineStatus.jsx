import React, { useState, useEffect } from 'react';
import { Header, Table, Divider, Dropdown, Pagination, Grid, Input, Loader, Icon, Popup, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Vaccinations } from '../../api/vaccination/VaccinationCollection';
import { Locations } from '../../api/location/LocationCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import VaccineStatusRow from './VaccineStatusRow';
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
const VaccineStatus = ({ ready, vaccines, locations, brands }) => {
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  useEffect(() => {
    setFilteredVaccines(vaccines);
  }, [vaccines]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [brandFilter, setBrandFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState(0);
  const [maxRecords, setMaxRecords] = useState(25);

  // handles filtering
  useEffect(() => {
    let filter = JSON.parse(JSON.stringify(vaccines));
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filter = filter.filter(({ vaccine, brand, lotIds }) => (
        vaccine.toLowerCase().includes(query.toLowerCase()) ||
        brand.toLowerCase().includes(query.toLowerCase()) ||
        lotIds.findIndex(({ expire }) => (expire && expire.includes(query))) !== -1 ||
        lotIds.findIndex(({ location }) => location.toLowerCase().includes(query)) !== -1 ||
        lotIds.findIndex(({ lotId }) => lotId.toLowerCase().includes(query)) !== -1
      ));
    }
    if (brandFilter) {
      filter = filter.filter((vaccine) => vaccine.brand === brandFilter);
    }
    if (locationFilter) {
      filter = filter.filter((vaccine) => vaccine.lotIds.findIndex(
        lotId => lotId.location === locationFilter,
      ) !== -1);
    }
    if (statusFilter) {
      filter = filter.filter((vaccine) => {
        const totalQuantity = vaccine.lotIds.length ?
          _.pluck(vaccine.lotIds, 'quantity').reduce((prev, current) => prev + current) : 0;
        if (statusFilter === 'In Stock') {
          return totalQuantity >= vaccine.minQuantity;
        }
        if (statusFilter === 'Low Stock') {
          return (totalQuantity > 0 && totalQuantity < vaccine.minQuantity);
        }
        if (statusFilter === 'Out of Stock') {
          return totalQuantity === 0;
        }
        return true;
      });
    }
    setFilteredVaccines(filter);
  }, [searchQuery, brandFilter, locationFilter, statusFilter]);

  const handleSearch = (event, { value }) => setSearchQuery(value);
  const handleBrandFilter = (event, { value }) => setBrandFilter(value);
  const handleLocationFilter = (event, { value }) => setLocationFilter(value);
  const handleStatusFilter = (event, { value }) => setStatusFilter(value);
  const handleRecordLimit = (event, { value }) => setMaxRecords(value);

  if (ready) {
    return (
      <Tab.Pane id={PAGE_IDS.VACCINE_STATUS} className='status-tab'>
        <Header as="h2">
          <Header.Content>
            Vaccine Inventory Status
            <Header.Subheader>
              <i>Use the search filter to check for a specific vaccine or
                use the dropdown filters.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Grid>
          <Grid.Column width={4}>
            <Popup
              trigger={<Input placeholder='Filter by vaccine name...' icon='search'
                onChange={handleSearch} value={searchQuery} id={COMPONENT_IDS.VACCINE_FILTER} />}
              content='This allows you to filter the Inventory by vaccine, brand, LotID, location, and expiration.'
              inverted
            />
          </Grid.Column>
        </Grid>
        <Divider/>
        <Grid divided columns="equal">
          <Grid.Row textAlign='center'>
            <Grid.Column>
              Vaccine Brand: {' '}
              <Dropdown inline options={getFilters(brands)} search
                onChange={handleBrandFilter} value={brandFilter} id={COMPONENT_IDS.VACCINE_BRAND}/>
            </Grid.Column>
            <Grid.Column>
              Vaccine Location: {' '}
              <Dropdown inline options={getFilters(locations)} search
                onChange={handleLocationFilter} value={locationFilter} id={COMPONENT_IDS.MEDICATION_LOCATION} />
            </Grid.Column>
            <Grid.Column>
              Inventory Status: {' '}
              <Dropdown inline options={statusOptions} search
                onChange={handleStatusFilter} value={statusFilter} id={COMPONENT_IDS.INVENTORY_STATUS}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider/>
        <div>
          Records per page: {' '}
          <Dropdown inline options={recordOptions}
            onChange={handleRecordLimit} value={maxRecords} id={COMPONENT_IDS.NUM_OF_RECORDS}/>
          Total count: {filteredVaccines.length}
        </div>
        <Table selectable color='blue' unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Vaccine</Table.HeaderCell>
              <Table.HeaderCell>Manufacturer</Table.HeaderCell>
              <Table.HeaderCell>Total Quantity</Table.HeaderCell>
              <Table.HeaderCell>VIS Date</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              filteredVaccines.slice((pageNo - 1) * maxRecords, pageNo * maxRecords)
                .map(vaccine => <VaccineStatusRow key={vaccine._id} vaccine={vaccine}/>)
            }
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="6">
                <Pagination
                  totalPages={Math.ceil(filteredVaccines.length / maxRecords)}
                  activePage={pageNo}
                  onPageChange={(event, data) => setPageNo(data.activePage)}
                  ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                  firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                  lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                  prevItem={{ content: <Icon name='angle left' />, icon: true }}
                  nextItem={{ content: <Icon name='angle right' />, icon: true }}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

VaccineStatus.propTypes = {
  vaccines: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const vaccineSub = Vaccinations.subscribeVaccination();
  const locationSub = Locations.subscribeLocation();
  // Determine if the subscription is ready
  const ready = vaccineSub.ready() && locationSub.ready();
  // Get the Vaccination documents and sort them by name.
  const vaccines = Vaccinations.find({}, { sort: { vaccine: 1 } }).fetch();
  const locations = distinct('location', Locations);
  const brands = distinct('brand', Vaccinations);
  return {
    vaccines,
    locations,
    brands,
    ready,
  };
})(VaccineStatus);
