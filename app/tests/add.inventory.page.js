import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class AddInventoryPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_INVENTORY}`;
    this.pageSelector = Selector(this.pageId);
    this.lot = Selector(`#${COMPONENT_IDS.ADD_MEDICATION_LOT}`);
    this.lotOption = this.lot.find('span');
    this.dateAdded = Selector(`#${COMPONENT_IDS.ADD_VACCINATION_DATE_ADDED}`);
    this.purchased = Selector(`#${COMPONENT_IDS.ADD_VACCINATION_PURCHASED}`);
    this.wasPurchased = this.purchased.find('span');
    this.site = Selector(`#${COMPONENT_IDS.ADD_VACCINATION_SITE}`);
    this.chosenSite = this.site.find('span');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    // From https://testcafe.io/documentation/402803/recipes/best-practices/create-helpers
    // Note that this file imports t (the test controller) from the testcafe module. You don’t need to pass t to helper functions because TestCafe can resolve the current test context and provide the correct test controller instance.
    const waitTime = 15;
    console.log(`Waiting ${waitTime} seconds before running addInventoryPage.isDisplayed().`);
    await t.wait(waitTime * 100).expect(this.pageSelector.exists).ok();
  }

  async test() {
    await t.click(`#${COMPONENT_IDS.TAB_ONE}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.TAB_TWO}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.TAB_THREE}`);
    await t.wait(3000);
    await t.click(`#${COMPONENT_IDS.TAB_FOUR}`);
    await t.wait(3000);
  }

  async addMedication(lot, quantity) {
    await t.click(`#${COMPONENT_IDS.TAB_ONE}`);
    await t.wait(2000);
    await t.click(this.lot).click(this.lotOption.withText('0EqhD6'));
    await t.wait(2000);
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICATION_QUANTITY}`, quantity);
    await t.wait(2000);
    await t.click(`#${COMPONENT_IDS.ADD_MEDICATION_CLEAR}`);
    await t.wait(2000);
  }

  async addVaccine() {
    await t.click(`#${COMPONENT_IDS.TAB_TWO}`);
    await t.wait(2000);
    await t.typeText(this.dateAdded, '2022-12-23')
      .expect(Selector(this.dateAdded).value).eql('2022-12-23');
    await t.wait(2000);
    await t.click(this.purchased()).click(this.wasPurchased().withText('Purchased'));
    await t.wait(2000);
    await t.click(this.site()).click(this.chosenSite().withText('JOC'));
    await t.wait(2000);
  }

  async addPatientSupplies() {
    await t.click(`#${COMPONENT_IDS.TAB_THREE}`);
    await t.wait(3000);
  }

  async addLabTestingSupplies() {
    await t.click(`#${COMPONENT_IDS.TAB_FOUR}`);
    await t.wait(3000);

  }

}

export const addInventoryPage = new AddInventoryPage();
