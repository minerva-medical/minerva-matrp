import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const vaccinationPublications = {
  vaccination: 'vaccination',
  vaccinationAdmin: 'vaccinationAdmin',
};

class VaccinationCollection extends BaseCollection {
  constructor() {
    super('Vaccinations', new SimpleSchema({
      vaccine: String,
      // is vaccineType needed?
      brand: String, // the manufacturer (e.g. Pfizer)
      minQuantity: Number,
      visDate: String, // the latest vaccine information statement date
      lotIds: Array,
      'lotIds.$': Object,
      'lotIds.$.lotId': String,
      'lotIds.$.expire': { // date string "YYYY-MM-DD"
        type: String,
        optional: true,
      },
      'lotIds.$.location': String,
      'lotIds.$.quantity': Number, // the number of doses
      'lotIds.$.note': {
        type: String,
        optional: true,
      },
    }));
  }

  /**
   * Defines a new Vaccination item.
   * @return {String} the docID of the new document.
   */
  define({ vaccine, brand, minQuantity, visDate, lotIds }) {
    const docID = this._collection.insert({
      vaccine, brand, minQuantity, visDate, lotIds,
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

    addString('vaccine');
    addString('brand');
    addNumber('minQuantity');
    addString('visDate');
    if (data.lotIds && data.lotIds.every(lotId => (
      _.isObject(lotId) &&
      lotId.lotId &&
      _.isNumber(lotId.quantity) &&
      lotId.location
    ))) {
      updateData.lotIds = data.lotIds;
    }

    this._collection.update(docID, { $set: updateData });
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
   * It publishes the entire collection for admin and to users.
   */
  publish() {
    if (Meteor.isServer) {
      // get the VaccinationCollection instance.
      const instance = this;
      Meteor.publish(vaccinationPublications.vaccination, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
        }
        return this.ready();
      });

      Meteor.publish(vaccinationPublications.vaccinationAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription Vaccination method for users.
   */
  subscribeVaccination() {
    if (Meteor.isClient) {
      return Meteor.subscribe(vaccinationPublications.vaccination);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeVaccinationAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(vaccinationPublications.vaccinationAdmin);
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
export const Vaccinations = new VaccinationCollection();
