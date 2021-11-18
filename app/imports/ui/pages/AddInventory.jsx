import React from 'react';
import { Container, Tab, Menu } from 'semantic-ui-react';
import AddMedication from '../components/AddMedication';
import AddVaccination from '../components/AddVaccination';
import AddSupplies from '../components/AddSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const medicationTab = () => <AddMedication/>;
const vaccinesTab = () => <AddVaccination />;
const suppliesTab = () => <AddSupplies/>;

const panes = [
  { menuItem: <Menu.Item key={COMPONENT_IDS.TAB_ONE} id={COMPONENT_IDS.TAB_ONE}>Medication</Menu.Item>, render: medicationTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.TAB_TWO} id={COMPONENT_IDS.TAB_TWO}>Vaccines</Menu.Item>, render: vaccinesTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.TAB_THREE} id={COMPONENT_IDS.TAB_THREE}>Supplies</Menu.Item>, render: suppliesTab },
];

const AddInventory = () => (
  <Container id={PAGE_IDS.ADD_INVENTORY}>
    <Tab panes={panes} id={COMPONENT_IDS.TABS}/>
  </Container>
);

export default AddInventory;
