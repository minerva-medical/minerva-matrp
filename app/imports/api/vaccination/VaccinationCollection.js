import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const vaccinationPublications = {
  vaccination: 'vaccination',
  vaccinationAdmin: 'vaccinationAdmin',
};

class VaccinationCollection extends BaseCollection {
  constructor() {
    super('Vaccinations', new SimpleSchema({
      drug: String,
      drugType: Array,
      'drugType.$': String,
      brand: String,
      lotId: String,
      expire: {
        type: String,
        optional: true,
      }, // date string "YYYY-MM-DD"
      minQuantity: Number,
      quantity: Number,
      isTabs: Boolean,
      location: String,
      donated: Boolean,
      note: {
        type: String,
        optional: true,
      },
    }));
  }

  /**
   * Defines a new Vaccination item.
   * @return {String} the docID of the new document.
   */
  define({ drug, drugType, brand, lotId, expire, minQuantity, quantity, isTabs, location, donated, note }) {
    const docID = this._collection.insert({
      drug, drugType, brand, lotId, expire, minQuantity, quantity, isTabs, location, donated, note,
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
    function addBoolean(name) { // if not undefined
      if (_.isBoolean(data[name])) {
        updateData[name] = data[name];
      }
    }

    addString('drug');
    // check if drugType is not undefined && every drug type is not undefined
    if (data.drugType && data.drugType.every(elem => elem)) {
      updateData.drugType = data.drugType;
    }
    addString('brand');
    addString('lotId');
    addString('expire');
    addNumber('minQuantity');
    addNumber('quantity');
    addBoolean('isTabs');
    addString('location');
    addBoolean('donated');
    addString('note');

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
   * Subscription method for users.
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