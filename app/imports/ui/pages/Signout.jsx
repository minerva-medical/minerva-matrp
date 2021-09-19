import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <Header id={PAGE_IDS.SIGN_OUT} as="h2" textAlign="center">
      <p>You are signed out.</p>
    </Header>
  );
};

export default Signout;
