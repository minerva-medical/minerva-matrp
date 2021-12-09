import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Icon, Divider } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import swal from 'sweetalert';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
const GenerateUsers = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  // Update the form controls each time the user interacts with them.
  const handleChange = (e, { name, value }) => {
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'role':
        setRole(value);
      default:
      // do nothing.
    }
  };

  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = () => {
    if (role === ROLE.ADMIN) {
      if (AdminProfiles.define({ email, firstName: email, lastName: 'name', password })){
        swal('Success', `Created user with email ${email} and role ${role}`, 'success', { buttons: false, timer: 3000 });
      }
    } else { // everyone else is just a user.
      UserProfiles.define({ email, firstName: email, lastName: 'name', password });
    }
  };
  return (
    <div id='generateUsers'>
      <Container id={PAGE_IDS.GENERATE_USERS}>
        <Grid textAlign="center" centered>

          <Grid.Column width={9}>
            <Header as="h2" textAlign="center">
              CREATE A NEW USER ACCOUNT
            </Header>
            <Form onSubmit={submit}>
              <Form.Group inline>
                <label>Role</label>
                <Form.Radio
                  label="Admin"
                  id={COMPONENT_IDS.GENERATE_ROLE_ADMIN}
                  name="role"
                  value="ADMIN"
                  onChange={handleChange}
                />
                <Form.Radio
                  label="User"
                  id={COMPONENT_IDS.GENERATE_ROLE_USER}
                  name="role"
                  value="USER"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Input
                label="Email"
                id={COMPONENT_IDS.GENERATE_FORM_EMAIL}
                icon="user"
                iconPosition="left"
                name="email"
                type="email"
                placeholder="E-mail address"
                onChange={handleChange}
              />
              <Form.Input
                label="Password"
                id={COMPONENT_IDS.GENERATE_FORM_PASSWORD}
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
              />
              <Form.Button id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} content="Submit"/>
            </Form>
            <div className='signin-message'>
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
            </div>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};

export default GenerateUsers;
