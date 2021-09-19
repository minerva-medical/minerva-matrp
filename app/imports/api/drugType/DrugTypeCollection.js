import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
// import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';

export const drugTypePublications = {
  drugType: 'DrugType',
  drugTypeAdmin: 'DrugTypeAdmin',
};

class DrugTypeCollection extends BaseCollection {
  constructor() {
    super('DrugTypes', new SimpleSchema({
      drugType: String,
    }));
  }

  /**
   * Defines a new DrugType item.
   * @param name the name of the item.
   * @return {String} the docID of the new document.
   */
  define({ drugType }) {
    const docID = this._collection.insert({
      drugType,
    });
    return docID;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the drugType associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the DrugTypeCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(drugTypePublications.drugType, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(drugTypePublications.drugTypeAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for drugType owned by the current user.
   */
  subscribeDrugType() {
    if (Meteor.isClient) {
      return Meteor.subscribe(drugTypePublications.drugType);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeDrugTypeAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(drugTypePublications.drugTypeAdmin);
    }
    return null;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const DrugTypes = new DrugTypeCollection();
