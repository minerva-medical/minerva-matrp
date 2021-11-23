import React from 'react';
import { Container, Tab, Menu } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import MedStatus from '../components/MedStatus';
import SupplyStatus from '../components/SupplyStatus';
import VaccineStatus from '../components/VaccineStatus';

const medicationTab = () => <MedStatus />;
const vaccinesTab = () => <VaccineStatus />;
const suppliesTab = () => <SupplyStatus />;

const panes = [
  { menuItem: <Menu.Item key={COMPONENT_IDS.STATUS_TAB_ONE} id={COMPONENT_IDS.STATUS_TAB_ONE}>Medication</Menu.Item>,
    render: medicationTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.STATUS_TAB_TWO} id={COMPONENT_IDS.STATUS_TAB_TWO}>Vaccines</Menu.Item>,
    render: vaccinesTab },
  { menuItem: <Menu.Item key={COMPONENT_IDS.STATUS_TAB_THREE} id={COMPONENT_IDS.STATUS_TAB_THREE}>Supplies</Menu.Item>,
    render: suppliesTab },
];

const Status = () => (
  <Container id={PAGE_IDS.STATUS}>
    <Tab panes={panes} />
  </Container>
);

export default Status;
