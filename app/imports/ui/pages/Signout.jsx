import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Divider, Grid, Header, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <div id='signOutPage'>
      <Grid className='signOutGrid' id={PAGE_IDS.SIGN_OUT} verticalAlign='top' textAlign='center' container>
        <Header as="h1">MINERVA MEDICAL</Header>
        <Header as="h2">You have successfully signed out. Come Back Soon!</Header>
        <Divider section hidden/>
        <Grid.Row computer={5} tablet={7} mobile={9} centered>
          <Button.Group>
            <Button as={NavLink} activeClassName="" exact to="/" key='landing' color="black" size='huge'>
              <Icon name='home'/> HOME
            </Button>
            <Button as={NavLink} activeClassName="" exact to="/signin" key='signin' size='huge'
              inverted>LOGIN</Button>
          </Button.Group>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Signout;
