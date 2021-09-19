
![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/landing-page.png)

MATRP, an extension of [meteor-application-template-react](https://ics-software-engineering.github.io/meteor-application-template-react/), is a sample Meteor 2.3 application that illustrates:

  * A standard directory layout using 'imports/' as recommended in the [Meteor Guide](https://guide.meteor.com/structure.html)
  * [Semantic UI React](https://react.semantic-ui.com/) for user interface.
  * [Uniforms](https://uniforms.tools/) for form development.
  * [alanning:roles](https://github.com/alanning/meteor-roles) to implement a special "Admin" user.
  * Authorization, authentication, and registration using built-in Meteor packages.
  * Initialization of users and data from a settings file.
  * Alerts regarding success or failure of DB updates using [Sweet Alert](https://sweetalert.js.org/).
  * Quality assurance using [ESLint](http://eslint.org) with packages to partially enforce the [Meteor Coding Standards](https://guide.meteor.com/code-style.html) and the [AirBnB Javascript Style Guide](https://github.com/airbnb/javascript).
  * Unit testing for the Mongo collections.
  * Integration testing for the Meteor methods.
  * Acceptance testing using [TestCafe](https://testcafe.io/).
  * Continuous Integration using [GitHub Actions](https://github.com/features/actions).

The goal of this template is to help you get quickly started doing Meteor development by providing a reasonable directory structure for development and deployment, a set of common extensions to the core framework, and boilerplate code to implement basic page display, navigation, forms, roles, and collection manipulation.

## Installation

First, [install Meteor](https://www.meteor.com/install).

Second, go to [https://github.com/ics-software-engineering/matrp](https://github.com/ics-software-engineering/matrp), and click the "Use this template" button. Complete the dialog box to create a new repository that you own that is initialized with this template's files.

Third, go to your newly created repository, and click the "Clone or download" button to download your new GitHub repo to your local file system.  Using [GitHub Desktop](https://desktop.github.com/) is a great choice if you use MacOS or Windows.

Fourth, cd into the app/ directory of your local copy of the repo, and install third party libraries with:

```
$ meteor npm install
```

## Running the system

Once the libraries are installed, you can run the application by invoking the "start" script in the [package.json file](https://github.com/ics-software-engineering/matrp/blob/master/app/package.json):

```
$ meteor npm run start
```

The first time you run the app, it will create some default users and data. Here is the output:

```
⋊> ~/G/m/app on main ⨯ meteor npm run start


> meteor-application-template-react-production@1.0.3 start /Users/carletonmoore/GitHub/matrp/app
> meteor --no-release-check --exclude-archs web.browser.legacy,web.cordova --settings ../config/settings.development.json

[[[[[ ~/GitHub/matrp/app ]]]]]                

=> Started proxy.                             
=> Started MongoDB.                           
I20210801-10:48:51.367(-10)? Creating the default user(s)
I20210801-10:48:51.504(-10)?   Creating user admin@foo.com with role ADMIN.
I20210801-10:48:51.537(-10)? Defining ADMIN admin@foo.com with password changeme
I20210801-10:48:51.544(-10)?   Creating user john@foo.com with role USER.
I20210801-10:48:51.704(-10)? Defining USER john@foo.com with password changeme
I20210801-10:48:51.710(-10)? Creating default data.
I20210801-10:48:51.710(-10)?   Adding: Basket (john@foo.com)
I20210801-10:48:51.747(-10)?   Adding: Bicycle (john@foo.com)
I20210801-10:48:51.753(-10)?   Adding: Banana (admin@foo.com)
I20210801-10:48:51.756(-10)?   Adding: Boogie Board (admin@foo.com)
I20210801-10:48:51.864(-10)? Monti APM: completed instrumenting the app
=> Started your app.

=> App running at: http://localhost:3000/
```


### Viewing the running app

If all goes well, the template application will appear at [http://localhost:3000](http://localhost:3000).  You can login using the credentials in [settings.development.json](https://github.com/ics-software-engineering/matrp/blob/master/config/settings.development.json), or else register a new account.

### ESLint

You can verify that the code obeys our coding standards by running ESLint over the code in the imports/ directory with:

```
meteor npm run lint
```

## Walkthrough

The following sections describe the major features of this template.

### Directory structure

The top-level directory structure is:

```
.github/    # holds the GitHub actions and issue templates
app/        # holds the Meteor application sources
checklists/ # holds review checklists
config/     # holds configuration files, such as settings.development.json
doc/        # holds developer documentation, user guides, etc.
.gitignore  # don't commit IntelliJ project files, node_modules, and settings.production.json
```

This structure separates documentation files (such as screenshots) and configuration files (such as the settings files) from the actual Meteor application.

The app/ directory has this structure:

```
.deploy/         # Meteor Up files for deploying the application
.meteor/         # Meteor files

client/
  main.html      # The boilerplate HTML with a "root" div to be manipulated by React.
  main.js        # import startup files.
  style.css      # local styles.

imports/
  api/           # Define collections.
    base/        # The BaseCollection class. Wraps the Mongo collections.
    matrp/       # Singleton instance holding all the collections.
    role/        # The defined roles in this application.
    stuff/       # The Stuffs collection definition.
    user/        # The different profile collections, Admin and User.
    utilities/   # Utility function(s)
  startup/       # Define code to run when system starts up (client-only, server-only, both)
    client/
    server/
  ui/
    components/  # Contains page elements, some of which could appear on multiple pages.
    layouts/     # Contains top-level layout (<App> component).
    pages/       # Contains components for each page.

node_modules/    # managed by npm

public/          # static assets (like images) can go here.

server/
   main.js       # import the server-side js files.
   
tests/           # TestCafe acceptance tests.
```

### Import conventions

This system adheres to the Meteor guideline of putting all application code in the imports/ directory, and using client/main.js and server/main.js to import the code appropriate for the client and server in an appropriate order.

### Application functionality

The application implements a simple CRUD application for managing "Stuff", which is a Mongo Collection consisting of a name (String), a quantity (Number), and a condition (one of 'excellent', 'good', 'fair', or 'poor').

By default, each user only sees the Stuff that they have created.  However, the settings file enables you to define default accounts.  If you define a user with the role "admin", then that user gets access to a special page which lists all the Stuff defined by all users.

#### Landing page

When you retrieve the app at http://localhost:3000, this is what should be displayed:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/landing-page.png)

The next step is to use the Login menu to either Login to an existing account or register a new account.

#### Login page

Clicking on the Login link, then on the Sign In menu item displays this page:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/signin-page.png)

#### Register page

Alternatively, clicking on the Login link, then on the Sign Up menu item displays this page:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/register-page.png)


#### Landing (after Login) page, non-Admin user

Once you log in (either to an existing account or by creating a new one), the navbar changes as follows:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/landing-after-login-page.png)

You can now add new Stuff documents, and list the Stuff you have created. Note you cannot see any Stuff created by other users.

#### Add Stuff page

After logging in, here is the page that allows you to add new Stuff:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/add-stuff-page.png)

#### List Stuff page

After logging in, here is the page that allows you to list all the Stuff you have created:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/list-stuff-page.png)

You click the "Edit" link to go to the Edit Stuff page, shown next.

#### Edit Stuff page

After clicking on the "Edit" link associated with an item, this page displays that allows you to change and save it:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/edit-stuff-page.png)

#### Landing (after Login), Admin user

You can define an "admin" user in the settings.json file. This user, after logging in, gets a special entry in the navbar:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/admin-landing-page.png)

#### Admin page (list all users stuff)

To provide a simple example of a "super power" for Admin users, the Admin page lists all of the Stuff by all of the users:

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/admin-list-stuff-page.png)

Note that non-admin users cannot get to this page, even if they type in the URL by hand.

#### Admin Manage database page

This page supports dumping and loading all the collections' data.

![](https://raw.githubusercontent.com/ics-software-engineering/matrp/master/doc/admin-manage-database-page.png)

### Collections

The application implements several Collections: Stuffs, AdminProfiles, and UserProfiles. We also wrap the `Meteor.users` collection to manage the creation of Meteor users. All the collection are extensions of `BaseCollection`.

#### BaseCollection

The BaseCollection class wraps the Mongo.collection. It defines several helpful methods.

#### Stuffs
Each Stuffs document has the following fields: name, quantity, condition, and username.

The Stuffs collection is defined in [imports/api/stuff/StuffCollection.js](https://github.com/ics-software-engineering/matrp/blob/master/app/imports/api/stuff/StuffCollection.js).

The Stuffs collection is initialized in [imports/startup/server/Mongo.js](https://github.com/ics-software-engineering/matrp/blob/master/app/imports/startup/server/Mongo.js).

To support recording additional information about users in the application, we've implemented two additional collections. 

#### AdminProfiles
Each AdminProfiles document has the following fields: email, firstName, lastName, role, and userID. The `userID` field holds the `Meteor.userID`. 

The AdminProfiles collections is defined in [imports/api/user/AdminProfileCollection.js](https://github.com/ics-software-engineering/matrp/blob/master/app/imports/api/user/AdminProfileCollection.js).

### CSS

The application uses the [React implementation of Semantic UI](http://react.semantic-ui.com/).

### Routing

For display and navigation among its four pages, the application uses [React Router](https://reacttraining.com/react-router/).

Routing is defined in [imports/ui/layouts/App.jsx](https://github.com/ics-software-engineering/matrp/blob/master/app/imports/ui/layouts/App.jsx).


### Authentication

For authentication, the application uses the Meteor accounts package.

When the application is run for the first time, a settings file (such as [config/settings.development.json](https://github.com/ics-software-engineering/matrp/blob/master/config/settings.development.json)) should be passed to Meteor. That will lead to a default account being created through the code in [imports/startup/server/accounts.js](https://github.com/ics-software-engineering/matrp/blob/master/app/imports/startup/server/accounts.js).

The application allows users to register and create new accounts at any time.

### Authorization

Only logged-in users can manipulate Stuff documents (but any registered user can manipulate any Stuff document, even if they weren't the user that created it.)

### Configuration

The [config](https://github.com/ics-software-engineering/matrp/tree/master/config) directory is intended to hold settings files.  The repository contains one file: [config/settings.development.json](https://github.com/ics-software-engineering/matrp/blob/master/config/settings.development.json).

The [.gitignore](https://github.com/ics-software-engineering/matrp/blob/master/.gitignore) file prevents a file named settings.production.json from being committed to the repository. So, if you are deploying the application, you can put settings in a file named settings.production.json and it will not be committed.

### Quality Assurance

#### ESLint

The application includes a [.eslintrc](https://github.com/ics-software-engineering/matrp/blob/master/app/.eslintrc) file to define the coding style adhered to in this application. You can invoke ESLint from the command line as follows:

```
⋊> ~/G/m/app on main ⨯ meteor npm run lint


> meteor-application-template-react-production@1.0.3 lint /Users/carletonmoore/GitHub/matrp/app
> eslint --quiet --fix --ext .jsx --ext .js ./imports

```

ESLint should run without generating any errors.

It's significantly easier to do development with ESLint integrated directly into your IDE (such as IntelliJ).

#### Unit tests

The unit tests test each of the collections. To run the unit tests use the `test-unit` script.

```
⋊> ~/G/m/app on main ⨯ meteor npm run test-unit 

> meteor-application-template-react-production@1.0.3 test-unit /Users/carletonmoore/GitHub/matrp/app
> cross-env TEST_BROWSER_DRIVER=puppeteer MOCHA_TIMEOUT=150000 meteor test --exclude-archs web.browser.legacy,web.cordova --no-release-check --once --driver-package meteortesting:mocha --port 3100

[[[[[ Tests ]]]]]                             

=> Started proxy.                             
=> Started MongoDB.                           
I20210811-10:41:24.385(-10)?                  
I20210811-10:41:24.506(-10)? --------------------------------
I20210811-10:41:24.507(-10)? ----- RUNNING SERVER TESTS -----
I20210811-10:41:24.507(-10)? --------------------------------
I20210811-10:41:24.507(-10)? 
I20210811-10:41:24.507(-10)? 
I20210811-10:41:24.508(-10)? 
I20210811-10:41:24.508(-10)?   StuffCollection
I20210811-10:41:24.508(-10)? Monti APM: completed instrumenting the app
=> Started your app.

=> App running at: http://localhost:3100/
I20210811-10:41:25.112(-10)?     ✓ Can define and removeIt (705ms)
I20210811-10:41:25.115(-10)?     ✓ Can define duplicates
I20210811-10:41:25.337(-10)?     ✓ Can update (222ms)
I20210811-10:41:25.349(-10)?     ✓ Can dumpOne, removeIt, and restoreOne
I20210811-10:41:25.354(-10)? 
I20210811-10:41:25.354(-10)?   AdminProfileCollection
I20210811-10:41:25.401(-10)? Defining ADMIN Una.Haley70@hotmail.com with password changeme
I20210811-10:41:25.803(-10)? Defining ADMIN Clarissa.Rippin@hotmail.com with password changeme
[ snip ]
I20210811-10:41:34.594(-10)?     ✓ Can define and removeIt (9238ms)
I20210811-10:41:34.597(-10)? Defining ADMIN Lottie48@yahoo.com with password changeme
I20210811-10:41:34.682(-10)?     ✓ Cannot define duplicates (87ms)
I20210811-10:41:34.685(-10)? Defining ADMIN Troy.Ruecker65@hotmail.com with password G4eHBwHJ23FXx7q
I20210811-10:41:34.980(-10)?     ✓ Can update (298ms)
I20210811-10:41:34.982(-10)? 
I20210811-10:41:34.982(-10)?   UserProfileCollection
I20210811-10:41:35.015(-10)? Defining USER Dominique.OKon@hotmail.com with password changeme
I20210811-10:41:35.106(-10)? Defining USER Amely_Braun18@yahoo.com with password changeme
[ snip ]
I20210811-10:41:43.974(-10)?     ✓ Can define and removeIt (8990ms)
I20210811-10:41:43.977(-10)? Defining USER Thalia.Hilll@gmail.com with password changeme
I20210811-10:41:44.066(-10)?     ✓ Cannot define duplicates (92ms)
I20210811-10:41:44.069(-10)? Defining USER Justus.Wehner@gmail.com with password 9EDF0mDZXMyzrjM
I20210811-10:41:44.363(-10)?     ✓ Can update (297ms)
I20210811-10:41:44.365(-10)? 
I20210811-10:41:44.365(-10)? 
I20210811-10:41:44.366(-10)?   10 passing (20s)
I20210811-10:41:44.366(-10)? 
I20210811-10:41:44.366(-10)? 
I20210811-10:41:44.366(-10)? --------------------------------
I20210811-10:41:44.366(-10)? ----- RUNNING CLIENT TESTS -----
I20210811-10:41:44.366(-10)? --------------------------------
I20210811-10:41:44.937(-10)? HeadlessChrome/92.0.4512.0
W20210811-10:41:46.482(-10)? (STDERR) waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
I20210811-10:41:46.488(-10)?   0 passing (0ms)
I20210811-10:41:46.564(-10)? All tests finished!
I20210811-10:41:46.564(-10)? 
I20210811-10:41:46.565(-10)? --------------------------------
I20210811-10:41:46.565(-10)? SERVER FAILURES: 0
I20210811-10:41:46.565(-10)? CLIENT FAILURES: 0
I20210811-10:41:46.565(-10)? --------------------------------
⋊> ~/G/m/app on main ⨯
```

#### Integration tests

To test the ValidatedMethods use the integration test script `test-integration`.
```
⋊> ~/G/m/app on main ⨯ meteor npm run test-integration 

> meteor-application-template-react-production@1.0.3 test-integration /Users/carletonmoore/GitHub/matrp/app
> cross-env METEOR_NO_RELEASE_CHECK=1 TEST_BROWSER_DRIVER=puppeteer meteor test --full-app --once --driver-package meteortesting:mocha --port 3100

[[[[[ Tests ]]]]]                             

=> Started proxy.                             
=> Started MongoDB.                           
I20210811-10:51:38.533(-10)? Cannot initialize the database!  Please invoke meteor with a settings file.
I20210811-10:51:38.675(-10)? 
I20210811-10:51:38.676(-10)? --------------------------------
I20210811-10:51:38.676(-10)? --- RUNNING APP SERVER TESTS ---
I20210811-10:51:38.676(-10)? --------------------------------
I20210811-10:51:38.676(-10)? 
I20210811-10:51:38.676(-10)? 
I20210811-10:51:38.677(-10)? 
I20210811-10:51:38.677(-10)?   0 passing (0ms)
I20210811-10:51:38.677(-10)? 
I20210811-10:51:38.677(-10)? 
I20210811-10:51:38.677(-10)? --------------------------------
I20210811-10:51:38.677(-10)? --- RUNNING APP CLIENT TESTS ---
I20210811-10:51:38.677(-10)? --------------------------------
I20210811-10:51:38.880(-10)? Monti APM: completed instrumenting the app
=> Started your app.

=> App running at: http://localhost:3100/
I20210811-10:51:39.208(-10)? HeadlessChrome/92.0.4512.0
I20210811-10:51:40.838(-10)? Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
I20210811-10:51:41.794(-10)? 
I20210811-10:51:41.795(-10)?   StuffCollection Meteor Methods
W20210811-10:51:42.108(-10)? (STDERR) waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
I20210811-10:51:42.348(-10)?     ✓ Can define, update, and removeIt (551ms)
I20210811-10:51:42.349(-10)?   AdminProfileCollection Meteor Methods
I20210811-10:51:42.806(-10)? Defining ADMIN Lennie58@gmail.com with password changeme
I20210811-10:51:42.927(-10)?     ✓ Can define, update, and removeIt (578ms)
I20210811-10:51:42.929(-10)?   UserProfileCollection Meteor Methods
I20210811-10:51:43.373(-10)? Defining USER Desmond.Schimmel@yahoo.com with password changeme
I20210811-10:51:43.483(-10)?     ✓ Can define, update, and removeIt (554ms)
I20210811-10:51:43.484(-10)?   3 passing (2s)
I20210811-10:51:43.568(-10)? All tests finished!
I20210811-10:51:43.568(-10)? 
I20210811-10:51:43.568(-10)? --------------------------------
I20210811-10:51:43.568(-10)? APP SERVER FAILURES: 0
I20210811-10:51:43.569(-10)? APP CLIENT FAILURES: 0
I20210811-10:51:43.569(-10)? --------------------------------
⋊> ~/G/m/app on main ⨯         
```

#### Acceptance tests

The MATRP acceptance tests ensure that all the application's pages render. Run the acceptance test using the `test-acceptance` script. 

```
⋊> ~/G/m/app on main ⨯ meteor npm run test-acceptance

> meteor-application-template-react-production@1.0.3 test-acceptance /Users/carletonmoore/GitHub/matrp/app
> meteor reset && testcafe chrome:headless tests/*.testcafe.js -q --app "meteor npm run start"

Project reset.                                
 Running tests in:
 - Chrome 92.0.4515.131 / macOS 10.15.7

 matrp localhost test with default db
Waiting 15 seconds before running LandingPage.isDisplayed().
Waiting 15 seconds before running LandingPage.isDisplayed().
Waiting 15 seconds before running LandingPage.isDisplayed().
Waiting 15 seconds before running LandingPage.isDisplayed().
 ✓ Test that landing page shows up (unstable)
 ✓ Test that sign in and sign out work
 ✓ Test that sign up and sign out work
 ✓ Test that user pages show up
 ✓ Test that admin pages show up


 5 passed (1m 45s)
⋊> ~/G/m/app on main ⨯   
```

#### Running all the tests

You can run ESLint and all the tests using the `test-all` script.

#### Continuous Integration using GitHub Actions

MATRP uses GitHub Actions to run ESLint and all the tests every time code is pushed to `main`.

## Screencasts for Meteor Application Template React

For more information about this system, please watch one or more of the following screencasts. Note that the current source code might differ slightly from the code in these screencasts, but the changes should be very minor.

  * [Walkthrough of system user interface (5 min)](https://www.youtube.com/watch?v=shYgqco1AUs)
  * [Data and accounts structure and initialization (15 min)](https://www.youtube.com/watch?v=p9dvM6MdCGs)
  * [Navigation, routing, pages, components (23 min)](https://www.youtube.com/watch?v=DAv0UjS0VjQ)
  * [Forms (25 min)](https://www.youtube.com/watch?v=z02076QgDA8)
  * [Authorization, authentication, and roles (10 min)](https://www.youtube.com/watch?v=_i1dgcP0zoI)
