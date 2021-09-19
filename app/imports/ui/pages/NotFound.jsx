import React from 'react';
import { Header } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const NotFound = () => (
  <Header id={PAGE_IDS.NOT_FOUND} as="h2" textAlign="center">
    <p>Page not found</p>
  </Header>
);

export default NotFound;
