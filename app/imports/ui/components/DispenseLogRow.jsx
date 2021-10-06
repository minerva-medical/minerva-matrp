import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const DispenseLogRow = ({ history }) => (
  <Table.Row>
    <Table.Cell>{history.dateDispensed}</Table.Cell>
    <Table.Cell>Patient Use</Table.Cell>
    <Table.Cell>{history.dispensedTo}</Table.Cell>
    <Table.Cell>{history.drugType.join(', ')}</Table.Cell>
    <Table.Cell>{history.drug}</Table.Cell>
    <Table.Cell>{history.brand}</Table.Cell>
    <Table.Cell>{history.lotId}</Table.Cell>
    <Table.Cell>{history.quantity} {history.isTabs ? 'tabs' : 'mL'}</Table.Cell>
    <Table.Cell>{history.dispensedFrom}</Table.Cell>
    <Table.Cell><Icon name="info circle"/>More Details</Table.Cell>
  </Table.Row>
);

DispenseLogRow.propTypes = {
  history: PropTypes.shape({
    dateDispensed: PropTypes.string,
    dispensedTo: PropTypes.string,
    drugType: PropTypes.array,
    drug: PropTypes.string,
    brand: PropTypes.string,
    lotId: PropTypes.string,
    dispensedFrom: PropTypes.string,
    quantity: PropTypes.number,
    isTabs: PropTypes.bool,
  }).isRequired,
};

export default DispenseLogRow;
