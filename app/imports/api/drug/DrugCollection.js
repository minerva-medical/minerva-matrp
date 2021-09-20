import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
// import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const drugPublications = {
  drug: 'Drug',
  drugAdmin: 'DrugAdmin',
};

class DrugCollection extends BaseCollection {
  constructor() {
    super('Drugs', new SimpleSchema({
      drug: String,
    }));
  }

  /**
   * Defines a new Drug item.
   * @param name the name of the item.
   * @return {String} the docID of the new document.
   */
  define({ drug }) {
    const docID = this._collection.insert({
      drug,
    });
    return docID;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the drug associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the DrugCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(drugPublications.drug, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(drugPublications.drugAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for drug owned by the current user.
   */
  subscribeDrug() {
    if (Meteor.isClient) {
      return Meteor.subscribe(drugPublications.drug);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeDrugAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(drugPublications.drugAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Drugs = new DrugCollection();
