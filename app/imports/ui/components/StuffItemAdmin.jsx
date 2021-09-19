import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx. */
const StuffItemAdmin = ({ stuff }) => (
  <Table.Row>
    <Table.Cell>{stuff.name}</Table.Cell>
    <Table.Cell>{stuff.quantity}</Table.Cell>
    <Table.Cell>{stuff.condition}</Table.Cell>
    <Table.Cell>{stuff.owner}</Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
StuffItemAdmin.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
    owner: PropTypes.string,
  }).isRequired,
};

export default StuffItemAdmin;
