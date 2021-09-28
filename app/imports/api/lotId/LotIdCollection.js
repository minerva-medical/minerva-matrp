import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const lotIdPublications = {
  lotId: 'LotId',
  lotIdAdmin: 'LotIdAdmin',
};

class LotIdCollection extends BaseCollection {
  constructor() {
    super('LotIds', new SimpleSchema({
      brand: String,
      lotId: String,
    }));
  }

  /**
   * Defines a new LotId item.
   * @param brand
   * @param lotId
   * @return {String} the docID of the new document.
   */
  define({ brand, lotId }) {
    const docID = this._collection.insert({
      brand,
      lotId,
    });
    return docID;
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt({ brand, lotId }) { // could just be selector depending on how it's called
    const doc = this.findDoc({ brand, lotId });
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the lotId associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the LotIdCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(lotIdPublications.lotId, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(lotIdPublications.lotIdAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for lotId owned by the current user.
   */
  subscribeLotId() {
    if (Meteor.isClient) {
      return Meteor.subscribe(lotIdPublications.lotId);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeLotIdAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(lotIdPublications.lotIdAdmin);
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
export const LotIds = new LotIdCollection();
