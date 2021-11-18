import React, { useState } from 'react';
import { Header, Input, Button, List, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Supplys } from '../../api/supply/SupplyCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';

/**
 * inserts the supply option
 */
const insertOption = (option, supply, callback) => {
  const existing = _.pluck(supply, 'supply').map(supply => supply.toLowerCase());
  // validation:
  if (!option) {
    // if option is empty
    swal('Error', 'Supply  cannot be empty.', 'error');
  } else if (existing.includes(option.toLowerCase())) {
    // if option exists
    swal('Error', `${option} already exists!`, 'error');
  } else {
    // else add option
    const collectionName = Supplys.getCollectionName();
    const definitionData = { supply: option };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${option} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/**
 * deletes the supply  option
 */
const deleteOption = (option, id) => {
  swal({
    title: 'Are you sure?',
    text: `Do you really want to delete ${option}?`,
    icon: 'warning',
    buttons: [
      'No, cancel it!',
      'Yes, I am sure!',
    ],
    dangerMode: true,
  })
    .then((isConfirm) => {
      // if 'yes'
      if (isConfirm) {
        const inUse = Medications.findOne({ supply: option });
        const collectionName = Supplys.getCollectionName();
        // if an existing medication uses the supply
        if (inUse) {
          swal('Error', `${option} is in use.`, 'error');
        } else {
          removeItMethod.callPromise({ collectionName, instance: id })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => {
              swal('Success', `${option} deleted successfully`, 'success', { buttons: false, timer: 3000 });
            });
        }
      }
    });
};

const ManageSupplys = ({ supplys, ready }) => {
  const [newOption, setNewOption] = useState('');

  const clearField = () => setNewOption('');

  if (ready) {
    return (
      <div id={COMPONENT_IDS.MANAGE_SUPPLYS} className='manage-tab'>
        <Header as='h2'>{`Manage Supplys (${supplys.length})`}</Header>
        <div className='controls'>
          <Input onChange={(event, { value }) => setNewOption(value)} value={newOption}
            placeholder='Add new supply ...' />
          <Button content='Add' onClick={() => insertOption(newOption, supplys, clearField)} />
        </div>
        <List divided relaxed>
          {
            supplys.map(({ supply, _id }) => (
              <List.Item key={_id}>
                <List.Icon name='trash alternate' onClick={() => deleteOption(supply, _id)} />
                <List.Content>{supply}</List.Content>
              </List.Item>
            ))
          }
        </List>
      </div>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

ManageSupplys.propTypes = {
  supplys: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const medicationSub = Medications.subscribeMedication();
  const supplySub = Supplys.subscribeSupply();
  const supplys = Supplys.find({}, { sort: { supply: 1 } }).fetch();
  const ready = supplySub.ready() && medicationSub.ready();
  return {
    supplys,
    ready,
  };
})(ManageSupplys);
