import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import AddMedication from '../components/AddMedication';
import AddVaccination from '../components/AddVaccination';
import AddPatientSupplies from '../components/AddPatientSupplies';
import AddLabTestSupplies from '../components/AddLabTestSupplies';

const medicationTab = () => <AddMedication />;
const vaccinesTab = () => <AddVaccination/>;
const patientSuppliesTab = () => <AddPatientSupplies/>;
const testingSuppliesTab = () => <AddLabTestSupplies/>;
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
