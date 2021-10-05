import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class LandingPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LANDING}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    // From https://testcafe.io/documentation/402803/recipes/best-practices/create-helpers
    // Note that this file imports t (the test controller) from the testcafe module. You don’t need to pass t to helper functions because TestCafe can resolve the current test context and provide the correct test controller instance.
    const waitTime = 15;
    console.log(`Waiting ${waitTime} seconds before running LandingPage.isDisplayed().`);
    await t.wait(waitTime * 1000).expect(this.pageSelector.exists).ok();
  }

  async goToLogin() {
    await t.click(`#${COMPONENT_IDS.LANDING_TO_SIGN_IN}`);
  }

  async goToRegister() {
    await t.click(`#${COMPONENT_IDS.LANDING_TO_REGISTER}`);
  }

}

export const landingPage = new LandingPage();
