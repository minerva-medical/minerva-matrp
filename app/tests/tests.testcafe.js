import { t } from 'testcafe';
import {
  manageDatabasePage,
  signOutPage,
  aboutUsPage,
} from './simple.page';
import { signInPage } from './signin.page';
import { navBar } from './navbar.component';
import { addInventoryPage } from './add.inventory.page';
import { signUpPage } from './signup.page';
import { landingPage } from './landing.page';
import { statusPage } from './status.page';
import { dispenseLogPage } from './dispense.log.page';
import { dispensePage } from './dispense.page';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
const testMedication = { lot: '0EqhD6', quantity: '200' };
const newCredentials = { username: 'jane@foo.com', password: 'changeme' };

fixture('matrp localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page and register page form works', async () => {
  await t.wait(10000);
  await landingPage.isDisplayed();
  await t.wait(10000);
  await landingPage.goToRegister();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentials.username, newCredentials.password);
  await t.wait(2000);
});

test('Test that sign in and sign out work', async () => {
  await landingPage.isDisplayed();
  await t.wait(5000);
  await landingPage.goToLogin();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});

test('Test that about us page displays', async () => {
  await landingPage.isDisplayed();
  await t.wait(5000);
  await landingPage.goToLogin();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await aboutUsPage.isDisplayed();
  await t.wait(5000);
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});

test('Test that the add inventory page works ', async () => {
  await landingPage.isDisplayed();
  await t.wait(3000);
  await landingPage.goToLogin();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoAddInventoryPage();
  await addInventoryPage.isDisplayed();
  await t.wait(3000);
  await addInventoryPage.addMedication(testMedication.lot, testMedication.quantity);
  await addInventoryPage.addVaccine();
  await t.wait(3000);
  await addInventoryPage.addPatientSupplies();

});

test('Test that the status log and dispense log pages work', async () => {
  await landingPage.isDisplayed();
  await t.wait(3000);
  await landingPage.goToLogin();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoDispensePage();
  await dispensePage.isDisplayed();
  await t.wait(3000);
  await navBar.gotoStatusLogPage();
  await statusPage.isDisplayed();
  await statusPage.openModal();
  await t.wait(3000);
  await statusPage.viewTabs();
  await t.wait(3000);
  await statusPage.testDropDowns();
  await statusPage.testFilter();
  await navBar.gotoDispenseLogPage();
  await dispenseLogPage.isDisplayed();
  await t.wait(3000);
  await dispenseLogPage.openModal();
  await dispenseLogPage.testDropDowns();
  await dispenseLogPage.testFilter();
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});

test('Test that the dispense page works', async () => {
  await landingPage.isDisplayed();
  await t.wait(3000);
  await landingPage.goToLogin();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoDispensePage();
  await dispensePage.isDisplayed();
  await t.wait(3000);
  await dispensePage.isDisplayed();
  await dispensePage.dispenseMedication();
  await dispensePage.dispenseVaccine();
  await dispensePage.dispensePatientSupplies();
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});

test('Test that admin pages display', async () => {
  await landingPage.isDisplayed();
  await landingPage.goToLogin();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  // want to see if we can get to the editStuffPage
  // const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  // await t.click(editLinks.nth(0));
  // await editStuffPage.isDisplayed();
  await navBar.gotoManageDatabasePage();
  await manageDatabasePage.isDisplayed();
  await t.wait(5000);
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});
