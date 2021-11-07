import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const dispenseTypes = ['Patient Use', 'Broken', 'Lost', 'Contaminated', 'Expired', 'Inventory'];
export const historicalPublications = {
  historical: 'Historical;',
  historicalAdmin: 'HistoricalAdmin',
};

class HistoricalCollection extends BaseCollection {
  constructor() {
    super('Historicals', new SimpleSchema({
      drug: String,
      brand: String,
      lotId: String,
      expire: {
        type: String,
        optional: true,
      }, // date string "YYYY-MM-DD"
      quantity: Number,
      isTabs: Boolean,
      dateDispensed: Date,
      dispensedFrom: String,
      dispensedTo: String,
      dispenseType: {
        type: String,
        allowedValues: dispenseTypes,
      },
      site: String,
      note: {
        type: String,
        optional: true,
      },
    }));
  }

  /**
   * Defines a new Dispensed item.
   * @param name the name of the item.
   * @param quantity how many.
   * @param owner the owner of the item.
   * @return {String} the docID of the new document.
   */
  define({ drug, brand, lotId, expire, quantity, isTabs, dateDispensed, dispensedFrom, dispensedTo, dispenseType, site, note }) {
    const docID = this._collection.insert({
      drug, brand, lotId, expire, quantity, isTabs, dateDispensed, dispensedFrom, dispensedTo, dispenseType, site, note,
    });
    return docID;
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(lotId) {
    const doc = this.findDoc(lotId);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the historical associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the HistoricalCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(historicalPublications.historical, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(historicalPublications.historicalAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for medication owned by the current user.
   */
  subscribeHistorical() {
    if (Meteor.isClient) {
      return Meteor.subscribe(historicalPublications.historical);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeHistoricalAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(historicalPublications.historicalAdmin);
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
export const Historicals = new HistoricalCollection();
