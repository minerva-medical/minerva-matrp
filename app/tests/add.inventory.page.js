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

  async addMedication() {
    await t.click(`#${COMPONENT_IDS.ADD_MEDICATION}`);
  }

  async addVaccine() {
    await t.click(`#${COMPONENT_IDS.ADD_VACCINATION}`);
  }

  async addPatientSupplies() {
    await t.click(`#${COMPONENT_IDS.ADD_PATIENT_SUPPLIES}`);
  }

  async labTestingSupplies() {
    await t.click(`#${COMPONENT_IDS.ADD_LAB_SUPPLIES}`);
  }

  async goToRegister() {
    await t.click(`#${COMPONENT_IDS.LANDING_TO_REGISTER}`);
  }

}

export const addInventoryPage = new AddInventoryPage();
