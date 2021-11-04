import React from 'react';
import { Container, Tab, Segment } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';
import ManageDrugTypes from '../components/ManageDrugTypes';
import ManageLocations from '../components/ManageLocations';
import ManageSites from '../components/ManageSites';

const drugTypesTab = () => <ManageDrugTypes />;
const locationsTab = () => <ManageLocations />;
const sitesTab = () => <ManageSites />;

const panes = [
  { menuItem: 'Drug Types', render: drugTypesTab },
  { menuItem: 'Locations', render: locationsTab },
  { menuItem: 'Sites', render: sitesTab },
];

const ManageDropdowns = () => (
  <Container id={PAGE_IDS.MANAGE_DROPDOWNS}>
    <Segment>
      <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
    </Segment>
  </Container>
);

export default ManageDropdowns;
