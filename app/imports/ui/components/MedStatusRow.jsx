import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import DrugPage from '../components/DrugPage';

const calculateStatus = (quantity, min) => {
  const status = {};
  let color = '';
  const percent = Math.floor((quantity / min) * 100);
  if (percent > 30) {
    color = 'green';
  } else if (percent > 5 && percent <= 30) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  status.color = color;
  status.percent = percent;
  return status;
};

const MedStatusRow = ({ med }) => {
  const { color, percent } = calculateStatus(med.quantity, med.minQuantity);

  return (
    <Table.Row>
      <Table.Cell>{med.drug}</Table.Cell>
      <Table.Cell>{med.drugType.join(', ')}</Table.Cell>
      <Table.Cell>{med.brand}</Table.Cell>
      <Table.Cell>{med.lotId}</Table.Cell>
      <Table.Cell>{med.quantity}{med.isTabs ? 'tabs' : 'mL'}</Table.Cell>
      <Table.Cell>{med.location}</Table.Cell>
      <Table.Cell>{med.expire}</Table.Cell>
      <Table.Cell>
        {
          med.purchased ?
            <Icon name='check' color='green'/>
            :
            <Icon name='x' color='red'/>
        }
      </Table.Cell>
      <Table.Cell>
        <Icon color={color} name='circle' fitted> {percent}%</Icon>
      </Table.Cell>
      <Table.Cell><DrugPage drug={med}/></Table.Cell>
    </Table.Row>
  );
};

MedStatusRow.propTypes = {
  med: PropTypes.shape({
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

export default MedStatusRow;
