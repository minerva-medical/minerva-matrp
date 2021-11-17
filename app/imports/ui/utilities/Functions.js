import { _ } from 'meteor/underscore';

/**
 * Finds the distinct values for a specified field across one or two collections and returns the results in an array.
 * @param field
 * @param collection1
 * @param collection2 (optional)
 */
// export function distinct(field, collection1, collection2) {
//   const array1 = _.pluck(
//     collection1.find({}, { sort: { [field]: 1 }, fields: { [field]: 1 } }).fetch(),
//     field,
//   );
//   const array2 = collection2 ?
//     _.pluck(
//       collection2.find({}, { sort: { [field]: 1 } }).fetch(),
//       field,
//     ) : [];
//
//   return _.uniq(
//     field === 'drugType' ? array1.concat(array2).flat().sort() : array1.concat(array2).sort(),
//     true,
//   );
// }

export function distinct(field, collection, selector = {}) {
  const fields = _.pluck(
    collection.find(selector, { sort: { [field]: 1 }, fields: { [field]: 1 } }).fetch(),
    field,
  );

  return _.uniq(
    field === 'drugType' ? fields.flat() : fields,
    true,
  );
}

export function nestedDistinct(field, collection, selector = {}) {
  const fields = _.pluck(
    _.pluck(collection.find(selector, { fields: { [`lotIds.${field}`]: 1 } }).fetch(), 'lotIds').flat(),
    field,
  ).sort();

  return _.uniq(fields, true);
}

/** convert array to dropdown options */
export function getOptions(arr) {
  return arr.map(name => ({ key: name, text: name, value: name }));
}

export const dispenseTypes = [
  { key: 0, text: 'Patient Use', value: 'Patient Use' },
  { key: 1, text: 'Broken', value: 'Broken' },
  { key: 2, text: 'Lost', value: 'Lost' },
  { key: 3, text: 'Contaminated', value: 'Contaminated' },
  { key: 4, text: 'Expired', value: 'Expired' },
  { key: 5, text: 'Inventory', value: 'Inventory' }, // what is inventory?
];

