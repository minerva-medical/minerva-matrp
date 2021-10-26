import React, { useState } from 'react';
import { Header, Input, Button, List, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';

const insertOption = (option, callback) => {
  // TODO: check for duplicates
  // validate option
  if (!option) {
    swal('Error', 'Drug Type cannot be empty.', 'error');
  } else {
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

const deleteOption = (option, id) => {
  // TODO: add confirm
  const collectionName = DrugTypes.getCollectionName();
  removeItMethod.callPromise({ collectionName, instance: id })
    .catch(error => swal('Error', error.message, 'error'))
    .then(() => {
      swal('Success', `${option} deleted successfully`, 'success', { buttons: false, timer: 3000 });
    });
};

const ManageDrugTypes = ({ drugTypes, ready }) => {
  const [newOption, setNewOption] = useState('');

  const clearField = () => setNewOption('');

  if (ready) {
    return (
      <div id={COMPONENT_IDS.MANAGE_DRUG_TYPES}>
        <Header as='h2'>Manage Drug Types</Header>
        <div>
          <Input onChange={(event, { value }) => setNewOption(value)} value={newOption}
            placeholder='Add new drug type...' />
          <Button content='Add' onClick={() => insertOption(newOption, clearField)} />
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
  const drugTypeSub = DrugTypes.subscribeDrugType();
  const drugTypes = DrugTypes.find({}, { sort: { drugType: 1 } }).fetch();
  const ready = drugTypeSub.ready();
  return {
    drugTypes,
    ready,
  };
})(ManageDrugTypes);
