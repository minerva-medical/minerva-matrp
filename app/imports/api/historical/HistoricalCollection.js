import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const historicalPublications = {
  historical: 'Historical;',
  historicalAdmin: 'HistoricalAdmin',
};

class HistoricalCollection extends BaseCollection {
  constructor() {
    super('Historicals', new SimpleSchema({
      dateDispensed: Date,
      dispensedFrom: String,
      dispensedTo: String,
      drug: String,
      drugType: Array,
      'drugType.$': String,
      brand: String,
      lotId: String,
      expire: Date, // date string "YYYY-MM-DD"
      quantity: Number,
      isTabs: Boolean,
      location: String,
      site: String,
      note: String,
    }));
  }

  /**
   * Defines a new Medication item.
   * @param name the name of the item.
   * @param quantity how many.
   * @param owner the owner of the item.
   * @param condition the condition of the item.
   * @return {String} the docID of the new document.
   */
  define({ dateDispensed, drug, drugType, brand, lotId, expire, quantity, isTabs, location, dispensedFrom, dispensedTo, site, note }) {
    const docID = this._collection.insert({
      dateDispensed, drug, drugType, brand, lotId, expire, quantity, isTabs, location, dispensedFrom, dispensedTo, site, note,
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
   * It publishes the entire collection for admin and just the medication associated to an owner.
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
