import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header, Icon } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import StatusNotification from '../pages/StatusNotification';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
const NavBar = ({ currentUser }) => {
  const menuStyle = { marginBottom: '30px', backgroundColor: '#1D3E66', backgroundSize: 'content' };
  return (
    <Menu style={menuStyle} attached="top" borderless inverted>
      <Menu.Item id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} activeClassName="" exact to="/about">
        <Header inverted as='h1'>Minerva</Header>
      </Menu.Item>
      {
        currentUser ? (
          [
            <Menu.Item id={COMPONENT_IDS.NAVBAR_ADD_INVENTORY} as={NavLink} activeClassName="active" exact to="/add"
              key='add' position="right">
              Add to Inventory
              <Icon name='plus'/>
            </Menu.Item>,
            <Menu.Item id={COMPONENT_IDS.NAVBAR_DISPENSE} as={NavLink} activeClassName="active" exact to="/dispense"
              key='dispense'>
              Dispense Inventory
              <Icon name='pills'/>
            </Menu.Item>,
            <Menu.Item id={COMPONENT_IDS.NAVBAR_STATUS} as={NavLink} activeClassName="active" exact to="/status"
              key='status'>
              Inventory Status
              <Icon name='archive'/>
            </Menu.Item>,
            <Menu.Item id={COMPONENT_IDS.NAVBAR_DISPENSE_LOG} as={NavLink} activeClassName="active" exact
              to="/dispense-log" key='dispense-log'>
              Dispense Log
              <Icon name='book'/>
            </Menu.Item>,
            <Menu.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWNS} as={NavLink} activeClassName="active" exact
              to="/manage-dropdowns" key='manage-dropdowns'>
              Manage Dropdowns
            </Menu.Item>,
          ]
        ) : ''
      }
      {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
        [<Dropdown id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN} item text="Manage" key="manage-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} key="manage-database" as={NavLink} exact to="/manage-database" content="Database" />
          </Dropdown.Menu>
        </Dropdown>]
      ) : ''}
      <Menu.Item position="right">
        <Menu.Item id={COMPONENT_IDS.NAVBAR_STATUS_NOTIFICATION} as={NavLink} activeClassName="active" exact to="/status-notification" key='status-notification'>
          <StatusNotification/>
        </Menu.Item>
        {
          currentUser === '' ?
            (
              <Dropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} text="Login" pointing="top right" icon={'user md'}>
                <Dropdown.Menu>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} icon="user" text="Sign In"
                    as={NavLink} exact to="/signin" />
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} icon="add user" text="Sign Up"
                    as={NavLink} exact to="/signup" />
                </Dropdown.Menu>
              </Dropdown>
            ) :
            (
              <Dropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} text={currentUser} pointing="top right" icon={'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} icon="sign out" text="Sign Out" as={NavLink} exact
                    to="/signout" />
                </Dropdown.Menu>
              </Dropdown>
            )
        }
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
