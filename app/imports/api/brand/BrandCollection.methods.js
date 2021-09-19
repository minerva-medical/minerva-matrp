import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Brands } from './BrandCollection';

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const brandDefineMethod = new ValidatedMethod({
  name: 'BrandCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    // console.log('brandDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = Brands.define(definitionData);
      // console.log(`brandDefineMethod returning ${docID}. Now have ${Brands.count()}`);
      return docID;
    }
    return '';
  },
});
