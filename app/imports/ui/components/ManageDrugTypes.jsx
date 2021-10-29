import React, { useState } from 'react';
import { Header, Input, Button, List, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';

/**
 * inserts the drug type option
 */
const insertOption = (option, drugTypes, callback) => {
  const existing = _.pluck(drugTypes, 'drugType').map(drugType => drugType.toLowerCase());
  // validation:
  if (!option) {
    // if option is empty
    swal('Error', 'Drug Type cannot be empty.', 'error');
  } else if (existing.includes(option.toLowerCase())) {
    // if option exists
    swal('Error', `${option} already exists!`, 'error');
  } else {
    // else add option
    const collectionName = DrugTypes.getCollectionName();
    const definitionData = { drugType: option };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${option} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/**
 * deletes the drug type option
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
        const inUse = Medications.findOne({ drugType: option });
        const collectionName = DrugTypes.getCollectionName();
        // if an existing medication uses the drug type
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

const ManageDrugTypes = ({ drugTypes, ready }) => {
  const [newOption, setNewOption] = useState('');

  const clearField = () => setNewOption('');

  if (ready) {
    return (
      <div id={COMPONENT_IDS.MANAGE_DRUG_TYPES} className='manage-tab'>
        <Header as='h2'>Manage Drug Types</Header>
        <div className='controls'>
          <Input onChange={(event, { value }) => setNewOption(value)} value={newOption}
            placeholder='Add new drug type...' />
          <Button content='Add' onClick={() => insertOption(newOption, drugTypes, clearField)} />
        </div>
        <List divided relaxed>
          {
            drugTypes.map(({ drugType, _id }) => (
              <List.Item key={_id}>
                <List.Icon name='trash alternate' onClick={() => deleteOption(drugType, _id)} />
                <List.Content>{drugType}</List.Content>
              </List.Item>
            ))
          }
        </List>
      </div>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

ManageDrugTypes.propTypes = {
  drugTypes: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const medicationSub = Medications.subscribeMedication();
  const drugTypeSub = DrugTypes.subscribeDrugType();
  const drugTypes = DrugTypes.find({}, { sort: { drugType: 1 } }).fetch();
  const ready = drugTypeSub.ready() && medicationSub.ready();
  return {
    drugTypes,
    ready,
  };
})(ManageDrugTypes);
