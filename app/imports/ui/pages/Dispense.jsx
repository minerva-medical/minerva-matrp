import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import DispenseMedication from '../components/DispenseMedication';
import DispenseVaccination from '../components/DispenseVaccination';
import { PAGE_IDS } from '../utilities/PageIDs';

const medicationTab = () => <DispenseMedication/>;
const vaccinesTab = () => <DispenseVaccination/>
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

const Dispense = () => (
  <Container id={PAGE_IDS.DISPENSE}>
    <Tab panes={panes} />
  </Container>
);

export default Dispense;
