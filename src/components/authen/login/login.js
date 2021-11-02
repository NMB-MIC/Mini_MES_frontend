import React, { Component } from "react";
import { Link } from "react-router-dom";
import { key, OK, server, YES } from "../../../constants";
import { httpClient } from "../../../utils/HttpClient";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import * as action from "../../../actions/app.action";
import moment from "moment";

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }

  componentDidMount() {
    this.autoLogin()
  }

  autoLogin = async () => {
    if (localStorage.getItem(key.LOGIN_PASSED) === YES) {
      await this.props.history.push("/home")
      this.props.appReducer.app && this.props.appReducer.app.forceUpdate();
    }

  };


  doLogin = async () => {
    try {
      const response = await httpClient.post(server.LOGIN_URL, this.state)
      if (response.data.api_result === OK) {
        localStorage.setItem(key.LOGIN_PASSED, YES);
        localStorage.setItem(key.USER_NAME, response.data.result.username);
        localStorage.setItem(key.USER_EMP, response.data.result.empNumber);
        localStorage.setItem(key.API_KEY, response.data.result.randomKey);
        localStorage.setItem(key.USER_LV, response.data.result.levelUser);
        localStorage.setItem(key.TOKEN, response.data.token)
        localStorage.setItem(key.TIME_LOGIN, moment())
        this.props.history.push('/home')
        this.props.appReducer.app.forceUpdate();

      } else {
        Swal.fire('Login failed!', response.data.error, 'error')
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="login-page">
        <div className="login-box">
          {/* /.login-logo */}
          <div className="card card-outline card-dark">
            <div className="card-header text-center">
              <img src="/img/MES.svg" />
              <a className="h1"><b>Mini</b> MES</a>
            </div>
            <div className="card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <form>
                <div className="input-group mb-3">
                  <input onChange={(e) => {
                    this.setState({ username: e.target.value })
                  }} type="text" className="form-control" placeholder="User name" />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input onChange={(e) => {
                    this.setState({ password: e.target.value })
                  }} type="password" className="form-control" placeholder="Password" />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-8">
                    <p className="mb-0">
                      <Link to="/register" className="text-center">Register a new membership</Link>
                    </p>
                  </div>
                  {/* /.col */}
                  <div className="col-4">
                    <button onClick={(e) => {
                      e.preventDefault();
                      this.doLogin()
                    }} type="submit" className="btn btn-primary btn-block">Sign In</button>
                  </div>
                  {/* /.col */}
                </div>
              </form>
              {/* /.social-auth-links */}
            </div>
            {/* /.card-body */}
          </div>
          {/* /.card */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  appReducer: state.appReducer,
});

const mapDispatchToProps = {
  ...action,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
