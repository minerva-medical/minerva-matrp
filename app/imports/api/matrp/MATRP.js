import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../stuff/StuffCollection';
import { AdminProfiles } from '../user/AdminProfileCollection';
import { UserProfiles } from '../user/UserProfileCollection';
import { DrugTypes } from '../drugType/DrugTypeCollection';
import { Locations } from '../location/LocationCollection';
import { Sites } from '../site/SiteCollection';
import { Medications } from '../medication/MedicationCollection';
import { Vaccinations } from '../vaccination/VaccinationCollection';
import { Historicals } from '../historical/HistoricalCollection';
import { Supplys } from '../supply/SupplyCollection';
import { SupplyTypes } from '../supplyType/SupplyTypeCollection';

class MATRPClass {
  collections;

  collectionLoadSequence;

  collectionAssociation;

  constructor() {
    // list of all the MATRP collections
    this.collections = [
      AdminProfiles,
      Stuffs,
      UserProfiles,
      DrugTypes,
      Locations,
      Sites,
      Medications,
      Vaccinations,
      Historicals,
      Supplys,
      SupplyTypes,
    ];
    /*
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     */
    this.collectionLoadSequence = [
      AdminProfiles,
      UserProfiles,
      Stuffs,
      DrugTypes,
      Locations,
      Sites,
      Medications,
      Vaccinations,
      Historicals,
      Supplys,
      SupplyTypes,
    ];

    /*
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    this.collections.forEach((collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });

  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  getCollection(collectionName) {
    // console.log('MATRP', collectionName, this.collectionAssociation);
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called MARTP.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

export const MATRP = new MATRPClass();
