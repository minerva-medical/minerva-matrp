import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class DispensePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DISPENSE}`;
    this.pageSelector = Selector(this.pageId);
    this.lotType = Selector(`#${COMPONENT_IDS.DISPENSE_MED_LOT}`);
    this.lotTypeOption = this.lotType.find('span');
    this.site = Selector(`#${COMPONENT_IDS.DISPENSE_SUP_SITE}`);
    this.siteOption = this.site.find('span');
    this.supplyName = Selector(`#${COMPONENT_IDS.DISPENSE_SUP_NAME}`);
    this.supplyNameOption = this.supplyName.find('span');
    this.supplyLocation = Selector(`#${COMPONENT_IDS.DISPENSE_SUP_LOCATION}`);
    this.supplyLocationOption = this.supplyLocation.find('span');
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
    await t.click(this.lotType).click(this.lotTypeOption.withText('0GevS4'));
    await t.wait(2000);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_MED_PT_NUM}`, '1234567');
    await t.wait(2000);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_MED_QUANTITY}`, '10');
    await t.wait(2000);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_MED_NOTES}`, 'Testing');
    await t.click(`#${COMPONENT_IDS.DISPENSE_MED_CLEAR}`);
    await t.wait(2000);
  }

  async dispenseVaccine() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_TWO}`);
    await t.wait(2000);
  }

  async dispensePatientSupplies() {
    await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_THREE}`);
    await t.click(this.site).click(this.siteOption.withText('POST'));
    await t.wait(2000);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_SUP_PT_NUM}`, '1234567');
    await t.wait(2000);
    await t.click(this.supplyName()).click(this.supplyNameOption().withText('Cold Packs'));
    await t.wait(2000);
    await t.click(this.supplyLocation()).click(this.supplyLocationOption().withText('Cabinet 1'));
    await t.wait(2000);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_SUP_QUANTITY}`, '10');
    await t.wait(2000);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_SUP_NOTES}`, 'Testing');
    await t.wait(2000);
    await t.click(`#${COMPONENT_IDS.DISPENSE_SUP_CLEAR}`);
  }

  // async dispenseLabTestingSupplies() {
  //   await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_FOUR}`);
  //   await t.wait(3000);
  // }
  //
  // async dispenseReports() {
  //   await t.click(`#${COMPONENT_IDS.DISPENSE_TAB_FIVE}`);
  //   await t.wait(3000);
  // }

}

export const dispensePage = new DispensePage();
