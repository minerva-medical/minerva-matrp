import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class DispenseLogPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DISPENSE_LOG}`;
    this.pageSelector = Selector(this.pageId);
    this.invenType = Selector(`#${COMPONENT_IDS.INVENTORY_TYPE}`);
    this.invenTypeOption = this.invenType.find('span');
    this.dispenseType = Selector(`#${COMPONENT_IDS.DISPENSE_TYPE}`);
    this.dispenseTypeOption = this.dispenseType.find('span');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    // From https://testcafe.io/documentation/402803/recipes/best-practices/create-helpers
    // Note that this file imports t (the test controller) from the testcafe module. You don’t need to pass t to helper functions because TestCafe can resolve the current test context and provide the correct test controller instance.
    const waitTime = 15;
    console.log(`Waiting ${waitTime} seconds before running addInventoryPage.isDisplayed().`);
    await t.wait(waitTime * 500).expect(this.pageSelector.exists).ok();
  }

  async openModal() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_INFO_BUTTON}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.DISPENSE_INFO_CLOSE}`);
    await t.wait(3000);
  }

  async testFilter() {
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_FILTER}`, '71239');
    await t.wait(3000);
  }

  async testDropDowns() {
    await t.click(this.invenType).click(this.invenTypeOption.withText('Vaccine'));
    await t.wait(2000);
    await t.click(this.invenType).click(this.invenTypeOption.withText('All'));
    await t.wait(2000);
    await t.click(this.dispenseType).click(this.dispenseTypeOption.withText('Contaminated'));
    await t.wait(2000);
    await t.click(this.dispenseType).click(this.dispenseTypeOption.withText('All'));
    await t.wait(2000);
  }

}

export const dispenseLogPage = new DispenseLogPage();
