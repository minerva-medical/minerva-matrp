import { Meteor } from 'meteor/meteor';
import { MATRP } from '../matrp/MATRP';

export const removeAllEntities = () => {
  if (Meteor.isTest || Meteor.isAppTest) {
    MATRP.collections.forEach(collection => {
      collection._collection.remove({});
    });
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
  return true;
};
