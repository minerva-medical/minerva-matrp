import React, { useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const SupplyStatusRow = ({ supply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  const totalQuantity = supply.stock.length ? _.pluck(supply.stock, 'quantity')
    .reduce((prev, current) => prev + current) : 0;
  const status = Math.floor((totalQuantity / supply.minQuantity) * 100);
  const getColor = () => {
    let color;
    if (totalQuantity >= supply.minQuantity) { // range [min, inf)
      color = 'green';
    } else if (totalQuantity > 0 && totalQuantity < supply.minQuantity) { // range (0, min]
      color = 'yellow';
    } else { // range (0)
      color = 'red';
    }
    return color;
  };

  return (
    <>
      {/* the supply row */}
      <Table.Row onClick={handleOpen} id={COMPONENT_IDS.SUPPLY_STATUS_ROW}>
        <Table.Cell>
          <Icon name={`caret ${isOpen ? 'down' : 'up'}`} />
        </Table.Cell>
        <Table.Cell>{supply.supply}</Table.Cell>
        <Table.Cell>{supply.supplyType}</Table.Cell>
        <Table.Cell>{totalQuantity}</Table.Cell>
        <Table.Cell>
          <>
            <Icon color={getColor()} name='circle' />
            <span>{status}%</span>
          </>
        </Table.Cell>
      </Table.Row>

      {/* the stock row */}
      <Table.Row style={{ display: isOpen ? 'table-row' : 'none' }}>
        <Table.Cell colSpan={5} className='lot-row'>
          <Table color='blue' unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Location</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Donated</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                supply.stock.map(({ location, quantity, donated }, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{location}</Table.Cell>
                    <Table.Cell>{quantity}</Table.Cell>
                    <Table.Cell>
                      {
                        donated &&
                        <Icon name='check' color='green'/>
                      }
                    </Table.Cell>
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

SupplyStatusRow.propTypes = {
  supply: PropTypes.shape({
    supply: PropTypes.string,
    supplyType: PropTypes.string,
    stock: PropTypes.array,
    minQuantity: PropTypes.number,
  }).isRequired,
};

export default SupplyStatusRow;
