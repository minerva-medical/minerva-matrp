import React, { useState } from 'react';
import {
  Header,
  Container,
  Table,
  Segment,
  Divider,
  Dropdown,
  Pagination,
  Grid,
  Loader,
  Icon,
  Input,
  Popup,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medications } from '../../api/medication/MedicationCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import DispenseLogRow from '../components/DispenseLogRow';
import { distinct } from '../utilities/Functions';

const getOptions = (arr) => {
  const options = arr.map(elem => ({ key: elem, text: elem, value: elem }));
  options.unshift({ key: '0', value: 'All', text: 'All' });
  return options;
};

/** Renders the Page for Dispensing Inventory. */
const DispenseLog = ({ ready, historicals, drugTypes }) => {
  if (ready) {
    const gridAlign = {
      textAlign: 'center',
    };
    const [searchHistoricals, setSearchHistoricals] = useState('');
    const [pageNo, setPageNo] = useState(1);

    const handleSearch = (event) => {
      setSearchHistoricals(event.target.value);
    };
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
    return (
      <div>
        <Container id='dispense-log'>
          <Segment>
            <Header as="h2">
              <Header.Content>
                  History Dispense Log
                <Header.Subheader>
                  <i>Use the search filter to look for a specific Patient Number or click on the table header to sort
                      the
                      column.</i>
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Divider/>
            <Grid>
              <Grid.Column width={4}>
                <Input placeholder='Filter by patient...' icon='search'
                  onChange={handleSearch}
                />
                <Popup
                  trigger={<Icon name='question circle' color="blue"/>}
                  content='This allows you to filter the Dispense Log table by patient number, lotId, or drug name.'
                  inverted
                />
              </Grid.Column>
            </Grid>
            <Divider/>
            <Grid divided columns="equal">
              <Grid.Row style={gridAlign}>
                <Grid.Column>
                    Sort By: {' '}
                  <Dropdown
                    inline={true}
                    options={sort}
                    defaultValue={'Most Recent'}
                  />
                </Grid.Column>
                <Grid.Column>
                    Medication Type: {' '}
                  <Dropdown
                    inline
                    options={getOptions(drugTypes)}
                    search
                    defaultValue={'All'}
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
              </Grid.Row>
            </Grid>
            <Divider/>
              Records per page:{' '}
            <Dropdown
              inline={true}
              options={limitOptions}
              defaultValue={'10'}
            />
              Total count: {'200'}
            <Table striped singleLine columns={11}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date & Time</Table.HeaderCell>
                  <Table.HeaderCell>Dispense Type</Table.HeaderCell>
                  <Table.HeaderCell>Patient Number</Table.HeaderCell>
                  <Table.HeaderCell>Medication</Table.HeaderCell>
                  <Table.HeaderCell>LotId</Table.HeaderCell>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>Dispensed by</Table.HeaderCell>
                  <Table.HeaderCell>Information</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  historicals.filter((val) => {
                    if (searchHistoricals === '') {
                      return val;
                    }

                    if (val.drug.toLowerCase().includes(searchHistoricals.toLowerCase()) ||
                          val.dispensedTo.toLowerCase().includes(searchHistoricals.toLowerCase()) ||
                          val.lotId.toLowerCase().includes(searchHistoricals.toLowerCase())) {
                      return val;
                    }
                    return 0;
                  }).slice((pageNo - 1) * 5, pageNo * 5).map(history => <DispenseLogRow key={history._id}
                    history={history}/>)
                }
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="11">
                    <Pagination totalPages={Math.ceil(historicals.length / 5)}
                      activePage={pageNo} onPageChange={(event, data) => setPageNo(data.activePage)}/>
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
  drugTypes: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  const historicalSub = Historicals.subscribeHistorical();
  const drugTypeSub = DrugTypes.subscribeDrugType();
  // Determine if the subscription is ready
  const ready = historicalSub.ready() && drugTypeSub.ready() && medSub.ready();
  // Get the Historical documents.
  const historicals = Historicals.find({}).fetch();
  const drugTypes = distinct('drugType', DrugTypes);
  return {
    historicals,
    drugTypes,
    ready,
  };
})(DispenseLog);
