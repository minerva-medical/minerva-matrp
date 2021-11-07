import React from 'react';
import { Container, Menu, Tab } from 'semantic-ui-react';
import DispenseMedication from '../components/DispenseMedication';
import DispenseVaccination from '../components/DispenseVaccination';
import DispensePatientSupplies from '../components/DispensePatientSupplies';
import DispenseLabTestSupplies from '../components/DispenseLabTestSupplies';
import NonPatientDispense from '../components/NonPatientDispense';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const medicationTab = () => <DispenseMedication/>;
const vaccinesTab = () => <DispenseVaccination/>;
const patientSuppliesTab = () => <DispensePatientSupplies/>;
const testingSuppliesTab = () => <DispenseLabTestSupplies/>;
// const nonPatientTab = () => <Tab.Pane>Broken/Lost/Contaminated/Expired/Inventory</Tab.Pane>;
const nonPatientTab = () => <NonPatientDispense />;

const panes = [
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_ONE} id={COMPONENT_IDS.DISPENSE_TAB_ONE}>Medication</Menu.Item>, render: medicationTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_TWO} id={COMPONENT_IDS.DISPENSE_TAB_TWO}>Vaccination</Menu.Item>, render: vaccinesTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_THREE} id={COMPONENT_IDS.DISPENSE_TAB_THREE}>Patient Supplies</Menu.Item>, render: patientSuppliesTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_FOUR} id={COMPONENT_IDS.DISPENSE_TAB_FOUR}>Lab Testing Supplies</Menu.Item>, render: testingSuppliesTab },
  // TODO: better tab name
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_FIVE} id={COMPONENT_IDS.DISPENSE_TAB_FIVE}>Non-Patient Dispense</Menu.Item>, render: nonPatientTab },
];

const Dispense = () => (
  <Container id={PAGE_IDS.DISPENSE}>
    <Tab panes={panes} />
  </Container>
);

export default Dispense;
