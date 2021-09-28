import React from 'react';
import { Header, Form, Container, Loader, Table, Segment, Divider, Dropdown,
  Pagination, Icon, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Sites } from '../../api/site/SiteCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Brands } from '../../api/brand/BrandCollection';

/** Renders the Page for Dispensing Inventory. */
class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      site: undefined,
      dateDispensed: new Date().toISOString().slice(0, 10),
      drug: undefined,
      quantity: undefined,
      brand: undefined,
      lotId: undefined,
      expire: undefined,
      dispensedTo: undefined,
      dispensedFrom: undefined,
      inventoryType: undefined,
      newSite: undefined,
    };
    this.recordOptions = [
      { key: '0', value: '10', text: '10' },
      { key: '1', value: '25', text: '25' },
      { key: '2', value: '50', text: '50' },
      { key: '3', value: '100', text: '100' },
    ];
    this.medicationLocation = [
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
    this.medicationType = [
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
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. */
  renderPage() {

    return (
      <Container id='inventory-status' style={{ marginTop: '1em' }}>
        <Header as="h2">
          <Header.Content>
            Inventory Status
            <Header.Subheader>
              <i>Use the search filter to check for a specific drug or
                click on the table header to sort the column.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Segment style={{ marginTop: '1em' }}>
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
              <Grid.Column width={15}>
                Type: {' '}
                <Dropdown
                  inline={true}
                  options={this.medicationType}
                  defaultValue={'All'}
                />
                Location: {' '}
                <Dropdown
                  inline={true}
                  options={this.medicationLocation}
                  defaultValue={'All'}
                />
              </Grid.Column>
            </div>
          </Grid>
          <Divider/>
          <div>
            Records per page:{' '}
            <Dropdown
              inline={true}
              options={this.recordOptions}
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
                    Medicine
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
                    width={1}
                  >
                    Status
                  </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
                  <Table.Cell>Acetaminophen 500 mg Caps</Table.Cell>
                  <Table.Cell>Case 4</Table.Cell>
                  <Table.Cell>60</Table.Cell>
                  <Table.Cell>12332A33</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='green' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
                  <Table.Cell>Acetaminophen 160mg/5 ml Susp</Table.Cell>
                  <Table.Cell>Case 4</Table.Cell>
                  <Table.Cell>2</Table.Cell>
                  <Table.Cell>123AN413</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='yellow' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
                  <Table.Cell>Acetaminophen Infant Drops</Table.Cell>
                  <Table.Cell>Case 4</Table.Cell>
                  <Table.Cell>0</Table.Cell>
                  <Table.Cell>6336AG46</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='red' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Pulmonary</Table.Cell>
                  <Table.Cell>Steroid Inhaler</Table.Cell>
                  <Table.Cell>Case 1</Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>A6326853</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='yellow' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Pulmonary</Table.Cell>
                  <Table.Cell>Steroid/Long Acting Beta Agonist (Adult)</Table.Cell>
                  <Table.Cell>Case 1</Table.Cell>
                  <Table.Cell>3</Table.Cell>
                  <Table.Cell>A0492792</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='green' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Diabetes Meds</Table.Cell>
                  <Table.Cell>Glucose Tablets</Table.Cell>
                  <Table.Cell>Case 8</Table.Cell>
                  <Table.Cell>130</Table.Cell>
                  <Table.Cell>A0498093</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='green' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Diabetes Meds</Table.Cell>
                  <Table.Cell>DPP-4 Inhibitors (Sitagliptin 100 mg)</Table.Cell>
                  <Table.Cell>Case 8</Table.Cell>
                  <Table.Cell>100</Table.Cell>
                  <Table.Cell>A0490626</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='green' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Diabetes Meds</Table.Cell>
                  <Table.Cell>SGLT2 Inhibitors/DPP4 Inhibitor (10mg/5mg)</Table.Cell>
                  <Table.Cell>Case 8</Table.Cell>
                  <Table.Cell>58</Table.Cell>
                  <Table.Cell>A0498627</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='green' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Allergy & Cold Medicines</Table.Cell>
                  <Table.Cell>Diphenhydramine Soln</Table.Cell>
                  <Table.Cell>Case 2</Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>A0495673</Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color='red' name='circle'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Allergy & Cold Medicines</Table.Cell>
                  <Table.Cell>Sore Throat Spray</Table.Cell>
                  <Table.Cell>Case 6</Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>A0496798</Table.Cell>
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
  }
}

/** Require an array of Stuff documents in the props. */
Status.propTypes = {
  drugs: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const siteSub = Sites.subscribeSite();
  const drugSub = Drugs.subscribeDrug();
  const lotIdSub = LotIds.subscribeLotId();
  const brandSub = Brands.subscribeBrand();
  return {
    sites: Sites.find({}).fetch(),
    drugs: Drugs.find({}).fetch(),
    lotIds: LotIds.find({}).fetch(),
    brands: Brands.find({}).fetch(),
    ready: siteSub.ready() && drugSub.ready() && lotIdSub.ready() && brandSub.ready(),
  };
})(Status);