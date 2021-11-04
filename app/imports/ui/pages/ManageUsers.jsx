import React from 'react';
import { Container, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { PAGE_IDS } from '../utilities/PageIDs';

const ManageUsers = ({ ready }) => ((ready) ? (<Container id={PAGE_IDS.MANAGE_USERS}>
  <Header as="h2" textAlign="center">User Management</Header>
</Container>) : <Loader active>Getting data</Loader>);

ManageUsers.propTypes = {
  ready: PropTypes.bool,
};

export default withTracker(() => {
  const ready = AdminProfiles.subscribe().ready() && Stuffs.subscribeStuffAdmin().ready();
  return {
    ready,
  };
})(ManageUsers);
