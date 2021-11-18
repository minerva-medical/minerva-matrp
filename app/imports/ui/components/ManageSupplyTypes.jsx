import React, { useState } from 'react';
import { Header, Input, Button, List, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { SupplyTypes } from '../../api/supplyType/SupplyTypeCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';

/**
 * inserts the supply type option
 */
const insertOption = (option, supplyTypes, callback) => {
  const existing = _.pluck(supplyTypes, 'supplyType').map(supplyType => supplyType.toLowerCase());
  // validation:
  if (!option) {
    // if option is empty
    swal('Error', 'Supply Type cannot be empty.', 'error');
  } else if (existing.includes(option.toLowerCase())) {
    // if option exists
    swal('Error', `${option} already exists!`, 'error');
  } else {
    // else add option
    const collectionName = SupplyTypes.getCollectionName();
    const definitionData = { supplyType: option };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${option} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/**
 * deletes the supply type option
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
        const inUse = Medications.findOne({ supplyType: option });
        const collectionName = SupplyTypes.getCollectionName();
        // if an existing medication uses the supply type
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

const ManageSupplyTypes = ({ supplyTypes, ready }) => {
  const [newOption, setNewOption] = useState('');

  const clearField = () => setNewOption('');

  if (ready) {
    return (
      <div id={COMPONENT_IDS.MANAGE_DRUG_TYPES} className='manage-tab'>
        <Header as='h2'>{`Manage Supply Types (${supplyTypes.length})`}</Header>
        <div className='controls'>
          <Input onChange={(event, { value }) => setNewOption(value)} value={newOption}
            placeholder='Add new supply type...' />
          <Button content='Add' onClick={() => insertOption(newOption, supplyTypes, clearField)} />
        </div>
        <List divided relaxed>
          {
            supplyTypes.map(({ supplyType, _id }) => (
              <List.Item key={_id}>
                <List.Icon name='trash alternate' onClick={() => deleteOption(supplyType, _id)} />
                <List.Content>{supplyType}</List.Content>
              </List.Item>
            ))
          }
        </List>
      </div>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

ManageSupplyTypes.propTypes = {
  supplyTypes: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const medicationSub = Medications.subscribeMedication();
  const supplyTypeSub = SupplyTypes.subscribeSupplyType();
  const supplyTypes = SupplyTypes.find({}, { sort: { supplyType: 1 } }).fetch();
  const ready = supplyTypeSub.ready() && medicationSub.ready();
  return {
    supplyTypes,
    ready,
  };
})(ManageSupplyTypes);
