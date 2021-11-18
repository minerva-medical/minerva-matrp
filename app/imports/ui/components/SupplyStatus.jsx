import React, { useState, useEffect } from 'react';
import { Header, Table, Divider, Dropdown, Pagination, Grid, Input, Loader, Icon, Popup, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Locations } from '../../api/location/LocationCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { distinct, getOptions } from '../utilities/Functions';
import { Supplys } from '../../api/supply/SupplyCollection';
import SupplyStatusRow from './SupplyStatusRow';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

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
const SupplyStatus = ({ ready, supplies, locations }) => {
  const [filteredSupplies, setFilteredSupplies] = useState([]);
  useEffect(() => {
    setFilteredSupplies(supplies);
  }, [supplies]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [locationFilter, setLocationFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState(0);
  const [maxRecords, setMaxRecords] = useState(25);

  // handles filtering
  useEffect(() => {
    let filter = JSON.parse(JSON.stringify(supplies)); // deep clone supplies
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filter = filter.filter(({ supply, stock }) => (
        supply.toLowerCase().includes(query.toLowerCase()) ||
        stock.findIndex(({ location }) => location.toLowerCase().includes(query)) !== -1
      ));
    }
    if (locationFilter) {
      filter = filter.filter((supply) => supply.stock.findIndex(
        stock => stock.location === locationFilter,
      ) !== -1);
    }
    if (statusFilter) {
      filter = filter.filter((supply) => {
        const totalQuantity = supply.stock.length ?
          _.pluck(supply.stock, 'quantity').reduce((prev, current) => prev + current) : 0;
        if (statusFilter === 'In Stock') {
          return totalQuantity >= supply.minQuantity;
        }
        if (statusFilter === 'Low Stock') {
          return (totalQuantity > 0 && totalQuantity < supply.minQuantity);
        }
        if (statusFilter === 'Out of Stock') {
          return totalQuantity === 0;
        }
        return true;
      });
    }
    setFilteredSupplies(filter);
  }, [searchQuery, locationFilter, statusFilter]);

  const handleSearch = (event, { value }) => setSearchQuery(value);
  const handleLocationFilter = (event, { value }) => setLocationFilter(value);
  const handleStatusFilter = (event, { value }) => setStatusFilter(value);
  const handleRecordLimit = (event, { value }) => setMaxRecords(value);

  if (ready) {
    return (
      <Tab.Pane id={PAGE_IDS.SUPPLY_STATUS} className='status-tab'>
        <Header as="h2">
          <Header.Content>
            Supply Inventory Status
            <Header.Subheader>
              <i>Use the search filter or the dropdown filters to check for a specific supply.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Grid>
          <Grid.Column width={4}>
            <Input placeholder='Filter by supply name...' icon='search'
              onChange={handleSearch} value={searchQuery} id={COMPONENT_IDS.SUPPLY_FILTER}/>
            <Popup
              trigger={<Icon name='question circle' color="blue"/>}
              content='This allows you to filter the inventory by supply name and location.'
              inverted
            />
          </Grid.Column>
        </Grid>
        <Divider/>
        <Grid divided columns="equal">
          <Grid.Row textAlign='center'>
            <Grid.Column>
              Supply Location: {' '}
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
          Total count: {filteredSupplies.length}
        </div>
        <Table selectable color='blue' unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Supply</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Total Quantity</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              filteredSupplies.slice((pageNo - 1) * maxRecords, pageNo * maxRecords)
                .map(supply => <SupplyStatusRow key={supply._id} supply={supply}/>)
            }
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="5">
                <Pagination
                  totalPages={Math.ceil(filteredSupplies.length / maxRecords)}
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

SupplyStatus.propTypes = {
  supplies: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const supplySub = Supplys.subscribeSupply();
  const locationSub = Locations.subscribeLocation();
  // Determine if the subscription is ready
  const ready = supplySub.ready() && locationSub.ready();
  // Get the Supply documents and sort them by name.
  const supplies = Supplys.find({}, { sort: { supply: 1 } }).fetch();
  const locations = distinct('location', Locations);
  return {
    supplies,
    locations,
    ready,
  };
})(SupplyStatus);
