import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
// import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';

export const locationPublications = {
  location: 'Location',
  locationAdmin: 'LocationAdmin',
};

class LocationCollection extends BaseCollection {
  constructor() {
    super('Locations', new SimpleSchema({
      location: String,
    }));
  }

  /**
   * Defines a new Location item.
   * @param name the name of the item.
   * @return {String} the docID of the new document.
   */
  define({ location }) {
    const docID = this._collection.insert({
      location,
    });
    return docID;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the location associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the LocationCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(locationPublications.location, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(locationPublications.locationAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for location owned by the current user.
   */
  subscribeLocation() {
    if (Meteor.isClient) {
      return Meteor.subscribe(locationPublications.location);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeLocationAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(locationPublications.locationAdmin);
    }
    return null;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Locations = new LocationCollection();
