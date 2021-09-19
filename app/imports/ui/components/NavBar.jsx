import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
const NavBar = ({ currentUser }) => {
  const menuStyle = { marginBottom: '10px' };
  return (
    <Menu style={menuStyle} attached="top" borderless inverted>
      <Menu.Item id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} activeClassName="" exact to="/">
        <Header inverted as='h1'>MATRP</Header>
      </Menu.Item>
      {currentUser ? (
        [<Menu.Item id={COMPONENT_IDS.NAVBAR_ADD_STUFF} as={NavLink} activeClassName="active" exact to="/add" key='add'>Add Stuff</Menu.Item>,
          <Menu.Item id={COMPONENT_IDS.NAVBAR_LIST_STUFF} as={NavLink} activeClassName="active" exact to="/list" key='list'>List Stuff</Menu.Item>]
      ) : ''}
      {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
        [<Menu.Item id={COMPONENT_IDS.NAVBAR_LIST_STUFF_ADMIN} as={NavLink} activeClassName="active" exact to="/admin" key='admin'>Admin</Menu.Item>,
          <Dropdown id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN} item text="Manage" key="manage-dropdown">
            <Dropdown.Menu>
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} key="manage-database" as={NavLink} exact to="/manage-database" content="Database" />
            </Dropdown.Menu>
          </Dropdown>]
      ) : ''}
      <Menu.Item position="right">
        {currentUser === '' ? (
          <Dropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} text="Login" pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} icon="user" text="Sign In" as={NavLink} exact to="/signin" />
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} icon="add user" text="Sign Up" as={NavLink} exact to="/signup" />
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Dropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} text={currentUser} pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Menu.Item>
    </Menu>
  );
};

// Declare the types of all properties.
NavBar.propTypes =
{
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const NavBarContainer = withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return {
    currentUser,
  };
})(NavBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(NavBarContainer);
