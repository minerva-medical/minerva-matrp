import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Icon } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
const Signup = ({ location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  // Update the form controls each time the user interacts with them.
  const handleChange = (e, { name, value }) => {
    switch (name) {
    case 'email':
      setEmail(value);
      break;
    case 'password':
      setPassword(value);
      break;
    default:
        // do nothing.
    }
  };

  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = () => {
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToReferer(true);
      }
    });
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location.state || { from: { pathname: '/about' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }
  return (
    <div id='signup-div'>
      <Container id={PAGE_IDS.SIGN_UP}>
        <Grid textAlign="center" centered columns={2}>
          <Grid.Column width={7}>
            <Icon name='stethoscope' size='huge' style={{ visibility: 'hidden' }}/>
            <Header as="h1" textAlign="center">
              MINERVA
            </Header>
          </Grid.Column>
          <Grid.Column width={9}>
            <Header as="h2" textAlign="center">
              WELCOME TO MINERVA MEDICAL, REGISTER FOR AN ACCOUNT BELOW!
            </Header>
            <Form onSubmit={submit}>
              <Form.Input
                label="Email"
                id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL}
                icon="user"
                iconPosition="left"
                name="email"
                type="email"
                placeholder="E-mail address"
                onChange={handleChange}
              />
              <Form.Input
                label="Password"
                id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD}
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
              />
              <Form.Button id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} content="Submit"/>
            </Form>
            <h3>Already have a registered account? <NavLink exact to="/signin" key="signin" id="signIn">LOG IN</NavLink></h3>
            {error === '' ? (
              ''
            ) : (
              <Message
                error
                header="Registration was not successful"
                content={error}
              />
            )}
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
