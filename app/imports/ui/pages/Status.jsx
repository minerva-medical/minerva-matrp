import React, { useState } from 'react';
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
import { distinct } from '../utilities/Functions';
import { Brands } from '../../api/brand/BrandCollection';

// convert array to dropdown options
const getOptions = (arr) => {
  const options = arr.map(elem => ({ key: elem, text: elem, value: elem }));
  options.unshift({ key: '0', value: 'All', text: 'All' });
  return options;
};

const recordOptions = [
  { key: '0', value: '10', text: '10' },
  { key: '1', value: '25', text: '25' },
  { key: '2', value: '50', text: '50' },
  { key: '3', value: '100', text: '100' },
];

const statusOptions = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'In Stock', text: 'In Stock' },
  { key: '2', value: 'Low Stock', text: 'Low Stock' },
  { key: '3', value: 'Out of Stock', text: 'Out of stock' },
];

// Render the form.
const Status = ({ ready, medications, drugTypes, locations, brands }) => {
  const [searchMedications, setSearchMedications] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [medicationFilter, setMedicationFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [recordOptionsDropdown, setRecordOptionsDropdown] = useState('');

  let list = medications;
  let listLength;

  const handleSearch = (event, data) => {
    setSearchMedications(data.value);
  };

  const handleMedicationFilter = (event, data) => {
    setMedicationFilter(data.value);
  };

  const handleBrandFilter = (event, data) => {
    setBrandFilter(data.value);
  };

  const handleLocationFilter = (event, data) => {
    setLocationFilter(data.value);
  };

  const handleStatusFilter = (event, data) => {
    setStatusFilter(data.value);
  };

  const handleRecordOptions = (event, data) => {
    setRecordOptionsDropdown(data.value);
  };

  if (ready) {
    if (medicationFilter !== '') {
      if (medicationFilter !== 'All') {
        list = medications.filter((val) => {
          for (let i = 0; i < val.drugType.length; i++) {
            if (val.drugType[i].toLowerCase().includes(medicationFilter.toLowerCase())) {
              return val;
            }
          }
          return 0;
        });
      }
    }
    if (brandFilter !== '') {
      if (brandFilter !== 'All') {
        list = medications.filter((val) => {
          if (val.brand.toLowerCase().includes(brandFilter.toLowerCase())) {
            return val;
          }
          return 0;
        });
      }
    }
    if (locationFilter !== '') {
      if (locationFilter !== 'All') {
        list = medications.filter((val) => {
          if (val.location.toLowerCase().includes(locationFilter.toLowerCase())) {
            return val;
          }
          return 0;
        });
      }
    }
    if (statusFilter !== '') {
      if (statusFilter !== 'All') {
        list = medications.filter((val) => {
          const percent = Math.floor((val.quantity / val.minQuantity) * 100);
          if (statusFilter === 'In Stock') {
            return percent > 30;
          }
          if (statusFilter === 'Low Stock') {
            return (percent > 5 && percent < 30);
          }
          if (statusFilter === 'Out of Stock') {
            return percent <= 5;
          }
          return 0;
        });
      }
    }

    if (searchMedications !== '') {
      list = medications.filter((val) => {
        if (val.drug.toLowerCase().includes(searchMedications.toLowerCase()) ||
            val.brand.toLowerCase().includes(searchMedications.toLowerCase()) ||
            val.expire.toLowerCase().includes(searchMedications.toLowerCase()) ||
            val.location.toLowerCase().includes(searchMedications.toLowerCase()) ||
            val.lotId.toLowerCase().includes(searchMedications.toLowerCase())) {
          return val;
        }
        return 0;
      });
    }

    if (recordOptionsDropdown === '10') {
      listLength = 10;
    } else if (recordOptionsDropdown === '25') {
      listLength = 25;
    } else if (recordOptionsDropdown === '50') {
      listLength = 50;
    } else if (recordOptionsDropdown === '100') {
      listLength = 100;
    } else {
      listLength = 25;
    }

  }

  if (ready) {
    const gridAlign = {
      textAlign: 'center',
    };

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
                onChange={handleSearch}
              />
              <Popup
                trigger={<Icon name='question circle' color="blue"/>}
                content='This allows you to filter the Inventory by medication, brand, LotID, location, and expiration.'
                inverted
              />
            </Grid.Column>
          </Grid>
          <Divider/>
          <Grid divided columns="equal">
            <Grid.Row style={gridAlign}>
              <Grid.Column>
                  Type of Medication: {' '}
                <Dropdown
                  inline
                  options={getOptions(drugTypes)}
                  search
                  defaultValue={'All'}
                  onChange={handleMedicationFilter}
                />
              </Grid.Column>
              <Grid.Column>
                  Medication Brand: {' '}
                <Dropdown
                  inline
                  options={getOptions(brands)}
                  search
                  defaultValue={'All'}
                  onChange={handleBrandFilter}
                />
              </Grid.Column>
              <Grid.Column>
                  Medication Location: {' '}
                <Dropdown
                  inline
                  options={getOptions(locations)}
                  search
                  defaultValue={'All'}
                  onChange={handleLocationFilter}
                />
              </Grid.Column>
              <Grid.Column>
                Inventory Status: {' '}
                <Dropdown
                  inline
                  options={statusOptions}
                  search
                  defaultValue={'All'}
                  onChange={handleStatusFilter}
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
              defaultValue={recordOptions[1].value}
              onChange={handleRecordOptions}
            />
              Total count: {medications.length}
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
                list.slice((pageNo - 1) * listLength, pageNo * listLength).map(med => <MedStatusRow key={med._id} med={med}/>)
              }
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="10">
                  <Pagination totalPages={Math.ceil(medications.length / listLength)} activePage={pageNo}
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
  const brandSub = Brands.subscribeBrand();
  // Determine if the subscription is ready
  const ready = medSub.ready() && drugTypeSub.ready() && locationSub.ready() && brandSub.ready();
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
