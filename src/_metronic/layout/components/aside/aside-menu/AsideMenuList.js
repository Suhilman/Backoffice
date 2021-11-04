/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import inventoryIcon from "../../../../../images/icons8-in-inventory-96.png";
import productIcon from "../../../../../images/icons8-exclusive-product-60.png";
import dashboardIcon from "../../../../../images/icons8-dashboard-52.png";
import reportIcon from "../../../../../images/icons8-business-report-96.png";
import kitchenIcon from "../../../../../images/icons8-kitchen-room-48.png";
import outletIcon from "../../../../../images/icons8-store-front-96.png";
import promoIcon from "../../../../../images/icons8-voucher-64.png";
import staffIcon from "../../../../../images/icons8-staff-100.png";
import roleIcon from "../../../../../images/icons8-confirm-96.png";
import customerIcon from "../../../../../images/icons8-customer-insight-64.png";
import accountIcon from "../../../../../images/icons8-search-account-256.png";
import commissionIcon from "../../../../../images/icons8-sales-performance-52.png";
import subscriptionIcon from "../../../../../images/icons8-subscription-100.png";
import paymentIcon from "../../../../../images/icons8-mobile-payment-90.png";
import paymentSalesChannel from "../../../../../images/icons8-sales-64.png";
import currencyIcon from "../../../../../images/currency-exchange.png";
import aboutIcon from "../../../../../images/icons8-about-500.png";
import axios from "axios";
import ArrowUp from '../../../../../images/arrow-up.png'
import ArrowDown from '../../../../../images/arrow-down.png'
import "./style.css";

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
  const [showDropdownReport, setShowDropdownReport] = React.useState(false)
  const [showDropdownReportSales, setShowDropdownReportSales] = React.useState(false)
  const [showDropdownReportInventory, setShowDropdownInventory] = React.useState(false)
  const [showDropdownReportEmployee, setShowDropdownEmployee] = React.useState(false)

  const [kitchenModul, setKitchenModul] = React.useState("");
  const [showIntegrate, setShowIntegrate] = React.useState(false)

  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  const handleTypeBusiness = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("user_info"));

      let nameKithcenModul;
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/business/${localData.business_id}`
      );
      if (data.data.business_type_id == 1) nameKithcenModul = "assembly";
      if (data.data.business_type_id == 2) nameKithcenModul = "kitchen";
      if (data.data.business_type_id == 3) nameKithcenModul = "assembly";

      console.log("nameKithcenModul", nameKithcenModul);

      setShowIntegrate(data.data.ecommerce_integrate)
      setKitchenModul(nameKithcenModul);

      console.log();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscriptionPartitionId = async () => {
    const localData = JSON.parse(localStorage.getItem("user_info"));
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${localData.business_id}`
    );
    // {{local-api}}/api/v1/subscription-partition-privilege?subscription_partition_id=2
    const resultSubscriptionPrivileges = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/subscription-partition-privilege?subscription_partition_id=${data.data[0].subscription_partition_id}`
    );
    console.log("resultSubscriptionPrivileges", resultSubscriptionPrivileges);
    const resLocalData = resultSubscriptionPrivileges.data.data.map((value) => {
      const tempData = {
        id: value.privilege_id,
        allow: value.allow,
        name: value.Privilege.name
          .toLowerCase()
          .split(" ")
          .join("_"),
        access: value.Privilege.Access.name
      };
      console.log("tempData", tempData);
      return tempData;
    });
    return resLocalData;
  };

  const handleSetPrivileges = async () => {
    const localDataOwner = await handleSubscriptionPartitionId();
    console.log("localDataOwner", localDataOwner);
    const localData = JSON.parse(localStorage.getItem("user_info"));
    console.log("localData user-id", localData.user_id);
    let privileges;
    // const privileges = localData?.privileges ? localData.privileges : localDataOwner;

    if (localData.user_id) {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/staff/${localData.user_id}`
      );
      const rolePrivileges = data.data.User.Role.Role_Privileges;
      const resultPrivileges = rolePrivileges.map((value) => {
        return {
          name: value.Privilege.name
            .toLowerCase()
            .split(" ")
            .join("_"),
          access: value.Privilege.Access.name,
          allow: value.allow
        };
      });
      privileges = resultPrivileges;
      localData.privileges = resultPrivileges;
      console.log("localstorage privilege", localData);
      localStorage.setItem("user_info", JSON.stringify(localData));
      console.log("resultPrivileges", resultPrivileges);
    } else {
      privileges = localDataOwner;
    }

    const currUser = privileges.length ? "staff" : "owner";
    console.log("privileges1", privileges);
    console.log("currUser", currUser);
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

    console.log("productSections", ps);
    setProductSections(ps);

    // management sections
    const ms = [...managementSections];
    const checkOutlet = findPrivilege("outlet_management");
    const checkPromo = findPrivilege("promo_management");
    const checkStaff = findPrivilege("staff_management");
    const checkRole = findPrivilege("role_management");
    const checkCustomer = findPrivilege("customer_management");
    const checkCommission = findPrivilege("commission_management");

    if (checkOutlet) ms.push("outlet_management");
    if (checkPromo) ms.push("promo_management");
    if (checkStaff) ms.push("staff_management");
    if (checkRole) ms.push("role_management");
    if (checkCustomer) ms.push("customer_management");
    if (checkCommission) ms.push("commission_management");

    if (user === "owner") {
      ms.push("outlet_management");
      ms.push("promo_management");
      ms.push("staff_management");
      ms.push("role_management");
      ms.push("customer_management");
      ms.push("commission_management");
    }

    setManagementSections(ms);
  };

  React.useEffect(() => {
    handleSetPrivileges();
    handleTypeBusiness();
  }, []);

  React.useEffect(() => {
    processPrivileges();
  }, [currPrivileges]);

  const { t } = useTranslation();

  const dropdownSalesReport = [
    {
      route: 'category-sales',
      name: 'categorySales'
    },
    {
      route: 'cost-of-gold-sold',
      name: 'cogs'
    },
    {
      route: 'sales-detail',
      name: 'detailSalesPerProduct'
    },
    {
      route: 'discount-sales',
      name: 'discountSales'
    },
    {
      route: 'payment-method',
      name: 'paymentMethod'
    },
    {
      route: 'profit-calculation',
      name: 'profitCalculation'
    },
    {
      route: 'recap',
      name: 'recap'
    },
    {
      route: 'sales-per-hour',
      name: 'salesPerHour'
    },
    {
      route: 'sales-per-product',
      name: 'salesPerProduct'
    },{
      route: 'sales-summary',
      name: 'salesSummary'
    },
    {
      route: 'sales-type',
      name: 'salesType'
    },
    {
      route: 'staff-transaction',
      name: 'staffTransaction'
    },
    {
      route: 'transaction-history',
      name: 'transactionHistory'
    },
    {
      route: 'void-transaction',
      name: 'voidTransaction'
    }
  ]

  const dropdownInventoryReport = [
    {
      route: 'raw-material',
      name: 'rawMaterial'
    },
    {
      route: 'stock-report',
      name: 'stockReport'
    },
  ]

  const dropdownEmployeeReport = [
    {
      route: 'attendance',
      name: 'attendance'
    },
    // {
    //   route: 'commisison-report',
    //   name: 'commissionReport'
    // }
  ]

  const handleDropdownReport = () => setShowDropdownReport(!showDropdownReport)
  const handleDropdownReportSales = () => setShowDropdownReportSales(!showDropdownReportSales)
  const handleDropdownReportInventory = () => setShowDropdownInventory(!showDropdownReportInventory)
  const handleDropdownReportEmployee = () => setShowDropdownEmployee(!showDropdownReportEmployee)

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
                        <img src={dashboardIcon} alt="Icon Dashboard" />
                      </div>
                      <span className="menu-text">{t("dashboard")}</span>
                    </NavLink>
                  </li>
                );
              }

              if (section === "view_report") {
                return (
                  <>
                    <li
                      key={index}
                      className={`menu-item ${getMenuItemActive(
                        "/report",
                        false
                      )}`}
                      aria-haspopup="true"
                    >
                      <div className="menu-link" width="100%" onClick={handleDropdownReport}>
                        <div className="wrapper-icon">
                          <img src={reportIcon} alt="Icon Report" />
                        </div>
                        <div className="handle-between-dropdown-report">
                          <span className="menu-text">{t("report")}</span>
                          {showDropdownReport ? (
                            <img src={ArrowUp} alt="Arrow Up" width={12} height={12}/>
                          ) : (
                            <img src={ArrowDown} alt="Arrow Down" width={12} height={12}/>
                          )}
                        </div>
                      </div>
                      <div className={showDropdownReport ? 'show-dropdown-report' : 'hide-dropdown-report'}>
                        <ul className={`menu-nav ${props.layoutProps.ulClasses}`} style={{ padding: 0 }}>
                          
                          <li key={index} className={`menu-item ${getMenuItemActive("/report",false)}`} aria-haspopup="true">
                            <div className="menu-link d-flex justify-content-between align-items-center" onClick={handleDropdownReportSales}>
                              <span className="dropdown-menu-lv1 menu-text">{t("salesReport")}</span>
                              {showDropdownReportSales ? (
                                <img src={ArrowUp} alt="Arrow Up" width={12} height={12}/>
                              ) : (
                                <img src={ArrowDown} alt="Arrow Down" width={12} height={12}/>
                              )}
                            </div>

                            <div className={showDropdownReportSales ? 'show-dropdown-report-sales' : 'hide-dropdown-report-sales'}>
                              <ul className={`menu-nav ${props.layoutProps.ulClasses}`} style={{ padding: 0 }}>
                                {dropdownSalesReport.map((value, index2) => 
                                  <li key={index2} className={`menu-item ${getMenuItemActive(`/${value.route}`,false)}`}  aria-haspopup="true">
                                    <NavLink className="menu-link" to={`/report/${value.route}`}>
                                      <span className="dropdown-menu-lv2 menu-text">{t(value.name)}</span>
                                    </NavLink>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </li>

                          <li key={index} className={`menu-item ${getMenuItemActive("/report",false)}`}  aria-haspopup="true">
                            <div className="menu-link d-flex justify-content-between align-items-center">
                              <span className="dropdown-menu-lv1 menu-text" onClick={handleDropdownReportInventory}>{t("inventoryReport")}</span>
                              {showDropdownReportInventory ? (
                                <img src={ArrowUp} alt="Arrow Up" width={12} height={12}/>
                              ) : (
                                <img src={ArrowDown} alt="Arrow Down" width={12} height={12}/>
                              )}
                            </div>
                            <div className={showDropdownReportInventory ? 'show-dropdown-report-sales' : 'hide-dropdown-report-sales'}>
                              <ul className={`menu-nav ${props.layoutProps.ulClasses}`} style={{ padding: 0 }}>
                                {dropdownInventoryReport.map((value, index2) => 
                                  <li key={index2} className={`menu-item ${getMenuItemActive(`/${value.route}`,false)}`}  aria-haspopup="true">
                                    <NavLink className="menu-link" to={`/report/${value.route}`}>
                                      <span className="dropdown-menu-lv2 menu-text">{t(value.name)}</span>
                                    </NavLink>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </li>
                          
                          <li key={index} className={`menu-item ${getMenuItemActive("/report",false)}`}  aria-haspopup="true">
                            <div className="menu-link d-flex justify-content-between align-items-center">
                              <span className="dropdown-menu-lv1 menu-text" onClick={handleDropdownReportEmployee}>{t("employeeReport")}</span>
                              {showDropdownReportEmployee ? (
                                <img src={ArrowUp} alt="Arrow Up" width={12} height={12}/>
                              ) : (
                                <img src={ArrowDown} alt="Arrow Down" width={12} height={12}/>
                              )}
                            </div>
                            <div className={showDropdownReportEmployee ? 'show-dropdown-report-sales' : 'hide-dropdown-report-sales'}>
                              <ul className={`menu-nav ${props.layoutProps.ulClasses}`} style={{ padding: 0 }}>
                                {dropdownEmployeeReport.map((value, index2) => 
                                  <li key={index2} className={`menu-item ${getMenuItemActive(`/${value.route}`,false)}`}  aria-haspopup="true">
                                    <NavLink className="menu-link" to={`/report/${value.route}`}>
                                      <span className="dropdown-menu-lv2 menu-text">{t(value.name)}</span>
                                    </NavLink>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </li>
                          
                        </ul>
                      </div>
                    </li>

                    {/* <li
                      key={index}
                      className={`menu-item ${getMenuItemActive(
                        "/report",
                        false
                      )}`}
                      aria-haspopup="true"
                    >
                    <NavLink className="menu-link" to="/report">
                      <div className="wrapper-icon">
                        <img src={reportIcon} alt="Icon Report" />
                      </div>
                      <span className="menu-text">{t("report")}</span>
                    </NavLink>
                    </li> */}
                  </>
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
                        <img src={productIcon} alt="Icon Product" />
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
                        <img src={inventoryIcon} alt="Icon Inventory" />
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
                        <img src={kitchenIcon} alt="Icon Kitchen" />
                      </div>
                      <span className="menu-text">{t(kitchenModul)}</span>
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
                        <img src={outletIcon} alt="Icon Outlet" />
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
                        <img src={promoIcon} alt="Icon Promo" />
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
                        <img src={staffIcon} alt="Icon Staff" />
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
                        <img src={roleIcon} alt="Icon Role" />
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
                        <img src={customerIcon} alt="Icon Customer" />
                      </div>
                      <span className="menu-text">{t("customer")}</span>
                    </NavLink>
                  </li>
                );
              }
              // if (section === "commission_management") {
              //   return (
              //     <li
              //       key={index}
              //       className={`menu-item ${getMenuItemActive(
              //         "/commission",
              //         false
              //       )}`}
              //     >
              //       <NavLink className="menu-link" to="/commission">
              //         {/* <span className="svg-icon menu-icon">
              //           <SVG
              //             src={toAbsoluteUrl(
              //               "/media/svg/icons/Shopping/Bag2.svg"
              //             )}
              //           />
              //         </span> */}
              //         <div className="wrapper-icon">
              //           <img src={commissionIcon} alt="Icon Commission" />
              //         </div>
              //         <span className="menu-text">{t("Commission")}</span>
              //       </NavLink>
              //     </li>
              //   );
              // }
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
              <img src={accountIcon} alt="Icon Account" />
            </div>
            <span className="menu-text">{t("account")}</span>
          </NavLink>
        </li>

        {/* <li className={`menu-item ${getMenuItemActive("/currency", false)}`}>
          <NavLink className="menu-link" to="/currency">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span>
            <div className="wrapper-icon">
              <img src={currencyIcon} alt="Icon Currency" />
            </div>
            <span className="menu-text">{t("currencyConversion")}</span>
          </NavLink>
        </li> */}

        {/* <li className={`menu-item ${getMenuItemActive("/subscription", false)}`}>
          <NavLink className="menu-link" to="/subscription">
            <div className="wrapper-icon">
              <img src={subscriptionIcon} alt="Icon Subscription"/>
            </div>
            <span className="menu-text">{t("subscription")}</span>
          </NavLink>
        </li> */}

        {/* <li className={`menu-item ${getMenuItemActive("/payment", false)}`}>
          <NavLink className="menu-link" to="/payment">
            <div className="wrapper-icon">
              <img src={paymentIcon} alt="Icon Payment" />
            </div>
            <span className="menu-text">{t("payment")}</span>
          </NavLink>
        </li>

        {/* {showIntegrate ? (
          <li className={`menu-item ${getMenuItemActive("/sales-channel", false)}`}>
            <NavLink className="menu-link" to="/sales-channel">
              <div className="wrapper-icon">
                <img src={paymentSalesChannel} alt="Icon Sales Channel" />
              </div>
              <span className="menu-text">{t("salesChannel")}</span>
            </NavLink>
          </li>) 
        : null } */}

        <li className={`menu-item ${getMenuItemActive("/about", false)}`}>
          <NavLink className="menu-link" to="/about">
            <div className="wrapper-icon">
              <img src={aboutIcon} alt="Icon About" />
            </div>
            <span className="menu-text">{t("about")}</span>
          </NavLink>
        </li>
      </ul>
    </>
  );
}

const ourWrapperFunction = connect(select);

export default ourWrapperFunction(AsideMenuList);
