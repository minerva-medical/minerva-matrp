import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Sites } from './SiteCollection';

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const siteDefineMethod = new ValidatedMethod({
  name: 'SiteCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    // console.log('siteDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = Sites.define(definitionData);
      // console.log(`siteDefineMethod returning ${docID}. Now have ${Sites.count()}`);
      return docID;
    }
    return '';
  },
});
