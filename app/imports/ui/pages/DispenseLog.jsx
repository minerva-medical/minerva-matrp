import React from 'react';
import { Header, Container, Loader, Table, Segment, Divider, Dropdown, Pagination, Grid } from 'semantic-ui-react';
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
    <Header as="h2">
      <Header.Content>
              History Dispense Log
        <Header.Subheader>
          <i>Below is a history log of dispensed inventories.</i>
        </Header.Subheader>
      </Header.Content>
    </Header>
    <Segment>
      <Grid>
        <Grid.Row columns={5}>
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
      <Table celled selectable sortable>
        <Table.Header>
          <Table.Row>
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
          <Table.Row>
            <Table.Cell>2021-09-13 (12:25:30)</Table.Cell>
            <Table.Cell>Broken/Contaminated</Table.Cell>
            <Table.Cell>Acetaminophen 160mg/5 ml Susp</Table.Cell>
            <Table.Cell>Advil</Table.Cell>
            <Table.Cell>2</Table.Cell>
            <Table.Cell>johndoe@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-12 (08:30:04)</Table.Cell>
            <Table.Cell>Patient Use</Table.Cell>
            <Table.Cell>Acetaminophen Infant Drops</Table.Cell>
            <Table.Cell>Tylenol</Table.Cell>
            <Table.Cell>2.5 mL</Table.Cell>
            <Table.Cell>doe@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-12 (07:45:20)</Table.Cell>
            <Table.Cell>Expired</Table.Cell>
            <Table.Cell>Cetirizine 10 mg tablets</Table.Cell>
            <Table.Cell>Zyrtic</Table.Cell>
            <Table.Cell>30</Table.Cell>
            <Table.Cell>sueflay@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-11 (10:04:18)</Table.Cell>
            <Table.Cell>Broken/Contaminated</Table.Cell>
            <Table.Cell>Naproxen 500 mg tabs</Table.Cell>
            <Table.Cell>Aleve</Table.Cell>
            <Table.Cell>15</Table.Cell>
            <Table.Cell>obijuan@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-10 (13:04:47)</Table.Cell>
            <Table.Cell>Patient Use</Table.Cell>
            <Table.Cell>Steroid Inhaler</Table.Cell>
            <Table.Cell>Ventolin</Table.Cell>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>maryjane@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-10 (10:15:22)</Table.Cell>
            <Table.Cell>Patient Use</Table.Cell>
            <Table.Cell>Ibuprofen 800 mg tabs</Table.Cell>
            <Table.Cell>Advil</Table.Cell>
            <Table.Cell>60</Table.Cell>
            <Table.Cell>johndoe@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-10 (09:35:17)</Table.Cell>
            <Table.Cell>Patient Use</Table.Cell>
            <Table.Cell>Amoxicillin 250 mg Chewables</Table.Cell>
            <Table.Cell>Amoxil</Table.Cell>
            <Table.Cell>30</Table.Cell>
            <Table.Cell>janedoe@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-10 (08:22:45)</Table.Cell>
            <Table.Cell>Expired</Table.Cell>
            <Table.Cell>Cold and Flu Syrup</Table.Cell>
            <Table.Cell>NyQuil</Table.Cell>
            <Table.Cell>355 mL</Table.Cell>
            <Table.Cell>sueflay@hawaii.edu</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2021-09-09 (10:15:25)</Table.Cell>
            <Table.Cell>Expired</Table.Cell>
            <Table.Cell>Penicillin VK 500 mg Tabs</Table.Cell>
            <Table.Cell>Penicillin VK </Table.Cell>
            <Table.Cell>30</Table.Cell>
            <Table.Cell>obijuan@hawaii.edu</Table.Cell>
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
