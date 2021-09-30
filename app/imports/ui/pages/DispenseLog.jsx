import React from 'react';
import { Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders the Page for Dispensing Inventory. */
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
  /** Render the form. */
const DispenseLog = () => (
  <Container id={PAGE_IDS.DISPENSE_LOG}>
    <Segment>
      <Header as="h2">
        <Header.Content>
          History Dispense Log
          <Header.Subheader>
            <i>Below is a history log of dispensed inventories.</i>
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Divider/>
      <Grid divided columns="equal">
        <Grid.Row textAlign='center'>
          <Grid.Column>
                  Sort By: {' '}
            <Dropdown
              inline={true}
              options={sort}
              defaultValue={'Most Recent'}
            />
          </Grid.Column>
          <Grid.Column>
                  Reason for Dispense: {' '}
            <Dropdown
              inline={true}
              options={reason}
              defaultValue={'All'}
            />
          </Grid.Column>
          <Grid.Column>
            Records per page:{' '}
            <Dropdown
              inline={true}
              options={limitOptions}
              defaultValue={'10'}
            />
            Total count: {'200'}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider/>
      <Table celled selectable sortable compact>
        <Table.Header>
          <Table.Row inverted color="blue">
            <Table.HeaderCell
              width={1}
            >
                    Date : Time
            </Table.HeaderCell>
            <Table.HeaderCell
              width={2}
            >
                    Reason for Dispense
            </Table.HeaderCell>
            <Table.HeaderCell
              width={3}
            >
                    Medicine
            </Table.HeaderCell>
            <Table.HeaderCell
              width={1}
            >
                    Brand
            </Table.HeaderCell>
            <Table.HeaderCell
              width={1}
            >
                    Quantity
            </Table.HeaderCell>
            <Table.HeaderCell
              width={3}
            >
                    Dispensed by
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-13 (12:25:30)</Table.Cell>
            <Table.Cell>Patient Use</Table.Cell>
            <Table.Cell>Cold and Flu Syrup</Table.Cell>
            <Table.Cell>NyQuil</Table.Cell>
            <Table.Cell>355 mL</Table.Cell>
            <Table.Cell>johndoe@hawaii.edu</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="8">
              <Pagination
                totalPages={10}
                activePage={1}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Segment>
  </Container>
);
export default DispenseLog;
