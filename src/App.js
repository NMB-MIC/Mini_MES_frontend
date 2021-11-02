import React, { Component } from 'react';
import Home from './components/home/'
import Login from './components/authen/login/login'
import Register from './components/authen/register/register'
import ChangePassword from './components/authen/changePassword/changePassword'

import Header from './components/structure/header'
import Footer from './components/structure/footer'
import SideMenu from './components/structure/sideMenu'

//web master
import master_user from './components/master/user'

//production master
import bill_of_material from './components/production_master/bill_of_material'
import materials_master from './components/production_master/materials'
import models_master from './components/production_master/models'

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { setApp } from "./actions/app.action";
import { connect } from "react-redux";
import { key, YES } from './constants';
import moment from 'moment';
import Swal from 'sweetalert2';


const isLoggedIn = () => {
  return localStorage.getItem(key.LOGIN_PASSED) === YES;
};

const isPowerUser = () => {
  if (
    localStorage.getItem(key.USER_LV) === "power" ||
    localStorage.getItem(key.USER_LV) === "admin"
  ) {
    return true;
  } else {
    return false;
  }
};

const isLoginTimeOut = (value, unit) => {
  const loginTime = moment(localStorage.getItem(key.TIME_LOGIN))
    .add(value, unit)
    .toDate();
  if (loginTime < moment()) {
    localStorage.removeItem(key.LOGIN_PASSED);
    localStorage.removeItem(key.USER_NAME);
    localStorage.removeItem(key.USER_LV);
    localStorage.removeItem(key.TOKEN)
    localStorage.removeItem(key.TIME_LOGIN);

    Swal.fire({
      icon: "info",
      title: "Login timeout",
      text: "Please re login again...",
      showCancelButton: false,
    }).then(() => {
      window.location.replace("../login");
    });
    return true;
  } else {
    return false;
  }
};

// Protected Route
const SecuredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() === true && isLoginTimeOut(12, "h") === false ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const SecuredLVRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() === true && isLoginTimeOut(1, "h") === false ? (
        isPowerUser() === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/home" />
        )
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

class App extends Component {

  componentDidMount() {
    this.props.setApp(this);
  }

  redirectToLogin = () => {
    return <Redirect to="/login" />;
  };

  render() {
    return (
      <Router>
        {isLoggedIn() && <Header />}
        {isLoggedIn() && <SideMenu />}
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <SecuredRoute path="/changePassword" component={ChangePassword} />
          <SecuredRoute path="/home" component={Home} />

          {/*web master */}
          <SecuredLVRoute path="/master/user" component={master_user} />

          {/* production master */}
          <SecuredLVRoute path="/production_master/bill_of_material" component={bill_of_material} />
          <SecuredLVRoute path="/production_master/materials" component={materials_master} />
          <SecuredLVRoute path="/production_master/models" component={models_master} />

          <Route exact={true} path="/" component={this.redirectToLogin} />
          <Route exact={true} path="*" component={this.redirectToLogin} />
        </Switch>
        {isLoggedIn() && <Footer />}
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  setApp,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);