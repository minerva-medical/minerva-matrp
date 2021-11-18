import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class StatusPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.MED_STATUS}`;
    this.pageSelector = Selector(this.pageId);
    this.medType = Selector(`#${COMPONENT_IDS.MEDICATION_TYPE}`);
    this.medTypeOption = this.medType.find('span');
    this.medBrand = Selector(`#${COMPONENT_IDS.MEDICATION_BRAND}`);
    this.medBrandOption = this.medBrand.find('span');
    this.medLocation = Selector(`#${COMPONENT_IDS.MEDICATION_LOCATION}`);
    this.medLocationOption = this.medLocation.find('span');
    this.invenStatus = Selector(`#${COMPONENT_IDS.INVENTORY_STATUS}`);
    this.invenStatusOption = this.invenStatus().find('span');
    this.numOfRecords = Selector(`#${COMPONENT_IDS.NUM_OF_RECORDS}`);
    this.recordsOption = this.numOfRecords().find('span');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    // From https://testcafe.io/documentation/402803/recipes/best-practices/create-helpers
    // Note that this file imports t (the test controller) from the testcafe module. You don’t need to pass t to helper functions because TestCafe can resolve the current test context and provide the correct test controller instance.
    const waitTime = 15;
    console.log(`Waiting ${waitTime} seconds before running statusPage.isDisplayed().`);
    await t.wait(waitTime * 500).expect(this.pageSelector.exists).ok();
  }

  async openModal() {
    await t.click(`#${COMPONENT_IDS.MED_STATUS_ROW}`);
    await t.click(`#${COMPONENT_IDS.DRUG_PAGE_BUTTON}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.DRUG_EDIT}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.EDIT_CLOSE}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.DRUG_CLOSE}`);
  }

  async viewTabs() {
    await t.click(`#${COMPONENT_IDS.STATUS_TAB_ONE}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.STATUS_TAB_TWO}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.STATUS_TAB_THREE}`);
    await t.wait(3000);
  }

  async testFilter() {
    await t.click(`#${COMPONENT_IDS.STATUS_TAB_ONE}`);
    await t.wait(3000);
    await t.typeText(`#${COMPONENT_IDS.STATUS_FILTER}`, 'Acetaminophen');
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.STATUS_TAB_THREE}`);
    await t.wait(3000);
    await t.typeText(`#${COMPONENT_IDS.SUPPLY_FILTER}`, 'ACE');
    await t.wait(3000);
  }

  async testDropDowns() {
    await t.click(`#${COMPONENT_IDS.STATUS_TAB_ONE}`);
    await t.wait(2000);
    await t.click(this.medType).click(this.medTypeOption.withText('Allergy & Cold Medicines'));
    await t.wait(2000);
    await t.click(this.medType).click(this.medTypeOption.withText('All'));
    await t.wait(2000);
    await t.click(this.medBrand).click(this.medBrandOption.withText('Brand A'));
    await t.wait(2000);
    await t.click(this.medBrand).click(this.medBrandOption.withText('All'));
    await t.wait(2000);
    await t.click(this.medLocation).click(this.medLocationOption.withText('Bottom Drawer'));
    await t.wait(2000);
    await t.click(this.medLocation).click(this.medLocationOption.withText('All'));
    await t.wait(2000);
    await t.click(this.invenStatus).click(this.invenStatusOption.withText('Low Stock'));
    await t.wait(2000);
    await t.click(this.invenStatus).click(this.invenStatusOption.withText('All'));
    await t.wait(2000);
    await t.click(this.numOfRecords).click(this.recordsOption.withText('50'));
    await t.wait(2000);
    await t.click(this.numOfRecords).click(this.recordsOption.withText('25'));
    await t.wait(2000);
  }

}

export const statusPage = new StatusPage();
