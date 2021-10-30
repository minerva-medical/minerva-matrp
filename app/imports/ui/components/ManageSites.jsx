import React, { useState } from 'react';
import { Header, Input, Button, List, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Sites } from '../../api/site/SiteCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';

/**
 * inserts the site option
 */
const insertOption = (option, sites, callback) => {
  const existing = _.pluck(sites, 'site').map(site => site.toLowerCase());
  // validation:
  if (!option) {
    // if option is empty
    swal('Error', 'Site cannot be empty.', 'error');
  } else if (existing.includes(option.toLowerCase())) {
    // if option exists
    swal('Error', `${option} already exists!`, 'error');
  } else {
    // else add option
    const collectionName = Sites.getCollectionName();
    const definitionData = { site: option };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${option} added successfully`, 'success', { buttons: false, timer: 3000 });
        callback(); // resets the form
      });
  }
};

/**
 * deletes the site option
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
        const collectionName = Sites.getCollectionName();
        removeItMethod.callPromise({ collectionName, instance: id })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => {
            swal('Success', `${option} deleted successfully`, 'success', { buttons: false, timer: 3000 });
          });
      }
    });
};

const ManageSites = ({ sites, ready }) => {
  const [newOption, setNewOption] = useState('');

  const clearField = () => setNewOption('');

  if (ready) {
    return (
      <div id={COMPONENT_IDS.MANAGE_SITES} className='manage-tab'>
        <Header as='h2'>{`Manage Sites (${sites.length})`}</Header>
        <div className='controls'>
          <Input onChange={(event, { value }) => setNewOption(value)} value={newOption}
            placeholder='Add new site...' />
          <Button content='Add' onClick={() => insertOption(newOption, sites, clearField)} />
        </div>
        <List divided relaxed>
          {
            sites.map(({ site, _id }) => (
              <List.Item key={_id}>
                <List.Icon name='trash alternate' onClick={() => deleteOption(site, _id)} />
                <List.Content>{site}</List.Content>
              </List.Item>
            ))
          }
        </List>
      </div>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

ManageSites.propTypes = {
  sites: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const siteSub = Sites.subscribeSite();
  const sites = Sites.find({}, { sort: { site: 1 } }).fetch();
  const ready = siteSub.ready();
  return {
    sites,
    ready,
  };
})(ManageSites);
