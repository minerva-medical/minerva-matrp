import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, NavLink } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment, Button } from 'semantic-ui-react';
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
  const { from } = location.state || { from: { pathname: '/list' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }
  return (
    <div className="body-signup">
      <div className="container-sign" id="container">
        <div className="form-container sign-up-container">
          <Form onSubmit={this.submit} className="form-signup">
            <h1 className="h1-signup">Create Account</h1>
            <Segment stacked>
              <span>or use your email for registration</span>
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
            </Segment>
          </Form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="h1-signup">Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost button-signup" id="signUp">Sign Up</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Aloha, Friend!</h1>
              <p>Already have a registered account?</p>
              <Button inverted className="ghost button-signup" exact to="/signin" key="signin" id="signIn"
                as={NavLink} activeClassName="">LOGIN</Button>
            </div>
          </div>
        </div>
        <Container id={PAGE_IDS.SIGN_UP}>
          <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
            <Grid.Column>
              <Header as="h2" textAlign="center">
                    Register your account
              </Header>
              <Message>
                    Already have an account? Login <Link to="/signin">here</Link>
              </Message>
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
    </div>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
