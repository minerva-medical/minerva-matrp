import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
// import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const itemPublications = {
  item: 'Item',
  itemAdmin: 'ItemAdmin',
};

class ItemCollection extends BaseCollection {
  constructor() {
    super('Items', new SimpleSchema({
      item: String,
    }));
  }

  /**
   * Defines a new Item item.
   * @param name the name of the item.
   * @return {String} the docID of the new document.
   */
  define({ item }) {
    const docID = this._collection.insert({
      item,
    });
    return docID;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the item associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the DrugCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(itemPublications.item, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(itemPublications.itemAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for item owned by the current user.
   */
  subscribeItem() {
    if (Meteor.isClient) {
      return Meteor.subscribe(itemPublications.item);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeItemAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(itemPublications.itemAdmin);
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
export const Items = new ItemCollection();
