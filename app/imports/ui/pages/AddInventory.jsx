import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import AddMedication from '../components/AddMedication';

const medicationTab = () => <AddMedication />;
const vaccinesTab = () => <Tab.Pane>Tab 2 Content</Tab.Pane>;
const patientSuppliesTab = () => <Tab.Pane>Tab 3 Content</Tab.Pane>;
const testingSuppliesTab = () => <Tab.Pane>Tab 4 Content</Tab.Pane>;
const reportTab = () => <Tab.Pane>Broken/Lost/Contaminated/Expired</Tab.Pane>;

const panes = [
  { menuItem: 'Medication', render: medicationTab },
  { menuItem: 'Vaccination', render: vaccinesTab },
  { menuItem: 'Patient Supplies', render: patientSuppliesTab },
  { menuItem: 'Lab Testing Supplies', render: testingSuppliesTab },
  // TODO: better tab name
  { menuItem: 'Report', render: reportTab },
];

const AddInventory = () => (
  <Container>
    <Tab panes={panes} />
  </Container>
);

export default AddInventory;
