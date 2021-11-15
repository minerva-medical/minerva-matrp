import React from 'react';
import { Container, Menu, Tab } from 'semantic-ui-react';
import DispenseMedication from '../components/DispenseMedication';
import DispenseVaccination from '../components/DispenseVaccination';
import DispenseSupplies from '../components/DispenseSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const medicationTab = () => <DispenseMedication/>;
const vaccinesTab = () => <DispenseVaccination/>;
const suppliesTab = () => <DispenseSupplies/>;

const panes = [
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_ONE} id={COMPONENT_IDS.DISPENSE_TAB_ONE}>Medication</Menu.Item>, render: medicationTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_TWO} id={COMPONENT_IDS.DISPENSE_TAB_TWO}>Vaccines</Menu.Item>, render: vaccinesTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.DISPENSE_TAB_THREE} id={COMPONENT_IDS.DISPENSE_TAB_THREE}>Supplies</Menu.Item>, render: suppliesTab },
];

const Dispense = () => (
  <Container id={PAGE_IDS.DISPENSE}>
    <Tab panes={panes} />
  </Container>
);

export default Dispense;
