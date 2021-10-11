import { _ } from 'meteor/underscore';

/**
 * Finds the distinct values for a specified field across a collection and returns the results in an array.
 * @param collection
 * @param field
 */
export function distinct(collection, field) {
  return _.uniq(
    collection.find({}, { sort: { [field]: 1 }, fields: { [field]: 1 } }).fetch()
      .map(x => x[field]),
    true,
  );
}

/**
 * uses flatMap instead of map
 */
export function arrayDistinct(collection, field) {
  return _.uniq(
    collection.find({}, { sort: { [field]: 1 }, fields: { [field]: 1 } }).fetch()
      .flatMap(x => x[field]),
    true,
  );
}

// TODO: better time complexity? sort?
export function merge(array1, array2) {
  return [...new Set([...array1, ...array2])];
}
