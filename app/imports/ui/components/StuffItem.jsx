import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const StuffItem = ({ stuff }) => (
  <Table.Row>
    <Table.Cell>{stuff.name}</Table.Cell>
    <Table.Cell>{stuff.quantity}</Table.Cell>
    <Table.Cell>{stuff.condition}</Table.Cell>
    <Table.Cell>
      <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={`/edit/${stuff._id}`}>Edit</Link>
    </Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
StuffItem.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(StuffItem);
