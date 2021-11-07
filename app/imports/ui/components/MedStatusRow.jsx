import React, { useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import DrugPage from '../components/DrugPage';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const MedStatusRow = ({ med }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  const totalQuantity = med.lotIds.length ? _.pluck(med.lotIds, 'quantity').reduce((prev, current) => prev + current) : 0;
  const status = Math.floor((totalQuantity / med.minQuantity) * 100);
  const getColor = () => {
    let color;
    if (totalQuantity > med.minQuantity) { // range (total, min)
      color = 'green';
    } else if (totalQuantity > 0 && totalQuantity < med.minQuantity) { // range (0, min]
      color = 'yellow';
    } else { // range (0)
      color = 'red';
    }
    return color;
  };

  const currentDate = new Date();
  const expirations = med.lotIds.map(({ expire }) => expire.split('-'));
  const expiredDates = expirations.map((expiration) => {
    const expiredDate = new Date();
    return expiredDate.setFullYear(parseInt(expiration[0], 10), parseInt(expiration[1], 10) - 1, parseInt(expiration[2], 10));
  });
  const isExpired = expiredDates.map((expiredDate) => expiredDate < currentDate);

  return (
    <>
      {/* the drug row */}
      <Table.Row onClick={handleOpen} negative={isExpired.includes(true)} id={COMPONENT_IDS.MED_STATUS_ROW}>
        <Table.Cell>
          <Icon name={`caret ${isOpen ? 'down' : 'up'}`} />
        </Table.Cell>
        <Table.Cell>{med.drug}</Table.Cell>
        <Table.Cell>{med.drugType.join(', ')}</Table.Cell>
        <Table.Cell>{totalQuantity}</Table.Cell>
        <Table.Cell>{med.isTabs ? 'tabs' : 'mL'}</Table.Cell>
        <Table.Cell>
          <>
            <Icon color={getColor()} name='circle' />
            <span>{status}%</span>
          </>
        </Table.Cell>
      </Table.Row>

      {/* the lotId row */}
      <Table.Row style={{ display: isOpen ? 'table-row' : 'none' }}>
        <Table.Cell colSpan={6} className='lot-row'>
          <Table color='blue' unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Lot Number</Table.HeaderCell>
                <Table.HeaderCell>Brand</Table.HeaderCell>
                <Table.HeaderCell>Expiration</Table.HeaderCell>
                <Table.HeaderCell>Location</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Donated</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                med.lotIds.map(({ lotId, brand, expire, location, quantity, donated }, index) => (
                  <Table.Row key={lotId} negative={isExpired[index]}>
                    <Table.Cell>{lotId}</Table.Cell>
                    <Table.Cell>{brand}</Table.Cell>
                    <Table.Cell>{expire}</Table.Cell>
                    <Table.Cell>{location}</Table.Cell>
                    <Table.Cell>{quantity}</Table.Cell>
                    <Table.Cell>
                      {
                        donated &&
                        <Icon name='check' color='green'/>
                      }
                    </Table.Cell>
                    <Table.Cell><DrugPage info={med}/></Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    </>
  );
};

MedStatusRow.propTypes = {
  med: PropTypes.shape({
    drug: PropTypes.string,
    drugType: PropTypes.array,
    isTabs: PropTypes.bool,
    lotIds: PropTypes.array,
    minQuantity: PropTypes.number,
  }).isRequired,
};

export default MedStatusRow;
