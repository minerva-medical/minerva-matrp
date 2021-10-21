import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Medications } from '../../api/medication/MedicationCollection';
import { Brands } from '../../api/brand/BrandCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { Locations } from '../../api/location/LocationCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Sites } from '../../api/site/SiteCollection';
import { Historicals } from '../../api/historical/HistoricalCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

const assetsFileName = 'data.json';
const jsonData = JSON.parse(Assets.getText(assetsFileName));
const sampleMedication = JSON.parse(Assets.getText('sample_medication.json'));

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

if (Meteor.settings.loadAssetsFile && Medications.count() !== 201) {
  Medications._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  // jsonData.medications.map(medication => Medications.define(medication));
  sampleMedication.map(medication => Medications.define(medication));
}

if (Meteor.settings.loadAssetsFile) {
  Brands._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  jsonData.brands.map(brand => Brands.define(brand));
}

if (Meteor.settings.loadAssetsFile) {
  DrugTypes._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  jsonData.drugTypes.map(drugType => DrugTypes.define(drugType));
}

if (Meteor.settings.loadAssetsFile) {
  Drugs._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  jsonData.drugs.map(drug => Drugs.define(drug));
}

if (Meteor.settings.loadAssetsFile) {
  Locations._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  jsonData.locations.map(location => Locations.define(location));
}

if (Meteor.settings.loadAssetsFile) {
  LotIds._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  jsonData.lotIds.map(lotId => LotIds.define(lotId));
}

if (Meteor.settings.loadAssetsFile) {
  Sites._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  jsonData.sites.map(site => Sites.define(site));
}

if (Meteor.settings.loadAssetsFile) {
  Historicals._collection.remove({}); // clear collection (temporary)
  console.log(`Loading data from private/${assetsFileName}`);
  jsonData.historicals.map(historical => Historicals.define(historical));
}
