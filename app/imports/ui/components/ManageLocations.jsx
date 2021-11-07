import React, { useState } from 'react';
import { Header, Input, Button, List, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Locations } from '../../api/location/LocationCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';

/**
 * inserts the location option
 */
const insertOption = (option, locations, callback) => {
  const existing = _.pluck(locations, 'location').map(location => location.toLowerCase());
  // validation:
  if (!option) {
    // if option is empty
    swal('Error', 'Location cannot be empty.', 'error');
  } else if (existing.includes(option.toLowerCase())) {
    // if option exists
    swal('Error', `${option} already exists!`, 'error');
  } else {
    // else add option
    const collectionName = Locations.getCollectionName();
    const definitionData = { location: option };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${option} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/**
 * deletes the location option
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
        const inUse = Medications.findOne({ lotIds: { $elemMatch: { location: option } } });
        const collectionName = Locations.getCollectionName();
        // if an existing medication uses the location
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

const ManageLocations = ({ locations, ready }) => {
  const [newOption, setNewOption] = useState('');

  const clearField = () => setNewOption('');

  if (ready) {
    return (
      <div id={COMPONENT_IDS.MANAGE_LOCATIONS} className='manage-tab'>
        <Header as='h2'>{`Manage Locations (${locations.length})`}</Header>
        <div className='controls'>
          <Input onChange={(event, { value }) => setNewOption(value)} value={newOption}
            placeholder='Add new location...' />
          <Button content='Add' onClick={() => insertOption(newOption, locations, clearField)} />
        </div>
        <List divided relaxed>
          {
            locations.map(({ location, _id }) => (
              <List.Item key={_id}>
                <List.Icon name='trash alternate' onClick={() => deleteOption(location, _id)} />
                <List.Content>{location}</List.Content>
              </List.Item>
            ))
          }
        </List>
      </div>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

ManageLocations.propTypes = {
  locations: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const medicationSub = Medications.subscribeMedication();
  const locationSub = Locations.subscribeLocation();
  const locations = Locations.find({}, { sort: { location: 1 } }).fetch();
  const ready = locationSub.ready() && medicationSub.ready();
  return {
    locations,
    ready,
  };
})(ManageLocations);
