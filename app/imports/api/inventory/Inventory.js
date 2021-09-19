import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

const Inv = new Mongo.Collection('Inventory');

const InventorySchema = new SimpleSchema({
  item: {
    type: String,
    allowedValues: ['Medication', 'Vaccine', 'Lab/Testing Supplies', 'Patient Supplies'],
    required: true,
    defaultValue: 'none',
  },
  drugName: {
    type: String,
  },
  Brand: {
    type: String,
  },
  lotNumber: {
    type: String,
  },
  quantity: {
    type: String,
  },
  site: {
    type: String,
  },
  puchasedOrDonated: {
    type: String,
    allowedValues: ['Purchased', 'Donated'],
  },
  Donated: {
    type: String,
  },
  Site: {
    type: String,
  },
  addInfo: {
    type: String,
  },

}, { tracker: Tracker });

Inv.attachSchema(InventorySchema);

export { Inv, InventorySchema };
