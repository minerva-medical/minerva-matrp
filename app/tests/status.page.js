import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class StatusPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.MED_STATUS}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    // From https://testcafe.io/documentation/402803/recipes/best-practices/create-helpers
    // Note that this file imports t (the test controller) from the testcafe module. You don’t need to pass t to helper functions because TestCafe can resolve the current test context and provide the correct test controller instance.
    const waitTime = 15;
    console.log(`Waiting ${waitTime} seconds before running statusPage.isDisplayed().`);
    await t.wait(waitTime * 1000).expect(this.pageSelector.exists).ok();
  }

  async openModal() {
    await t.click(`#${COMPONENT_IDS.DRUG_PAGE_BUTTON}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.DRUG_CLOSE}`);
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

export const statusPage = new StatusPage();
