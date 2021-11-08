import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { key } from "../../../constants";

class SideMenu extends Component {


  renderProduction = (pathname) => {
    return (
      <li className="nav-item has-treeview">
        <a
          className={
            pathname.includes('/production/')
              ? "nav-link active"
              : "nav-link"
          }
        >
          {/* <i className="" /> */}
          <span className="nav-icon fas fa-industry iconify" data-icon="ic:outline-precision-manufacturing"></span>
          <p>
            Production
            <i className="fas fa-angle-left right" />
          </p>
        </a>
        <ul className="nav nav-treeview" style={{ display: "none" }}>
          <li className="nav-item">
            <Link
              to="/production/manufacturing_order"
              className={
                pathname === "/production/manufacturing_order"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Manufacturing order</p>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/production/work_order_sheet"
              className={
                pathname === "/production/work_order_sheet"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Work order sheet</p>
            </Link>
          </li>

        </ul>
      </li>
    )
  }

  renderProductionMaster = (pathname) => {
    if (
      localStorage.getItem(key.USER_LV) === "power" ||
      localStorage.getItem(key.USER_LV) === "admin"
    ) {
      return (
        <li className="nav-item has-treeview">
          <a
            className={
              pathname.includes('/production_master')
                ? "nav-link active"
                : "nav-link"
            }
          >
            <i className="nav-icon fas fa-industry" />
            <p>
              Production master
              <i className="fas fa-angle-left right" />
            </p>
          </a>
          <ul className="nav nav-treeview" style={{ display: "none" }}>
            <li className="nav-item">
              <Link
                to="/production_master/models"
                className={
                  pathname === "/production_master/models"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>Models master</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/production_master/materials"
                className={
                  pathname === "/production_master/materials"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>Materials master</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/production_master/bill_of_material"
                className={
                  pathname === "/production_master/bill_of_material"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>BOM</p>
              </Link>
            </li>

          </ul>
        </li>
      )
    }
  }

  renderMasters = (pathname) => {
    if (
      localStorage.getItem(key.USER_LV) === "power" ||
      localStorage.getItem(key.USER_LV) === "admin"
    ) {
      return (
        <li className="nav-item has-treeview">
          <a
            className={
              pathname.includes('/master')
                ? "nav-link active"
                : "nav-link"
            }
          >
            <i className="nav-icon fas fa-clipboard-list" />
            <p>
              Manage master
              <i className="fas fa-angle-left right" />
            </p>
          </a>
          <ul className="nav nav-treeview" style={{ display: "none" }}>
            <li className="nav-item">
              <Link
                to="/master/user"
                className={
                  pathname === "/master/user"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>User manage</p>
              </Link>
            </li>
          </ul>
        </li>
      )
    }
  }

  render() {
    const { pathname } = this.props.location;

    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="/home" className="brand-link">
          <img
            src="/img/MES_sidemenu.SVG"
            alt="Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: '.9', backgroundColor: '#FfFfFf' }} />
          <span className="brand-text font-weight-light">Weight scales</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition"><div className="os-resize-observer-host observed"><div className="os-resize-observer" style={{ left: 0, right: 'auto' }} /></div><div className="os-size-auto-observer observed" style={{ height: 'calc(100% + 1px)', float: 'left' }}><div className="os-resize-observer" /></div><div className="os-content-glue" style={{ margin: '0px -8px', width: 249, height: 520 }} /><div className="os-padding"><div className="os-viewport os-viewport-native-scrollbars-invisible" style={{ overflowY: 'scroll' }}>
          <div className="os-content" style={{ padding: '0px 8px', height: '100%', width: '100%' }}>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                {this.renderProduction(pathname)}

                {this.renderProductionMaster(pathname)}

                {this.renderMasters(pathname)}
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div></div></div><div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable os-scrollbar-auto-hidden"><div className="os-scrollbar-track"><div className="os-scrollbar-handle" style={{ width: '100%', transform: 'translate(0px, 0px)' }} /></div></div><div className="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden"><div className="os-scrollbar-track"><div className="os-scrollbar-handle" style={{ height: '38.3652%', transform: 'translate(0px, 0px)' }} /></div></div><div className="os-scrollbar-corner" /></div>
        {/* /.sidebar */}
      </aside>

    )
  }
}

export default withRouter(SideMenu);
