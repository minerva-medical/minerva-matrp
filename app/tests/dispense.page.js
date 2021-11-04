import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class DispensePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DISPENSE}`;
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

  async dispenseMedication() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_ONE}`);
    await t.wait(2000);

  }

  async dispenseVaccine() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_TWO}`);
    await t.wait(2000);
  }

  async dispensePatientSupplies() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_THREE}`);
    await t.wait(3000);
  }

  async dispenseLabTestingSupplies() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_FOUR}`);
    await t.wait(3000);
  }

  async dispenseReports() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_FIVE}`);
    await t.wait(3000);
  }

}

export const dispensePage = new DispensePage();
