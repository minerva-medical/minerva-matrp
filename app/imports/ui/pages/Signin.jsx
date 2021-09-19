import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const Signin = ({ location }) => {

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

  // Handle Signin submission using Meteor's account mechanism.
  const submit = () => {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToReferer(true);
      }
    });
  };

  // Render the signin form.
  const { from } = location.state || { from: { pathname: '/' } };
  // if correct authentication, redirect to page instead of login screen
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }
  // Otherwise return the Login form.
  return (
    <Container id={PAGE_IDS.SIGN_IN}>
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Login to your account
          </Header>
          <Form onSubmit={submit}>
            <Segment stacked>
              <Form.Input
                label="Email"
                id={COMPONENT_IDS.SIGN_IN_FORM_EMAIL}
                icon="user"
                iconPosition="left"
                name="email"
                type="email"
                placeholder="E-mail address"
                onChange={handleChange}
              />
              <Form.Input
                label="Password"
                id={COMPONENT_IDS.SIGN_IN_FORM_PASSWORD}
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
              />
              <Form.Button id={COMPONENT_IDS.SIGN_IN_FORM_SUBMIT} content="Submit" />
            </Segment>
          </Form>
          <Message>
            <Link to="/signup">Click here to Register</Link>
          </Message>
          {error === '' ? (
            ''
          ) : (
            <Message
              error
              header="Login was not successful"
              content={error}
            />
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

// Ensure that the React Router location object is available in case we need to redirect.
Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
