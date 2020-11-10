/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { connect } from "react-redux";

// TODO: ambil privileges dari store
const select = (appState) => {
  return {
    results: appState.results,
    query: appState.query
  };
};

function AsideMenuList(props) {
  const [currPrivileges, setCurrPrivileges] = React.useState([]);
  const [user, setUser] = React.useState("staff");
  const [dashboardSections, setDashboardSections] = React.useState([]);
  const [productSections, setProductSections] = React.useState([]);
  const [managementSections, setManagementSections] = React.useState([]);

  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  const handleSetPrivileges = () => {
    const curr = JSON.parse(localStorage.getItem("user_info")).privileges || [];
    const currUser = curr.length ? "staff" : "owner";
    setCurrPrivileges(curr);
    setUser(currUser);
  };

  const findPrivilege = (name) => {
    if (currPrivileges.length) {
      const find = currPrivileges.find(
        (item) => item.name === name && item.access === "Backend"
      );
      if (find) {
        return currPrivileges.find(
          (item) => item.name === name && item.access === "Backend"
        ).allow;
      }
    }

    return false;
  };

  const processPrivileges = () => {
    //
    const ds = [...dashboardSections];
    const checkDashboard = findPrivilege("view_dashboard");
    const checkReport = findPrivilege("view_report");

    if (checkDashboard) ds.push("view_dashboard");
    if (checkReport) ds.push("view_report");

    if (user === "owner") {
      ds.push("view_dashboard");
      ds.push("view_report");
    }

    setDashboardSections(ds);

    // product sections
    const ps = [...productSections];
    const checkProduct = findPrivilege("product_management");

    if (checkProduct) ps.push("product_management");

    if (user === "owner") {
      ps.push("product_management");
    }

    setProductSections(ps);

    // management sections
    const ms = [...managementSections];
    const checkOutlet = findPrivilege("outlet_management");
    const checkPromo = findPrivilege("promo_management");
    const checkStaff = findPrivilege("staff_management");
    const checkRole = findPrivilege("role_management");
    const checkCustomer = findPrivilege("customer_management");

    if (checkOutlet) ms.push("outlet_management");
    if (checkPromo) ms.push("promo_management");
    if (checkStaff) ms.push("staff_management");
    if (checkRole) ms.push("role_management");
    if (checkCustomer) ms.push("customer_management");

    if (user === "owner") {
      ms.push("outlet_management");
      ms.push("promo_management");
      ms.push("staff_management");
      ms.push("role_management");
      ms.push("customer_management");
    }

    setManagementSections(ms);
  };

  React.useEffect(() => {
    handleSetPrivileges();
  }, []);

  React.useEffect(() => {
    processPrivileges();
  }, [currPrivileges]);

  return (
    <>
      <ul
        className={`menu-nav ${props.layoutProps.ulClasses}`}
        style={{ padding: 0 }}
      >
        {dashboardSections.length
          ? dashboardSections.map((section, index) => {
              if (section === "view_dashboard") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/dashboard",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/dashboard">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Design/Layers.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Dashboard</span>
                    </NavLink>
                  </li>
                );
              }

              if (section === "view_report") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/report",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/report">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Design/Layers.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Report</span>
                    </NavLink>
                  </li>
                );
              }
            })
          : ""}

        {productSections.length ? (
          <li className="menu-section" style={{ margin: "0" }}>
            <h4 className="menu-text">Products</h4>
          </li>
        ) : (
          ""
        )}

        {productSections.length
          ? productSections.map((section, index) => {
              if (section === "product_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/product",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/product">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Product</span>
                    </NavLink>
                  </li>
                );
              }
            })
          : ""}

        {managementSections.length ? (
          <li className="menu-section" style={{ margin: "0" }}>
            <h4 className="menu-text">Management Settings</h4>
          </li>
        ) : (
          ""
        )}

        {managementSections.length
          ? managementSections.map((section, index) => {
              if (section === "outlet_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/outlet",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/outlet">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Outlet</span>
                    </NavLink>
                  </li>
                );
              }

              if (section === "promo_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/promo",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/promo">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Promo</span>
                    </NavLink>
                  </li>
                );
              }

              if (section === "staff_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/staff",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/staff">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Staff</span>
                    </NavLink>
                  </li>
                );
              }
              if (section === "role_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive("/role", false)}`}
                  >
                    <NavLink className="menu-link" to="/role">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Role</span>
                    </NavLink>
                  </li>
                );
              }
              if (section === "customer_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/customer",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/customer">
                      <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span>
                      <span className="menu-text">Customer</span>
                    </NavLink>
                  </li>
                );
              }
            })
          : ""}

        <li className="menu-section" style={{ margin: "0" }}>
          <h4 className="menu-text">Account Settings</h4>
        </li>

        <li className={`menu-item ${getMenuItemActive("/account", false)}`}>
          <NavLink className="menu-link" to="/account">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span>
            <span className="menu-text">Account</span>
          </NavLink>
        </li>
      </ul>
    </>
  );
}

const ourWrapperFunction = connect(select);

export default ourWrapperFunction(AsideMenuList);
