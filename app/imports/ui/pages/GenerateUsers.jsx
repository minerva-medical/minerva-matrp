import React from 'react';
import { Divider, Grid, Header } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

const GenerateUsers = () => (
  <div id='generateUsers'>
    <Grid className='generateUsers' id={PAGE_IDS.GENERATE_USERS} verticalAlign='top' textAlign='center' container>
      <Header as="h1">Create New Users</Header>
      <Divider section hidden/>
    </Grid>
  </div>
);

export default GenerateUsers;
