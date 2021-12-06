import React, { useState, useEffect } from 'react';
import { Header, Table, Divider, Dropdown, Pagination, Grid, Input, Loader, Icon, Popup, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Medications } from '../../api/medication/MedicationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Locations } from '../../api/location/LocationCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import MedStatusRow from '../components/MedStatusRow';
import { distinct, getOptions, nestedDistinct } from '../utilities/Functions';

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
const MedStatus = ({ ready, medications, drugTypes, locations, brands }) => {
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
      const query = searchQuery.toLowerCase();
      filter = filter.filter(({ drug, lotIds }) => (
        drug.toLowerCase().includes(query.toLowerCase()) ||
        lotIds.findIndex(({ brand }) => brand.toLowerCase().includes(query)) !== -1 ||
        lotIds.findIndex(({ expire }) => (expire && expire.includes(query))) !== -1 ||
        lotIds.findIndex(({ location }) => location.toLowerCase().includes(query)) !== -1 ||
        lotIds.findIndex(({ lotId }) => lotId.toLowerCase().includes(query)) !== -1
      ));
    }
    if (typeFilter) {
      filter = filter.filter((medication) => medication.drugType.includes(typeFilter));
    }
    if (brandFilter) {
      // filter = filter.filter((medication) => medication.brand === brandFilter);
      filter = filter.filter((medication) => medication.lotIds.findIndex(
        lotId => lotId.brand === brandFilter,
      ) !== -1);
    }
    if (locationFilter) {
      // filter = filter.filter((medication) => medication.location === locationFilter);
      filter = filter.filter((medication) => medication.lotIds.findIndex(
        lotId => lotId.location === locationFilter,
      ) !== -1);
    }
    if (statusFilter) {
      filter = filter.filter((medication) => {
        const totalQuantity = medication.lotIds.length ?
          _.pluck(medication.lotIds, 'quantity').reduce((prev, current) => prev + current) : 0;
        if (statusFilter === 'In Stock') {
          return totalQuantity >= medication.minQuantity;
        }
        if (statusFilter === 'Low Stock') {
          return (totalQuantity > 0 && totalQuantity < medication.minQuantity);
        }
        if (statusFilter === 'Out of Stock') {
          return totalQuantity === 0;
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
      <Tab.Pane id={PAGE_IDS.MED_STATUS} className='status-tab'>
        <Header as="h2">
          <Header.Content>
            Medication Inventory Status
            <Header.Subheader>
              <i>Use the search filter to check for a specific drug or
                use the dropdown filters.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Grid>
          <Grid.Column width={4}>
            <Popup
              trigger={<Input placeholder='Filter by drug name...' icon='search'
                onChange={handleSearch} value={searchQuery} id={COMPONENT_IDS.STATUS_FILTER} />}
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
                onChange={handleTypeFilter} value={typeFilter} id={COMPONENT_IDS.MEDICATION_TYPE}/>
            </Grid.Column>
            <Grid.Column>
              Medication Brand: {' '}
              <Dropdown inline options={getFilters(brands)} search
                onChange={handleBrandFilter} value={brandFilter} id={COMPONENT_IDS.MEDICATION_BRAND}/>
            </Grid.Column>
            <Grid.Column>
              Medication Location: {' '}
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
          Total count: {filteredMedications.length}
        </div>
        <Table selectable color='blue' unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Medication</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Total Quantity</Table.HeaderCell>
              <Table.HeaderCell>Unit</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
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
              <Table.HeaderCell colSpan="6">
                <Pagination
                  totalPages={Math.ceil(filteredMedications.length / maxRecords)}
                  activePage={pageNo}
                  onPageChange={(event, data) => {
                    setPageNo(data.activePage);
                    window.scrollTo(0, 0);
                  }}
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

MedStatus.propTypes = {
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
  const brands = nestedDistinct('brand', Medications);
  return {
    medications,
    drugTypes,
    locations,
    brands,
    ready,
  };
})(MedStatus);
