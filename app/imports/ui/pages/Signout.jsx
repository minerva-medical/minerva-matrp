import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <div className='signOutPage' id={PAGE_IDS.SIGN_OUT}>
      <Segment style={{ padding: '8em 0em' }} vertical>
        <Container text>
          <i style={{ fontSize: '1.33em', color: 'white' }}>You have successfully signed out.</i>
          <Header as='h3' style={{ fontSize: '9.5em' }} inverted>MINERVA</Header>
          <p style={{ textAlign: 'right', fontSize: '1.7em', color: 'white' }}><i>Come Back Soon!</i></p>
          <Button.Group>
            <Button as={NavLink} activeClassName="" exact to="/" key='landing' color="black" size='huge'>
              HOME
            </Button>
            <Button as={NavLink} activeClassName="" exact to="/signin" key='signin' color="olive" size='huge'
              basic inverted>LOGIN</Button>
          </Button.Group>
        </Container>
      </Segment>
    </div>
  );
};

export default Signout;
