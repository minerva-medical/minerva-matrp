import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <div id='signOutPage'>
      <Container text id={PAGE_IDS.SIGN_OUT}>
        <Header as='h2' content='You have successfully signed out!'/>
        <Header as="h3" textAlign="center">MINERVA</Header>
        <Header as='h1' content='Come Back Soon!'/>
        <Button.Group>
          <Button as={NavLink} activeClassName="" exact to="/" key='landing' color="black" size='huge'>
            HOME
          </Button>
          <Button as={NavLink} activeClassName="" exact to="/signin" key='signin' size='huge'
            inverted colored>LOGIN</Button>
        </Button.Group>
      </Container>
    </div>
  );
};

export default Signout;
