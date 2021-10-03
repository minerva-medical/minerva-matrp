import React from 'react';
import { Header, Container, Table, Segment, Divider, Dropdown, Pagination, Grid, Icon, Form } from 'semantic-ui-react';
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

const inventory = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Medication', text: 'Medication' },
  { key: '2', value: 'Vaccination', text: 'Vaccination' },
  { key: '3', value: 'Patient Supplies', text: 'Patient Supplies' },
  { key: '4', value: 'Lab Testing Supplies', text: 'Lab Testing Supplies' },
];

/** Render the form. */
const DispenseLog = () => (
  <Container id='dispense-log'>
    <Grid>
      <Segment>
        <Header as="h2">
          <Header.Content>
            History Dispense Log
            <Header.Subheader>
            Use the search filter to check for a specific drug or click on the table header to sort the column.
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Divider/>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Form.Field style={{ marginBottom: '1em' }}>
                  <Form.Input floated={'right'}
                    placeholder={'Filter by patient number...'}
                    name={'filter'}
                    label={'Filter'}
                    icon={'search'}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
              Dispense Type: {' '}
              <Dropdown
                inline={true}
                options={reason}
                defaultValue={'All'}
              />
            </Grid.Column>
            <Grid.Column>
            Inventory Type: {' '}
              <Dropdown
                inline={true}
                options={inventory}
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
        <Table striped singleLine columns={10}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date & Time</Table.HeaderCell>
              <Table.HeaderCell>Dispense Type</Table.HeaderCell>
              <Table.HeaderCell>Patient Number</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Medication Name</Table.HeaderCell>
              <Table.HeaderCell>LotID</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Dispensed by</Table.HeaderCell>
              <Table.HeaderCell>Detailed Notes</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>2021-09-13 (12:25:30)</Table.Cell>
              <Table.Cell>Patient Use</Table.Cell>
              <Table.Cell>123456</Table.Cell>
              <Table.Cell>Analgesics/Anti-Inflammatory</Table.Cell>
              <Table.Cell>Acetaminophen 500 mg Caps</Table.Cell>
              <Table.Cell>76543A21</Table.Cell>
              <Table.Cell>60 tabs</Table.Cell>
              <Table.Cell>johndoe@hawaii.edu</Table.Cell>
              <Table.Cell><Icon name="info circle"/>See details</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>2021-09-13 (12:25:30)</Table.Cell>
              <Table.Cell>Patient Use</Table.Cell>
              <Table.Cell>123456</Table.Cell>
              <Table.Cell>Analgesics/Anti-Inflammatory</Table.Cell>
              <Table.Cell>Acetaminophen 500 mg Caps</Table.Cell>
              <Table.Cell>76543A21</Table.Cell>
              <Table.Cell>60 tabs</Table.Cell>
              <Table.Cell>johndoe@hawaii.edu</Table.Cell>
              <Table.Cell><Icon name="info circle"/>See details</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="10">
                <Pagination totalPages={10} activePage={1}/>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    </Grid>
  </Container>
);
export default DispenseLog;
