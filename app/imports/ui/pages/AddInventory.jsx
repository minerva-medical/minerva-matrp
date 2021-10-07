import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import AddMedication from '../components/AddMedication';
import AddVaccination from '../components/AddVaccination';
import AddPatientSupplies from '../components/AddPatientSupplies';
import AddLabTestSupplies from '../components/AddLabTestSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';

const medicationTab = () => <AddMedication />;
const vaccinesTab = () => <AddVaccination/>;
const patientSuppliesTab = () => <AddPatientSupplies/>;
const testingSuppliesTab = () => <AddLabTestSupplies/>;

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
