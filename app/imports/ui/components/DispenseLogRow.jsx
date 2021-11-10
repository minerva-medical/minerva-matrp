import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import DispenseInfoPage from './DispenseInfoPage';

const DispenseLogRow = ({ history }) => (
  <Table.Row>
    <Table.Cell>
      <i>{history.dateDispensed}</i>
    </Table.Cell>
    <Table.Cell>{history.dispenseType}</Table.Cell>
    <Table.Cell>{history.dispensedTo}</Table.Cell>
    <Table.Cell>{history.drug}</Table.Cell>
    <Table.Cell>{history.brand}</Table.Cell>
    <Table.Cell>{history.lotId}</Table.Cell>
    <Table.Cell>{history.quantity} {history.unit}</Table.Cell>
    <Table.Cell>{history.dispensedFrom}</Table.Cell>
    <Table.Cell textAlign='center'><DispenseInfoPage record={history}/></Table.Cell>
  </Table.Row>
);

DispenseLogRow.propTypes = {
  history: PropTypes.shape({
    drug: PropTypes.string,
    dateDispensed: PropTypes.date,
    dispensedTo: PropTypes.string,
    dispenseType: PropTypes.string,
    brand: PropTypes.string,
    lotId: PropTypes.string,
    dispensedFrom: PropTypes.string,
    quantity: PropTypes.number,
    unit: PropTypes.string,
  }).isRequired,
};

export default DispenseLogRow;
