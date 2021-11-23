import React, { useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import moment from 'moment';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const VaccineStatusRow = ({ vaccine }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  const currentDate = moment();
  const isExpired = vaccine.lotIds.map(({ expire }) => {
    if (expire) {
      return currentDate > moment(expire);
    }
    return false;
  });

  const totalQuantity = vaccine.lotIds.length ?
    _.pluck(vaccine.lotIds, 'quantity')
      .reduce((prev, current, index) => (isExpired[index] ? prev : prev + current), 0)
    : 0;
  const status = Math.floor((totalQuantity / vaccine.minQuantity) * 100);
  const getColor = () => {
    let color;
    if (totalQuantity >= vaccine.minQuantity) { // range [min, inf)
      color = 'green';
    } else if (totalQuantity > 0 && totalQuantity < vaccine.minQuantity) { // range (0, min]
      color = 'yellow';
    } else { // range (0)
      color = 'red';
    }
    return color;
  };

  return (
    <>
      {/* the vaccine, brand row */}
      <Table.Row onClick={handleOpen} negative={isExpired.includes(true)} id={COMPONENT_IDS.VACCINE_STATUS_ROW}>
        <Table.Cell>
          <Icon name={`caret ${isOpen ? 'down' : 'up'}`} />
        </Table.Cell>
        <Table.Cell>{vaccine.vaccine}</Table.Cell>
        <Table.Cell>{vaccine.brand}</Table.Cell>
        <Table.Cell>{totalQuantity}</Table.Cell>
        <Table.Cell>{vaccine.visDate}</Table.Cell>
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
                <Table.HeaderCell>Expiration</Table.HeaderCell>
                <Table.HeaderCell>Location</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                vaccine.lotIds.map(({ lotId, expire, location, quantity }, index) => (
                  <Table.Row key={lotId} negative={isExpired[index]}>
                    <Table.Cell>{lotId}</Table.Cell>
                    <Table.Cell>{expire}</Table.Cell>
                    <Table.Cell>{location}</Table.Cell>
                    <Table.Cell>{quantity}</Table.Cell>
                    <Table.Cell><Icon name='info circle' /></Table.Cell>
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

VaccineStatusRow.propTypes = {
  vaccine: PropTypes.shape({
    vaccine: PropTypes.string,
    brand: PropTypes.string,
    visDate: PropTypes.string,
    lotIds: PropTypes.array,
    minQuantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default VaccineStatusRow;
