import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import logoSm from "../../assets/images/logosm.svg";
import logoDark from "../../assets/images/logosm.svg";
import logoLight from "../../assets/images/logosm.svg";

import { toggleLeftmenu } from "../../store/actions";

const Sidebar = (props) => {
  function tToggle() {
    var body = document.body;
    body.classList.toggle("vertical-collpsed");
    body.classList.toggle("sidebar-enable");
  }

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="32" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height="30" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="32" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" height="30" />
            </span>
          </Link>
        </div>
        <button
          onClick={() => {
            tToggle();
          }}
          type="button"
          className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
        >
          <i className="fa fa-fw fa-bars"></i>
        </button>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
  leftSideBarType: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { layout, leftSideBarType } = state.Layout;
  return { layout, leftSideBarType };
};

export default connect(mapStatetoProps, { toggleLeftmenu })(
  withRouter(withTranslation()(Sidebar))
);
