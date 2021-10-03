import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const DispenseLogRow = ({ history }) => {

  return (
    <Table.Row>
      <Table.Cell>{history.drug}</Table.Cell>
      <Table.Cell>{history.drugType.join(', ')}</Table.Cell>
      <Table.Cell>{history.brand}</Table.Cell>
      <Table.Cell>{history.lotId}</Table.Cell>
      <Table.Cell>{history.quantity}{history.isTabs ? 'tabs' : 'mL'}</Table.Cell>
      <Table.Cell>{history.location}</Table.Cell>
      <Table.Cell>{history.expire}</Table.Cell>
      <Table.Cell>
        {
          history.purchased ?
            <Icon name='check' color='green'/>
            :
            <Icon name='x' color='red'/>
        }
      </Table.Cell>
      <Table.Cell>
        <Icon color={color} name='circle' fitted> {percent}%</Icon>
      </Table.Cell>
    </Table.Row>
  );
};

DispenseLogRow.propTypes = {
  history: PropTypes.shape({
    brand: PropTypes.string,
    drug: PropTypes.string,
    drugType: PropTypes.array,
    expire: PropTypes.string,
    isTabs: PropTypes.bool,
    location: PropTypes.string,
    lotId: PropTypes.string,
    minQuantity: PropTypes.number,
    purchased: PropTypes.bool,
    quantity: PropTypes.number,
  }).isRequired,
};

export default DispenseLogRow;
