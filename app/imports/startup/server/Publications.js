import { Meteor } from 'meteor/meteor';
import { MATRP } from '../../api/matrp/MATRP';

// Call publish for all the collections.
MATRP.collections.forEach(c => c.publish());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
