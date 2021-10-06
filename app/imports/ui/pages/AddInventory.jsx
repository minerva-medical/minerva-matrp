import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import AddMedication from '../components/AddMedication';
import { PAGE_IDS } from '../utilities/PageIDs';

const medicationTab = () => <AddMedication />;
const vaccinesTab = () => <Tab.Pane>Tab 2 Content</Tab.Pane>;
const patientSuppliesTab = () => <Tab.Pane>Tab 3 Content</Tab.Pane>;
const testingSuppliesTab = () => <Tab.Pane>Tab 4 Content</Tab.Pane>;

const panes = [
  { menuItem: 'Medication', render: medicationTab },
  { menuItem: 'Vaccination', render: vaccinesTab },
  { menuItem: 'Patient Supplies', render: patientSuppliesTab },
  { menuItem: 'Lab Testing Supplies', render: testingSuppliesTab },
];

const AddInventory = () => (
  <Container id={PAGE_IDS.ADD_INVENTORY}>
    <Tab panes={panes} />
  </Container>
);

export default AddInventory;
