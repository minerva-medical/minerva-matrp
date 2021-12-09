import React, { useState } from 'react';
import { Container, Form, Grid, Header, Message } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Generates a new user with the credentials provided, and signs in as them.
 */
const GenerateUsers = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    default:
      // do nothing.
    }
  };

  /* Handle submission. Create user account and a profile entry. */
  const submit = () => {
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
      }
    });
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
              <Form.Button id={COMPONENT_IDS.GENERATE_FORM_SUBMIT} content="Submit"/>
            </Form>
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

export default GenerateUsers;
