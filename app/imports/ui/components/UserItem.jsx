import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const UserItem = ({ user }) => (
  <Table.Row>
    <Table.Cell>{user.email}</Table.Cell>
    <Table.Cell>{user.firstName}</Table.Cell>
    <Table.Cell>{user.lastName}</Table.Cell>
    <Table.Cell>{user.role}</Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
UserItem.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(UserItem);
