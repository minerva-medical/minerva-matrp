import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import UserItem from '../components/UserItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the user documents. Use <UserItem> to render each row. */
const ListUsers = ({ ready, admins, userReady, users }) => ((ready && userReady) ? (
  <Container id={PAGE_IDS.LIST_USERS}>
    <Header as="h2" textAlign="center">Users</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <Table.HeaderCell>Last Name</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {admins.map((admin) => <UserItem key={admin._id} user={admin} />)}
      </Table.Body>
      <Table.Body>
        {users.map((user) => <UserItem key={user._id} user={user} />)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
ListUsers.propTypes = {
  admins: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  userReady: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to admin documents.
  const subscription = AdminProfiles.subscribe();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the admin documents.
  const admins = AdminProfiles.find({}).fetch();

  // Get access to regular user documents.
  const userSubscription = UserProfiles.subscribe();
  // Determine if the subscription is ready
  const userReady = userSubscription.ready();
  // Get the admin documents.
  const users = UserProfiles.find({}).fetch();

  return {
    admins,
    ready,
    userReady,
    users,
  };
})(ListUsers);
