import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
// import About from '../pages/About';
import ListStuff from '../pages/ListStuff';
import ListStuffAdmin from '../pages/ListStuffAdmin';
import AddStuff from '../pages/AddStuff';
import DispenseLog from '../pages/DispenseLog';
import EditStuff from '../pages/EditStuff';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import Dispense from '../pages/Dispense';
import Test from '../pages/test';
import ManageDatabase from '../pages/ManageDatabase';
import { ROLE } from '../../api/role/Role';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const currentUser = useTracker(() => Meteor.userId(), []);

  const withNav = () => (
    <div>
      {
        currentUser &&
          <NavBar/>
      }
      <Switch>
        <ProtectedRoute path="/about" component={Test}/>
        <ProtectedRoute path="/dispense" component={Dispense}/>
        <ProtectedRoute path="/dispenseLog" component={DispenseLog}/>
        <ProtectedRoute path="/list" component={ListStuff}/>
        <ProtectedRoute path="/add" component={AddStuff}/>
        <ProtectedRoute path="/edit/:_id" component={EditStuff}/>
        <AdminProtectedRoute path="/admin" component={ListStuffAdmin}/>
        <AdminProtectedRoute path="/manage-database" component={ManageDatabase}/>
        <Route component={NotFound}/>
      </Switch>
      {
        currentUser &&
          <Footer/>
      }
    </div>
  );
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing}/>
        <Route path="/signin" component={Signin}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signout" component={Signout}/>
        <Route component={withNav}/>
        <Route component={NotFound}/>
      </Switch>
    </Router>
  );
};

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

export default App;
