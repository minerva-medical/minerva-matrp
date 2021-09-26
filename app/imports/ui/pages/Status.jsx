import React from 'react';
import { Header, Form, Container, Table, Segment, Divider, Dropdown,
  Pagination, Icon, Grid } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders the Page for Dispensing Inventory. */

const recordOptions = [
  { key: '0', value: '10', text: '10' },
  { key: '1', value: '25', text: '25' },
  { key: '2', value: '50', text: '50' },
  { key: '3', value: '100', text: '100' },
];

const medicationLocation = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Case 1', text: 'Case 1' },
  { key: '2', value: 'Case 2', text: 'Case 2' },
  { key: '3', value: 'Case 3', text: 'Case 3' },
  { key: '4', value: 'Case 4', text: 'Case 4' },
  { key: '5', value: 'Case 5', text: 'Case 5' },
  { key: '6', value: 'Case 6', text: 'Case 6' },
  { key: '7', value: 'Case 7', text: 'Case 7' },
  { key: '8', value: 'Case 8', text: 'Case 8' },
  { key: '9', value: 'Refrigerator', text: 'Refrigerator' },
  { key: '10', value: 'Freezer', text: 'Freezer' },
];

const medicationType = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Allergy & Cold Medicines', text: 'Allergy & Cold Medicines' },
  { key: '2', value: 'Analgesics/Anti-inflammatory', text: 'Analgesics/Anti-inflammatory' },
  { key: '3', value: 'Antimicrobials', text: 'Antimicrobials' },
  { key: '4', value: 'Cardiac/Cholesterol', text: 'Cardiac/Cholesterol' },
  { key: '5', value: 'Dermatologic Preparations', text: 'Dermatologic Preparations' },
  { key: '6', value: 'Diabetes Meds', text: 'Diabetes Meds' },
  { key: '7', value: 'Ear and Eye Preparations', text: 'Ear and Eye Preparations' },
  { key: '8', value: 'Emergency Kit', text: 'Emergency Kit' },
  { key: '9', value: 'GI Meds', text: 'GI Meds' },
  { key: '10', value: 'GYN Meds', text: 'GYN Meds' },
  { key: '11', value: 'Pulmonary', text: 'Pulmonary' },
  { key: '12', value: 'Smoking Cessation', text: 'Smoking Cessation' },
  { key: '13', value: 'Vitamins and Supplements', text: 'Vitamins and Supplements' },
  { key: '14', value: 'Other', text: 'Other' },
];

const medicationBrand = [
  { key: '0', value: 'All', text: 'All' },
  { key: '1', value: 'Tylenol', text: 'Tylenol' },
  { key: '2', value: 'Fluticasone', text: 'Fluticasone' },
  { key: '3', value: 'Advair', text: 'Advair' },
  { key: '4', value: 'Dex4', text: 'Dex4' },
  { key: '5', value: 'Janumet XR', text: 'Janumet XR' },
  { key: '6', value: 'Glyxambi', text: 'Glyxambi' },
  { key: '7', value: 'Advil', text: 'Advil' },
  { key: '8', value: 'Emergency Kit', text: 'Emergency Kit' },
  { key: '9', value: 'Chloraseptic', text: 'Chloraseptic' },
];

/** Render the form. */
const Status = () => (
  <Container id={PAGE_IDS.STATUS_LOG} style={{ marginTop: '1em' }}>
    <Segment style={{ marginTop: '1em' }}>
      <Header as="h2">
        <Header.Content>
          Inventory Status
          <Header.Subheader>
            <i>Use the search filter to check for a specific drug or
              click on the table header to sort the column.</i>
          </Header.Subheader>
        </Header.Content>
      </Header>
      <br/>
      <Grid>
        <div>
          <Grid.Column width={8}>
            <Form>
              <Form.Field style={{ marginBottom: '1em' }}>
                <Form.Input floated={'right'}
                  placeholder={'Enter a filter.'}
                  name={'filter'}
                  label={'Filter'}
                  icon={'search'}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </div>
      </Grid>
      <Divider/>
      <Grid divided columns="equal">
        <Grid.Row textAlign='center'>
          <Grid.Column>
            Type of Medication: {' '}
            <Dropdown
              inline={true}
              options={medicationType}
              search
              defaultValue={'All'}
            />
          </Grid.Column>
          <Grid.Column>
            Medication Brand: {' '}
            <Dropdown
              inline={true}
              options={medicationBrand}
              search
              defaultValue={'All'}
            />
          </Grid.Column>
          <Grid.Column>
            Medication Location: {' '}
            <Dropdown
              inline={true}
              options={medicationLocation}
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
              Total count: {'200'}
        <Table celled selectable sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                width={3}
              >
                      Type
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
              >
                      Medication
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
              >
                      Brand
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
              >
                      Location
              </Table.HeaderCell>
              <Table.HeaderCell
                width={1}
              >
                      Quantity
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
              >
                      LotId
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
              >
                      Expiration
              </Table.HeaderCell>
              <Table.HeaderCell
                width={1}
              >
                      Status
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
              <Table.Cell>Acetaminophen 500 mg Caps</Table.Cell>
              <Table.Cell>Tylenol</Table.Cell>
              <Table.Cell>Case 4</Table.Cell>
              <Table.Cell>60</Table.Cell>
              <Table.Cell>
                      12332A33
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>11/15/2024</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='green' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
              <Table.Cell>Acetaminophen 160mg/5 ml Susp</Table.Cell>
              <Table.Cell>Tylenol</Table.Cell>
              <Table.Cell>Case 4</Table.Cell>
              <Table.Cell>2</Table.Cell>
              <Table.Cell>
                      123AN413
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>12/01/2021</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='yellow' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
              <Table.Cell>Acetaminophen Infant Drops</Table.Cell>
              <Table.Cell>Tylenol</Table.Cell>
              <Table.Cell>Case 4</Table.Cell>
              <Table.Cell>0</Table.Cell>
              <Table.Cell>
                      6336AG46
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>01/09/2022</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='red' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Pulmonary</Table.Cell>
              <Table.Cell>Steroid Inhaler</Table.Cell>
              <Table.Cell>Fluticasone </Table.Cell>
              <Table.Cell>Case 1</Table.Cell>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>
                      A6326853
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>01/05/2022</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='yellow' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Pulmonary</Table.Cell>
              <Table.Cell>Steroid/Long Acting Beta Agonist (Adult)</Table.Cell>
              <Table.Cell>Advair</Table.Cell>
              <Table.Cell>Case 1</Table.Cell>
              <Table.Cell>3</Table.Cell>
              <Table.Cell>
                      A0492792
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>04/02/2022</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='green' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Diabetes Meds</Table.Cell>
              <Table.Cell>Glucose Tablets</Table.Cell>
              <Table.Cell>Dex4</Table.Cell>
              <Table.Cell>Case 8</Table.Cell>
              <Table.Cell>130</Table.Cell>
              <Table.Cell>
                      A0498093
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>06/01/2023</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='green' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Diabetes Meds</Table.Cell>
              <Table.Cell>DPP-4 Inhibitors (Sitagliptin 100 mg)</Table.Cell>
              <Table.Cell>Janumet XR</Table.Cell>
              <Table.Cell>Case 8</Table.Cell>
              <Table.Cell>100</Table.Cell>
              <Table.Cell>
                      A0490626
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>08/22/2024</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='green' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Diabetes Meds</Table.Cell>
              <Table.Cell>SGLT2 Inhibitors/DPP4 Inhibitor (10mg/5mg)</Table.Cell>
              <Table.Cell>Glyxambi</Table.Cell>
              <Table.Cell>Case 8</Table.Cell>
              <Table.Cell>58</Table.Cell>
              <Table.Cell>
                      A0498627
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>07/30/2023</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='green' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Allergy & Cold Medicines</Table.Cell>
              <Table.Cell>Diphenhydramine Soln</Table.Cell>
              <Table.Cell>Advil</Table.Cell>
              <Table.Cell>Case 2</Table.Cell>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>
                      A0495673
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>06/15/2022</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='red' name='circle'/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Allergy & Cold Medicines</Table.Cell>
              <Table.Cell>Sore Throat Spray</Table.Cell>
              <Table.Cell>Chloraseptic</Table.Cell>
              <Table.Cell>Case 6</Table.Cell>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>
                      A0496798
                <Dropdown
                  inline={true}
                />
              </Table.Cell>
              <Table.Cell>09/23/2021</Table.Cell>
              <Table.Cell textAlign='center'>
                <Icon color='red' name='circle'/>
              </Table.Cell>
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
      </div>
    </Segment>
  </Container>
);

export default Status;
