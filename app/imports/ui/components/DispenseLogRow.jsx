import React from 'react';
import { Popup, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import DispenseInfoPage from './DispenseInfoPage';

const DispenseLogRow = ({ history }) => (
  <Table.Row>
    <Table.Cell>
      {history.dateDispensed.toLocaleDateString('en-US')} {history.dateDispensed.toLocaleTimeString('en-US')}
    </Table.Cell>
    <Table.Cell>Patient Use</Table.Cell>
    <Table.Cell>{history.dispensedTo}</Table.Cell>
    <Table.Cell>{history.drug}</Table.Cell>
    <Table.Cell>{history.lotId}</Table.Cell>
    <Table.Cell>{history.quantity} {history.isTabs ? 'tabs' : 'mL'}</Table.Cell>
    <Table.Cell>{history.dispensedFrom}</Table.Cell>
    <Table.Cell textAlign='center'><DispenseInfoPage record={history}/></Table.Cell>
  </Table.Row>
);

DispenseLogRow.propTypes = {
  history: PropTypes.shape({
    dateDispensed: PropTypes.date,
    dispensedTo: PropTypes.string,
    drug: PropTypes.string,
    brand: PropTypes.string,
    lotId: PropTypes.string,
    dispensedFrom: PropTypes.string,
    quantity: PropTypes.number,
    isTabs: PropTypes.bool,
    note: PropTypes.string,
    expire: PropTypes.string,
    site: PropTypes.string,
  }).isRequired,
};

export default DispenseLogRow;
