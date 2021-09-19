import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { DrugTypes } from './DrugTypeCollection';

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const drugTypeDefineMethod = new ValidatedMethod({
  name: 'DrugTypeCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    // console.log('drugDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = DrugTypes.define(definitionData);
      // console.log(`drugDefineMethod returning ${docID}. Now have ${Drugs.count()}`);
      return docID;
    }
    return '';
  },
});
