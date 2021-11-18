import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const supplyTypes = ['Lab / Testing', 'Patient'];
export const supplyPublications = {
  supply: 'Supply',
  supplyAdmin: 'SupplyAdmin',
};

class SupplyCollection extends BaseCollection {
  constructor() {
    super('Supplys', new SimpleSchema({
      supply: String,
      supplyType: String,
      minQuantity: {
        type: Number,
        optional: true,
      },
      stock: Array,
      'stock.$': Object,
      'stock.$.quantity': Number,
      'stock.$.location': String,
      'stock.$.donated': Boolean,
      'stock.$.note': {
        type: String,
        optional: true,
      },
    }));
  }

  /**
   * Defines a new Supply supply.
   * @return {String} the docID of the new document.
   */
  define({ supply, supplyType, minQuantity, stock }) {
    const docID = this._collection.insert({
      supply, supplyType, minQuantity, stock,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param data the unfiltered updateData object.
   */
  update(docID, data) {
    const updateData = {};

    function addString(name) {
      if (data[name]) { // if not undefined or empty String
        updateData[name] = data[name];
      }
    }
    function addNumber(name) { // if not undefined
      if (_.isNumber(data[name])) {
        updateData[name] = data[name];
      }
    }

    addString('supply');
    addString('supplyType');
    addNumber('minQuantity');
    if (data.stock && data.stock.every(elem => (
      _.isObject(elem) &&
      _.isNumber(elem.quantity) &&
      elem.location &&
      _.isBoolean(elem.donated)
    ))) {
      updateData.stock = data.stock;
    }

    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and to users.
   */
  publish() {
    if (Meteor.isServer) {
      // get the SupplyCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(supplyPublications.supply, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      Meteor.publish(supplyPublications.supplyAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for users.
   */
  subscribeSupply() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplyPublications.supply);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeSupplyAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplyPublications.supplyAdmin);
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
export const Supplys = new SupplyCollection();
