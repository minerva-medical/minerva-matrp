import React from 'react';
import { Divider, Grid, Header, Image } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

const UserManagement = () => (
  <div id='userManagement'>
    <Grid className='userManagement' id={PAGE_IDS.USER_MANAGEMENT} verticalAlign='top' textAlign='center' container>
      <Header as="h1">User Management</Header>
      <Divider section hidden/>
      <Grid.Row computer={5} tablet={7} mobile={9} centered>
        <Grid.Column computer={5} centered>
          <Image
            size="massive"
            src="/images/add-user.png"
            href="/generate-new-users"/>
        </Grid.Column>
        <Grid.Column computer={5} centered>
          <Image
            size="massive"
            src="/images/edit-user.png"
            href="#"/>
        </Grid.Column>
        <Grid.Column computer={5} centered>
          <Image
            size="large"
            src="/images/list-user.png"
            href="#"/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default UserManagement;
