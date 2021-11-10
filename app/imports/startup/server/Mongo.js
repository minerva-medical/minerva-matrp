import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Locations } from '../../api/location/LocationCollection';
import { Sites } from '../../api/site/SiteCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
import { Supplys } from '../../api/supply/SupplyCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

const assetsFileName = 'data.json';
const jsonData = JSON.parse(Assets.getText(assetsFileName));
const sampleMedication = JSON.parse(Assets.getText('sample_medication.json'));
const sampleSupply = JSON.parse(Assets.getText('sample_supply.json'));

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

if (Meteor.settings.loadAssetsFile && Medications.count() === 0) {
  // Medications._collection.remove({}); // clear collection (temporary)
  console.log('Loading medications from private/sample_medication.json');
  // jsonData.medications.map(medication => Medications.define(medication));
  sampleMedication.map(medication => Medications.define(medication));
}

if (Meteor.settings.loadAssetsFile && DrugTypes.count() === 0) {
  // DrugTypes._collection.remove({}); // clear collection (temporary)
  console.log(`Loading drugTypes from private/${assetsFileName}`);
  jsonData.drugTypes.map(drugType => DrugTypes.define(drugType));
}

if (Meteor.settings.loadAssetsFile && Locations.count() === 0) {
  // Locations._collection.remove({}); // clear collection (temporary)
  console.log(`Loading locations from private/${assetsFileName}`);
  jsonData.locations.map(location => Locations.define(location));
}

if (Meteor.settings.loadAssetsFile && Sites.count() === 0) {
  // Sites._collection.remove({}); // clear collection (temporary)
  console.log(`Loading sites from private/${assetsFileName}`);
  jsonData.sites.map(site => Sites.define(site));
}

if (Meteor.settings.loadAssetsFile && Historicals.count() === 0) {
  // Historicals._collection.remove({}); // clear collection (temporary)
  console.log(`Loading history from private/${assetsFileName}`);
  jsonData.historicals.map(historical => Historicals.define(historical));
}

if (Meteor.settings.loadAssetsFile && Supplys.count() === 0) {
  console.log('Loading supplies from private/sample_supply.json');
  sampleSupply.map(supply => Supplys.define(supply));
}
