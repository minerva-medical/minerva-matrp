import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { LotIds } from './LotIdCollection';

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const lotIdDefineMethod = new ValidatedMethod({
  name: 'LotIdCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    // console.log('lotIdDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = LotIds.define(definitionData);
      // console.log(`lotIdDefineMethod returning ${docID}. Now have ${LotIds.count()}`);
      return docID;
    }
    return '';
  },
});

export const lotIdRemoveItMethod = new ValidatedMethod({
  name: 'LotIdCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run(instance) {
    return LotIds.removeIt(instance);
  },
});
