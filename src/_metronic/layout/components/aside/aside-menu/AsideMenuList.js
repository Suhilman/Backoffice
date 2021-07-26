/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import inventoryIcon from "../../../../../images/icons8-in-inventory-96.png"
import productIcon from "../../../../../images/icons8-exclusive-product-60.png"
import dashboardIcon from "../../../../../images/icons8-dashboard-52.png"
import reportIcon from "../../../../../images/icons8-business-report-96.png"
import kitchenIcon from "../../../../../images/icons8-kitchen-room-48.png"
import outletIcon from "../../../../../images/icons8-store-front-96.png"
import promoIcon from "../../../../../images/icons8-voucher-64.png"
import staffIcon from "../../../../../images/icons8-staff-100.png"
import roleIcon from "../../../../../images/icons8-confirm-96.png"
import customerIcon from "../../../../../images/icons8-customer-insight-64.png"
import accountIcon from "../../../../../images/icons8-search-account-256.png"
import commissionIcon from "../../../../../images/icons8-sales-performance-52.png"
import axios from 'axios'

import './style.css'

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
  const [subscriptionPartitionId, setSubscriptionPartitionId] = React.useState(null)

  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  const handleSubscriptionPartitionId = async () => {
    const localData = JSON.parse(localStorage.getItem("user_info"));
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${localData.business_id}`)
    // {{local-api}}/api/v1/subscription-partition-privilege?subscription_partition_id=2
    const resultSubscriptionPrivileges = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription-partition-privilege?subscription_partition_id=${data.data[0].subscription_partition_id}`)
    console.log("resultSubscriptionPrivileges", resultSubscriptionPrivileges)
    setSubscriptionPartitionId(data.data[0].subscription_partition_id)
  }

  React.useEffect(() => {
    handleSubscriptionPartitionId()
  }, [])

  const handleSetPrivileges = () => {
    const localData = JSON.parse(localStorage.getItem("user_info"));
    const privileges = localData?.privileges ? localData.privileges : [];
    const currUser = privileges.length ? "staff" : "owner";
    console.log("privileges", privileges)
    console.log("currUser", currUser)
    setCurrPrivileges(privileges);
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
    console.log("checkDashboard", checkDashboard)
    console.log("checkDashboard", checkDashboard)

    if (checkDashboard) ds.push("view_dashboard");
    if (checkReport) ds.push("view_report");

    if (user === "owner") {
      ds.push("view_dashboard");
      ds.push("view_report");
    }

    console.log("ds", ds)
    setDashboardSections(ds);

    // product sections
    const ps = [...productSections];
    const checkProduct = findPrivilege("product_management");
    const checkInventory = findPrivilege("inventory_management");
    const checkKitchen = findPrivilege("kitchen_management");

    if (checkProduct) ps.push("product_management");
    if (checkInventory) ps.push("inventory_management");
    if (checkKitchen) ps.push("kitchen_management");

    if (user === "owner") {
      ps.push("product_management");
      ps.push("inventory_management");
      ps.push("kitchen_management");
    }

    setProductSections(ps);

    // management sections
    const ms = [...managementSections];
    const checkOutlet = findPrivilege("outlet_management");
    const checkPromo = findPrivilege("promo_management");
    const checkStaff = findPrivilege("staff_management");
    const checkRole = findPrivilege("role_management");
    const checkCustomer = findPrivilege("customer_management");
    const checkCommission = findPrivilege("commission");

    if (checkOutlet) ms.push("outlet_management");
    if (checkPromo) ms.push("promo_management");
    if (checkStaff) ms.push("staff_management");
    if (checkRole) ms.push("role_management");
    if (checkCustomer) ms.push("customer_management");
    if (checkCommission) ms.push("commission");

    if (user === "owner") {
      ms.push("outlet_management");
      ms.push("promo_management");
      ms.push("staff_management");
      ms.push("role_management");
      ms.push("customer_management");
      ms.push("commission");
    }

    setManagementSections(ms);
  };

  React.useEffect(() => {
    handleSetPrivileges();
  }, []);

  React.useEffect(() => {
    processPrivileges();
  }, [currPrivileges]);

  const { t } = useTranslation();

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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Design/Layers.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={dashboardIcon} alt="Icon Dashboard"/>
                      </div>
                      <span className="menu-text">{t("dashboard")}</span>
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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Design/Layers.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={reportIcon} alt="Icon Report"/>
                      </div>
                      <span className="menu-text">{t("report")}</span>
                    </NavLink>
                  </li>
                );
              }
            })
          : ""}

        {productSections.length ? (
          <li className="menu-section" style={{ margin: "0" }}>
            <h4 className="menu-text">{t("products")}</h4>
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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={productIcon} alt="Icon Product"/>
                      </div>
                      <span className="menu-text">{t("product")}</span>
                    </NavLink>
                  </li>
                );
              }

              if (section === "inventory_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/inventory",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/inventory">
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={inventoryIcon} alt="Icon Inventory"/>
                      </div>
                      <span className="menu-text">{t("inventory")}</span>
                    </NavLink>
                  </li>
                );
              }

              if (section === "kitchen_management") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/ingredient-inventory",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/ingredient-inventory">
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={kitchenIcon} alt="Icon Kitchen"/>
                      </div>
                      <span className="menu-text">{t("kitchen")}</span>
                    </NavLink>
                  </li>
                );
              }
            })
          : ""}

        {managementSections.length ? (
          <li className="menu-section" style={{ margin: "0" }}>
            <h4 className="menu-text">{t("managementSettings")}</h4>
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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={outletIcon} alt="Icon Outlet"/>
                      </div>
                      <span className="menu-text">{t("outlet")}</span>
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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={promoIcon} alt="Icon Promo"/>
                      </div>
                      <span className="menu-text">{t("promo")}</span>
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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={staffIcon} alt="Icon Staff"/>
                      </div>
                      <span className="menu-text">{t("staff")}</span>
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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={roleIcon} alt="Icon Role"/>
                      </div>
                      <span className="menu-text">{t("role")}</span>
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
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={customerIcon} alt="Icon Customer"/>
                      </div>
                      <span className="menu-text">{t("customer")}</span>
                    </NavLink>
                  </li>
                );
              }
              if (section === "commission") {
                return (
                  <li
                    key={index}
                    className={`menu-item ${getMenuItemActive(
                      "/commission",
                      false
                    )}`}
                  >
                    <NavLink className="menu-link" to="/commission">
                      {/* <span className="svg-icon menu-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Shopping/Bag2.svg"
                          )}
                        />
                      </span> */}
                      <div className="wrapper-icon">
                        <img src={commissionIcon} alt="Icon Commission"/>
                      </div>
                      <span className="menu-text">{t("Commission")}</span>
                    </NavLink>
                  </li>
                );
              }
            })
          : ""}

        <li className="menu-section" style={{ margin: "0" }}>
          <h4 className="menu-text">{t("accountSetting")}</h4>
        </li>

        <li className={`menu-item ${getMenuItemActive("/account", false)}`}>
          <NavLink className="menu-link" to="/account">
            {/* <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span> */}
            <div className="wrapper-icon">
              <img src={accountIcon} alt="Icon Account"/>
            </div>
            <span className="menu-text">{t("account")}</span>
          </NavLink>
        </li>
      </ul>
    </>
  );
}

const ourWrapperFunction = connect(select);

export default ourWrapperFunction(AsideMenuList);
