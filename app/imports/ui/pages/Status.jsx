import React, { useState } from 'react';
import { Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Input,
  Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Locations } from '../../api/location/LocationCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import MedStatusRow from '../components/MedStatusRow';
import { distinct } from '../utilities/Functions';
import { Brands } from '../../api/brand/BrandCollection';

/** Renders the Page for Dispensing Inventory. */

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

// Render the form.
const Status = ({ ready, medications, drugTypes, locations, brands }) => {
  const [searchMedications, setSearchMedications] = useState('');

  const handleSearch = (event) => {
    setSearchMedications(event.target.value);
  };

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
                />
              </Grid.Column>
              <Grid.Column>
                  Medication Brand: {' '}
                <Dropdown
                  inline
                  options={getOptions(brands)}
                  search
                  defaultValue={'All'}
                />
              </Grid.Column>
              <Grid.Column>
                  Medication Location: {' '}
                <Dropdown
                  inline
                  options={getOptions(locations)}
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
                medications.filter((val) => {
                  if (searchMedications === '') {
                    return val;
                  }

                  if (val.drug.toLowerCase().includes(searchMedications.toLowerCase()) ||
                      val.brand.toLowerCase().includes(searchMedications.toLowerCase()) ||
                      val.lotId.toLowerCase().includes(searchMedications.toLowerCase())) {
                    return val;
                  }
                  return 0;
                }).map(med => <MedStatusRow key={med._id} med={med} />)
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
