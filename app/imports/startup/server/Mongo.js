import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Brands } from '../../api/brand/BrandCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { Locations } from '../../api/location/LocationCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Sites } from '../../api/site/SiteCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

if (Meteor.settings.loadAssetsFile && Brands.count() === 0) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.brands.map(brand => Brands.define(brand));
}

if (Meteor.settings.loadAssetsFile && DrugTypes.count() === 0) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.drugTypes.map(drugType => DrugTypes.define(drugType));
}

if (Meteor.settings.loadAssetsFile && Drugs.count() === 0) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.drugs.map(drug => Drugs.define(drug));
}

if (Meteor.settings.loadAssetsFile && Locations.count() === 0) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.locations.map(location => Locations.define(location));
}

if (Meteor.settings.loadAssetsFile && LotIds.count() === 0) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.lotIds.map(lotId => LotIds.define(lotId));
}

if (Meteor.settings.loadAssetsFile && Sites.count() === 0) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.sites.map(site => Sites.define(site));
}
