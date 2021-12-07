import React, { useEffect, useState } from 'react';
import {
  Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Loader, Icon, Input, Popup,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Historicals, dispenseTypes, inventoryTypes } from '../../api/historical/HistoricalCollection';
import { Sites } from '../../api/site/SiteCollection';
import DispenseLogRow from '../components/DispenseLogRow';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { distinct, getOptions } from '../utilities/Functions';

// Used for the amount of history log rows that appear in each page.
const logPerPage = [
  { key: 1, value: 10, text: '10' },
  { key: 2, value: 25, text: '25' },
  { key: 3, value: 50, text: '50' },
  { key: 4, value: 100, text: '100' },
];

// Used for sorting the table in accordance to the type of dispense
const reason = [{ key: 'All', value: 0, text: 'All' }, ...getOptions(dispenseTypes)];

// Used for sorting the table in accordance to the type of inventory
const inventory = [{ key: 'All', value: 0, text: 'All' }, ...getOptions(inventoryTypes)];

const getFilters = (arr) => [{ key: 'All', value: 0, text: 'All' }, ...getOptions(arr)];

/** Renders the Page for Dispensing History. */
const DispenseLog = ({ ready, historicals, sites }) => {
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
    const [inventoryFilter, setInventoryFilter] = useState(0);
    const [dispenseTypeFilter, setDispenseTypeFilter] = useState(0);
    const [siteFilter, setSiteFilter] = useState(0);
    const [maxLog, setMaxLog] = useState(10);

    // handles filtering
    useEffect(() => {
      let filter = JSON.parse(JSON.stringify(historicals));
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filter = filter.filter((historical) => (
          historical.name.toLowerCase().includes(query) ||
            historical.dispensedTo.toLowerCase().includes(query)
        ));
      }
      if (inventoryFilter) {
        filter = filter.filter((historical) => historical.inventoryType === inventoryFilter);
      }
      if (dispenseTypeFilter) {
        filter = filter.filter((historical) => historical.dispenseType === dispenseTypeFilter);
      }
      if (siteFilter) {
        filter = filter.filter((historical) => historical.site === siteFilter);
      }
      if (minDateFilter) {
        const minDate = moment(minDateFilter).utc().format();
        filter = filter.filter((historical) => historical.dateDispensed >= minDate);
      }
      if (maxDateFilter) {
        const maxDate = moment(maxDateFilter).utc().format();
        filter = filter.filter((historical) => historical.dateDispensed <= maxDate);
      }
      setFilterHistoricals(filter);
    }, [searchQuery, inventoryFilter, dispenseTypeFilter, siteFilter, minDateFilter, maxDateFilter]);

    const handleSearch = (event, { value }) => setSearchQuery(value);
    const handleInventoryFilter = (event, { value }) => setInventoryFilter(value);
    const handleMinDateFilter = (event, { value }) => setMinDateFilter(value);
    const handleMaxDateFilter = (event, { value }) => setMaxDateFilter(value);
    const handleDispenseTypeFilter = (event, { value }) => setDispenseTypeFilter(value);
    const handleSiteFilter = (event, { value }) => setSiteFilter(value);
    const handleMaxLog = (event, { value }) => setMaxLog(value);

    return (
      <div className='status-wrapped'>
        <Container id={PAGE_IDS.DISPENSE_LOG}>
          <Segment className='status-wrapped'>
            <Header as="h2">
              <Header.Content>
                History Dispense Log
                <Header.Subheader>
                  <i>Use the search filter to look for a specific Patient Number
                    or use the dropdown filters.</i>
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Grid columns="equal" stackable>
              <Grid.Row>
                <Grid.Column>
                  <Popup inverted
                    trigger={<Input placeholder='Filter by patient...' icon='search' onChange={handleSearch}
                      id={COMPONENT_IDS.DISPENSE_FILTER}/>}
                    content='This allows you to filter the Dispense Log table by Patient Number or Inventory Name.'/>
                </Grid.Column>
                <Grid.Column>
                  <Popup inverted
                    trigger={
                      <Input type="date" label={{ basic: true, content: 'From' }} labelPosition='left'
                        onChange={handleMinDateFilter} max={maxDateFilter} />
                    }
                    content="This allows you to filter the Dispense Log table
                  from the selected 'From' date to today's date or the selected 'To' date."/>
                </Grid.Column>
                <Grid.Column>
                  <Input type="date" label={{ basic: true, content: 'To' }} labelPosition='left'
                    onChange={handleMaxDateFilter} min={minDateFilter} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider/>
            <Grid divided columns="equal" stackable>
              <Grid.Row style={gridAlign}>
                <Grid.Column>
                  Inventory Type: {' '}
                  <Dropdown
                    inline
                    options={inventory}
                    search
                    value={inventoryFilter}
                    onChange={handleInventoryFilter}
                    id={COMPONENT_IDS.INVENTORY_TYPE}
                  />
                </Grid.Column>
                <Grid.Column>
                  Dispense Type: {' '}
                  <Dropdown inline={true} options={reason} search value={dispenseTypeFilter}
                    onChange={handleDispenseTypeFilter} id={COMPONENT_IDS.DISPENSE_TYPE}/>
                </Grid.Column>
                <Grid.Column>
                Dispense Site: {' '}
                  <Dropdown inline={true} options={getFilters(sites)} search value={siteFilter}
                    onChange={handleSiteFilter} id={COMPONENT_IDS.DISPENSE_SITE}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider/>
            Records per page:{' '}
            <Dropdown inline={true} options={logPerPage} value={maxLog} onChange={handleMaxLog}/>
            Total count: {filterHistoricals.length}
            <Table striped singleLine columns={9} color='blue' compact collapsing unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date & Time</Table.HeaderCell>
                  <Table.HeaderCell>Inventory Type</Table.HeaderCell>
                  <Table.HeaderCell>Dispense Type</Table.HeaderCell>
                  <Table.HeaderCell>Patient Number</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
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
                      ellipsisItem={{ content: <Icon name='ellipsis horizontal'/>, icon: true }}
                      firstItem={{ content: <Icon name='angle double left'/>, icon: true }}
                      lastItem={{ content: <Icon name='angle double right'/>, icon: true }}
                      prevItem={{ content: <Icon name='angle left'/>, icon: true }}
                      nextItem={{ content: <Icon name='angle right'/>, icon: true }}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Segment>
        </Container>
      </div>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

DispenseLog.propTypes = {
  historicals: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  sites: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const historicalSub = Historicals.subscribeHistorical();
  const siteSub = Sites.subscribeSite();
  // Determine if the subscription is ready
  const ready = historicalSub.ready() && siteSub.ready();
  // Get the Historical documents.
  const historicals = Historicals.find({}, { sort: { dateDispensed: -1 } }).fetch();
  const sites = distinct('site', Sites);
  return {
    historicals,
    ready,
    sites,
  };
})(DispenseLog);
