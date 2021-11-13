import React, { useEffect, useState } from 'react';
import {
  Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Loader, Icon, Input, Popup, Label,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
import DispenseLogRow from '../components/DispenseLogRow';
import { getOptions, nestedDistinct } from '../utilities/Functions';
import { PAGE_IDS } from '../utilities/PageIDs';

// Convert array to dropdown options
const getFilters = (arr) => [{ key: 'All', value: 0, text: 'All' }, ...getOptions(arr)];

// Used for the amount of history log rows that appear in each page.
const logPerPage = [
  { key: 1, value: 10, text: '10' },
  { key: 2, value: 25, text: '25' },
  { key: 3, value: 50, text: '50' },
  { key: 4, value: 100, text: '100' },
];

// Used for sorting the table in accordance to the type of dispense
const reason = [
  { key: 'All', value: 0, text: 'All' },
  { key: '1', value: 'Patient Use', text: 'Patient Use' },
  { key: '2', value: 'Expired', text: 'Expired' },
  { key: '3', value: 'Broken', text: 'Broken' },
  { key: '4', value: 'Contaminated', text: 'Contaminated' },
];
/** Renders the Page for Dispensing History. */
const DispenseLog = ({ ready, historicals, brands }) => {
  if (ready) {
    const gridAlign = {
      textAlign: 'center',
    };

    // const [searchHistoricals, setSearchHistoricals] = useState('');
    const [filterHistoricals, setFilterHistoricals] = useState([]);
    useEffect(() => {
      setFilterHistoricals(historicals);
    }, [historicals]);

    const [searchQuery, setSearchQuery] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [minDateFilter, setMinDateFilter] = useState(0);
    const [maxDateFilter, setMaxDateFilter] = useState(0);
    const [brandFilter, setBrandFilter] = useState(0);
    const [dispenseTypeFilter, setDispenseTypeFilter] = useState(0);
    const [maxLog, setMaxLog] = useState(10);

    // handles filtering
    useEffect(() => {
      let filter = JSON.parse(JSON.stringify(historicals));
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filter = filter.filter((historical) => (
          historical.drug.toLowerCase().includes(query.toLowerCase()) ||
            historical.brand.toLowerCase().includes(query) ||
            historical.dispensedTo.toLowerCase().includes(query) ||
            historical.lotId.toLowerCase().includes(query.toLowerCase())
        ));
      }
      if (brandFilter) {
        filter = filter.filter((historical) => historical.brand.includes(brandFilter));
      }
      if (dispenseTypeFilter) {
        filter = filter.filter((historical) => historical.dispenseType.includes(dispenseTypeFilter));
      }
      if (minDateFilter && maxDateFilter) {
        filter = filter.filter((historical) => historical.dateDispensed >= (minDateFilter) &&
            historical.dateDispensed <= (maxDateFilter));
      }
      if (minDateFilter || maxDateFilter) {
        filter = filter.filter((historical) => historical.dateDispensed >= (minDateFilter) ||
            historical.dateDispensed <= (maxDateFilter));
      }
      setFilterHistoricals(filter);
    }, [searchQuery, brandFilter, dispenseTypeFilter, minDateFilter, maxDateFilter]);

    const handleSearch = (event, { value }) => setSearchQuery(value);
    const handleBrandFilter = (event, { value }) => setBrandFilter(value);
    const handleMinDateFilter = (event, { value }) => setMinDateFilter(value);
    const handleMaxDateFilter = (event, { value }) => setMaxDateFilter(value);
    const handleDispenseTypeFilter = (event, { value }) => setDispenseTypeFilter(value);
    const handleMaxLog = (event, { value }) => setMaxLog(value);

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
          <Grid divider columns="equal" stackable>
            <Grid.Row>
              <Grid.Column>
                <Popup inverted trigger={<Input placeholder='Filter by patient...' icon='search' onChange={handleSearch}/>}
                  content='This allows you to filter the Dispense Log table by Patient Number,
                  LotId, or Drug Name.'/>
              </Grid.Column>
              <Grid.Column>
                <Label basic>Date From</Label>
                <Popup inverted trigger={ <Input type="date" onChange={handleMinDateFilter}/>}
                  content="This allows you to filter the Dispense Log table
                  from the selected 'From Date' to today's date or the selected 'To Date'."/>
              </Grid.Column>
              <Grid.Column>
                <Label basic>Date To</Label>
                <Input type="date" onChange={handleMaxDateFilter}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          <Grid divided columns="equal" stackable>
            <Grid.Row style={gridAlign}>
              <Grid.Column>
                Medication Brand: {' '}
                <Dropdown
                  inline
                  options={getFilters(brands)}
                  search
                  value={brandFilter}
                  onChange={handleBrandFilter}
                />
              </Grid.Column>
              <Grid.Column>
                    Dispense Type: {' '}
                <Dropdown inline={true} options={reason} value={dispenseTypeFilter} onChange={handleDispenseTypeFilter}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          Records per page:{' '}
          <Dropdown inline={true} options={logPerPage} value={maxLog} onChange={handleMaxLog}/>
                Total count: {filterHistoricals.length}
          <Table striped singleLine columns={11} color='blue' compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date & Time</Table.HeaderCell>
                <Table.HeaderCell>Dispense Type</Table.HeaderCell>
                <Table.HeaderCell>Patient Number</Table.HeaderCell>
                <Table.HeaderCell>Medication</Table.HeaderCell>
                <Table.HeaderCell>Brand</Table.HeaderCell>
                <Table.HeaderCell>LotId</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Dispensed By</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                filterHistoricals.slice((pageNo - 1) * maxLog, pageNo * maxLog)
                  .map(history => <DispenseLogRow key={history._id} history={history}/>)
              }
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="11">
                  <Pagination
                    totalPages={Math.ceil(filterHistoricals.length / maxLog)}
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
  const brands = nestedDistinct('brand', Medications);
  // Get the Historical documents.
  const historicals = Historicals.find({}).fetch();
  return {
    historicals,
    brands,
    ready,
  };
})(DispenseLog);
