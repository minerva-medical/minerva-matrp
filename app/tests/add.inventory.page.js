import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class AddInventoryPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_INVENTORY}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    // From https://testcafe.io/documentation/402803/recipes/best-practices/create-helpers
    // Note that this file imports t (the test controller) from the testcafe module. You don’t need to pass t to helper functions because TestCafe can resolve the current test context and provide the correct test controller instance.
    const waitTime = 15;
    console.log(`Waiting ${waitTime} seconds before running addInventoryPage.isDisplayed().`);
    await t.wait(waitTime * 100).expect(this.pageSelector.exists).ok();
  }

  async addMedication(name, type, lot, brand, exp, min, quantity, location, notes) {
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_DRUG_NAME}`, name);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_DRUG_TYPE}`, type);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_LOT}`, lot);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_BRAND}`, brand);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_MIN_QUANTITY}`, min);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_MIN_QUANTITY}`, quantity);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_LOCATION}`, location);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_NOTES}`, notes);
    await t.click(`#${COMPONENT_IDS.ADD_MEDICATION_CLEAR}`);
    await t.wait(3000);

  }

  async addVaccine() {
    await t.click(`#${COMPONENT_IDS.TABS}`);
    await t.click(`#${COMPONENT_IDS.ADD_VACCINATION}`);
    await t.wait(3000);
  }

  async addPatientSupplies() {
    await t.click(`#${COMPONENT_IDS.ADD_PATIENT_SUPPLIES}`);
    await t.wait(3000);
  }

  async addLabTestingSupplies() {
    await t.click(`#${COMPONENT_IDS.ADD_LAB_SUPPLIES}`);
    await t.wait(3000);
  }

}

export const addInventoryPage = new AddInventoryPage();
