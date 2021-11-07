import React, { useState } from 'react';
import { Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Loader, Icon, Input, Popup,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
import DispenseLogRow from '../components/DispenseLogRow';
import { nestedDistinct } from '../utilities/Functions';
import { PAGE_IDS } from '../utilities/PageIDs';

// convert array to dropdown options
const getOptions = (arr) => {
  const options = arr.map(elem => ({ key: elem, text: elem, value: elem }));
  options.unshift({ key: '0', value: 'All', text: 'All' });
  return options;
};

// Used for the amount of history log rows that appear in each page.
const logPerPage = [
  { key: '0', value: '5', text: '5' },
  { key: '1', value: '10', text: '10' },
  { key: '2', value: '25', text: '25' },
  { key: '3', value: '50', text: '50' },
];

// Used for sorting the table in accordance to the type of dispense
const reason = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Patient Use', text: 'Patient Use' },
  { key: '2', value: 'Expired', text: 'Expired' },
  { key: '3', value: 'Broken/Contaminated', text: 'Broken/Contaminated' },
];
/** Renders the Page for Dispensing History. */
const DispenseLog = ({ ready, historicals, brands }) => {
  if (ready) {
    const gridAlign = {
      textAlign: 'center',
    };

    const [searchHistoricals, setSearchHistoricals] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [brandFilter, setBrandFilter] = useState('');
    const [date, setDate] = useState('');
    const [dispenseTypeFilter, setDispenseTypeFilter] = useState('');
    const [logPerPageDropdown, setlogPerPageDropdown] = useState('');

    let list = historicals;
    let listLength;

    const handleSearch = (event) => {
      setSearchHistoricals(event.target.value);
    };

    const handleBrandFilter = (event, data) => {
      setBrandFilter(data.value);
    };

    const handleDateFilter = (event, data) => {
      setDate(data.value);
    };

    const handleDispenseTypeFilter = (event, data) => {
      setDispenseTypeFilter(data.value);
    };

    const handleLogPerPage = (event, data) => {
      setlogPerPageDropdown(data.value);
    };

    if (date !== '') {
      list = historicals.filter((val) => {
        if (val.dateDispensed.toLocaleDateString('en-CA').includes(date)) {
          return val;
        }
        return 0;
      });
    }

    if (brandFilter !== '') {
      if (brandFilter !== 'All') {
        list = historicals.filter((val) => {
          if (val.brand.toLowerCase().includes(brandFilter.toLowerCase())) {
            return val;
          }
          return 0;
        });
      }
    }

    if (dispenseTypeFilter !== '') {
      if (dispenseTypeFilter !== 'All') {
        list = historicals.filter((val) => {
          if (val.dispenseType.toLowerCase().includes(dispenseTypeFilter.toLowerCase())) {
            return val;
          }
          return 0;
        });
      }
    }

    if (searchHistoricals !== '') {
      list = historicals.filter((val) => {
        if (val.drug.toLowerCase().includes(searchHistoricals.toLowerCase()) ||
            val.lotId.toLowerCase().includes(searchHistoricals.toLowerCase()) ||
            val.dispensedTo.toLowerCase().includes(searchHistoricals.toLowerCase())) {
          return val;
        }
        return 0;
      });
    }

    if (logPerPageDropdown === '5') {
      listLength = 5;
    } else if (logPerPageDropdown === '10') {
      listLength = 10;
    } else if (logPerPageDropdown === '25') {
      listLength = 25;
    } else if (logPerPageDropdown === '50') {
      listLength = 50;
    } else {
      listLength = 10;
    }

    return (
      <Container id={PAGE_IDS.DISPENSE_LOG}>
        <Segment>
          <Header as="h2">
            <Header.Content>
                  History Dispense Log
              <Header.Subheader>
                <i>Use the search filter to look for a specific Patient Number
                    or use the dropdown filters.</i>
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid divider columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Input placeholder='Filter by patient...' icon='search'
                  onChange={handleSearch}
                />
                <Popup
                  trigger={<Icon name='question circle' color="blue"/>}
                  content='This allows you to filter the Dispense Log table by Patient Number,
                  LotId, or Drug Name.'
                  inverted
                />
              </Grid.Column>
              <Grid.Column>
                <Input type="date"
                  onChange={handleDateFilter}
                />
                <Popup
                  trigger={<Icon name='question circle' color="blue"/>}
                  content='This allows you to filter the Dispense Log table by Date.'
                  inverted
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          <Grid divided columns="equal">
            <Grid.Row style={gridAlign}>
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
                    Dispense Type: {' '}
                <Dropdown
                  inline={true}
                  options={reason}
                  defaultValue={'All'}
                  onChange={handleDispenseTypeFilter}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          Records per page:{' '}
          <Dropdown
            inline={true}
            options={logPerPage}
            defaultValue={logPerPage[1].value}
            onChange={handleLogPerPage}
          />
                Total count: {historicals.length}
          <Table striped singleLine columns={11}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date & Time</Table.HeaderCell>
                <Table.HeaderCell>Dispense Type</Table.HeaderCell>
                <Table.HeaderCell>Patient Number</Table.HeaderCell>
                <Table.HeaderCell>Medication</Table.HeaderCell>
                <Table.HeaderCell>Brand</Table.HeaderCell>
                <Table.HeaderCell>LotId</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Dispensed by</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                list.slice((pageNo - 1) * listLength, pageNo * listLength).map(history => <DispenseLogRow key={history._id}
                  history={history}/>)
              }
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="11">
                  <Pagination totalPages={Math.ceil(historicals.length / listLength)}
                    activePage={pageNo} onPageChange={(event, data) => setPageNo(data.activePage)}/>
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

DispenseLog.propTypes = {
  historicals: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  const historicalSub = Historicals.subscribeHistorical();
  // Determine if the subscription is ready
  const ready = historicalSub.ready() && medSub.ready();
  // Get the Historical documents.
  const historicals = Historicals.find({}).fetch();
  const brands = nestedDistinct('brand', Medications);
  return {
    historicals,
    brands,
    ready,
  };
})(DispenseLog);
