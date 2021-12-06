import React from 'react';
import { Dropdown, Loader, Label, Menu, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Medications } from '../../api/medication/MedicationCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// Render the form.
const StatusNotification = ({ ready, medications }) => {

  const menuStyle = {
    marginRight: '10px',
  };

  const filter = JSON.parse(JSON.stringify(medications));

  const lowFilter = filter.filter((medication) => {
    const totalQuantity = medication.lotIds.length ?
      _.pluck(medication.lotIds, 'quantity').reduce((prev, current) => prev + current) : 0;
    return (totalQuantity > 0 && totalQuantity < medication.minQuantity);
  });

  const outFilter = filter.filter((medication) => {
    const totalQuantity = medication.lotIds.length ?
      _.pluck(medication.lotIds, 'quantity').reduce((prev, current) => prev + current) : 0;
    return totalQuantity === 0;
  });

  if (ready) {
    return (
      <Menu.Menu style={menuStyle} id={COMPONENT_IDS.STATUS_NOTIFICATION} icon>
        <Menu.Item fitted>
          <Icon name='announcement'/>
          <Dropdown button floating labeled simple pointing="top right">
            <Dropdown.Menu>
              <Dropdown.Header content='NOTIFICATIONS' />
              <Dropdown.Divider />
              <Dropdown.Item>
                <Icon color='yellow' name='warning circle'/>
                {lowFilter.length} Low Stock
              </Dropdown.Item>
              <Dropdown.Item>
                <Icon color='red' name='warning circle'/>
                {outFilter.length} Out of Stock
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Label color='red' floating>
            {lowFilter.length + outFilter.length}
          </Label>
        </Menu.Item>
      </Menu.Menu>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

StatusNotification.propTypes = {
  medications: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  // Determine if the subscription is ready
  const ready = medSub.ready();
  // Get the Medication documents and sort them by name.
  const medications = Medications.find({}, { sort: { drug: 1 } }).fetch();
  return {
    medications,
    ready,
  };
})(StatusNotification);
