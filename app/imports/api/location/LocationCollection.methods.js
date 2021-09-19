import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Locations } from './LocationCollection';

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const locationDefineMethod = new ValidatedMethod({
  name: 'LocationCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    // console.log('locationDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = Locations.define(definitionData);
      // console.log(`locationDefineMethod returning ${docID}. Now have ${Locations.count()}`);
      return docID;
    }
    return '';
  },
});
