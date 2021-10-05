import { t } from 'testcafe';
import {
  listStuffAdminPage,
  manageDatabasePage,
  signOutPage,
  aboutUsPage,
  dispensePage,
  dispenseLogPage,
  addInventoryPage, statusPage,
} from './simple.page';
import { signInPage } from './signin.page';
import { navBar } from './navbar.component';
// import { signUpPage } from './signup.page';
import { landingPage } from './landing.page';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
// const newCredentials = { username: 'jane@foo.com', password: 'changeme' };

fixture('matrp localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await t.wait(10000);
  await landingPage.isDisplayed();
  await t.wait(10000);
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

// commented out until sign up page works properly
/**
test('Test that sign up and sign out work', async () => {
  await navBar.gotoSignupPage();
  await signUpPage.signupUser(newCredentials.username, newCredentials.password);
  await navBar.isLoggedIn(newCredentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});
* */

test('Test that about us page displays', async () => {
  await landingPage.isDisplayed();
  await t.wait(5000);
  await landingPage.goToLogin();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoAboutUsPage();
  await aboutUsPage.isDisplayed();
  await t.wait(5000);
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});

test('Test that the add inventory page, status log page, dispense page, and dispense history page display', async () => {
  await landingPage.isDisplayed();
  await t.wait(5000);
  await landingPage.goToLogin();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoAddInventoryPage();
  await addInventoryPage.isDisplayed();
  await t.wait(5000);
  await navBar.gotoDispensePage();
  await dispensePage.isDisplayed();
  await t.wait(5000);
  await navBar.gotoStatusLogPage();
  await statusPage.isDisplayed();
  await t.wait(5000);
  await navBar.gotoDispenseLogPage();
  await dispenseLogPage.isDisplayed();
  await t.wait(5000);
  // want to see if we can get to the editStuffPage
  // const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  // await t.click(editLinks.nth(0));
  // await editStuffPage.isDisplayed();
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
  await navBar.gotoListStuffAdminPage();
  await listStuffAdminPage.isDisplayed();
  await t.wait(5000);
  await navBar.gotoManageDatabasePage();
  await manageDatabasePage.isDisplayed();
  await t.wait(5000);
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});
