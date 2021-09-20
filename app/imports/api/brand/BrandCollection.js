import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
// import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const brandPublications = {
  brand: 'Brand',
  brandAdmin: 'BrandAdmin',
};

class BrandCollection extends BaseCollection {
  constructor() {
    super('Brands', new SimpleSchema({
      brand: String,
    }));
  }

  /**
   * Defines a new Brand item.
   * @param name the name of the item.
   * @return {String} the docID of the new document.
   */
  define({ brand }) {
    const docID = this._collection.insert({
      brand,
    });
    return docID;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the brand associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the BrandCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(brandPublications.brand, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(brandPublications.brandAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for brand owned by the current user.
   */
  subscribeBrand() {
    if (Meteor.isClient) {
      return Meteor.subscribe(brandPublications.brand);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeBrandAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(brandPublications.brandAdmin);
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
export const Brands = new BrandCollection();
