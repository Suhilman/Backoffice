/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { DropdownButton, Dropdown } from "react-bootstrap";
import iconTrash from "../../../../../../src/images/5981684251543238936 5.png";
import iconNotif from "../../../../../../src/images/icons8-notification.png";
import axios from "axios";
import dayjs from "dayjs";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import { useTranslation } from "react-i18next";
import "./style.css";
export function NotificationDropdown() {
  const [tabs, setTabs] = React.useState(0);
  const [notifStockAlert, setNotifStockAlert] = useState([]);
  const [notifRecapTransaction, setNotifRecapTransaction] = useState([]);
  const [dateReport, setDateReport] = useState([]);
  const [filterWeeklyReport, setFilterWeeklyReport] = useState([]);
  const [filterDailyReport, setFilterDailyReport] = useState([]);
  const [emailNotification, setEmailNotification] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;

  const { user } = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light"
    };
  }, [uiService]);

  const { t } = useTranslation();

  const getNotification = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/notification`)
      setNotifStockAlert(data.data)
    } catch (error) {
      console.log(error)
    }
  } 

  const handleRefreshNotif = async () => await getNotification()

  useState(() => {
    getNotification()
  }, [])

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
      >
        <div
          className={
            "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
          }
          onClick={handleRefreshNotif}
        >
          <img src={iconNotif} alt="Icon Notif" width={20} height={18} />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
        <>
          {layoutProps.light && (
            <>
              <div className="d-flex align-items-center p-8 rounded-top">
                <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                  <img src={toAbsoluteUrl("/media/users/300_21.jpg")} alt="" />
                </div>
                <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
                  {user.name}
                </div>
                <span className="label label-light-success label-lg font-weight-bold label-inline">
                  3 messages
                </span>
              </div>
              <div className="separator separator-solid"></div>
            </>
          )}
        </>

        {notifStockAlert.length > 0 ? (
          <div className="navi navi-spacer-x-0 pt-5 wrapper-popup-notification">
            {/* Start Notification Email */}

            <div className="low-stock-alert px-8">
              {notifStockAlert.length > 0 ? (
                <>
                  <h5 style={{ fontWeight: 700 }}>Low Stock Alert</h5>
                  <hr />
                  <div className="content-notif mt-5">
                    <div className="content-left">
                      {notifStockAlert.map((value) => (
                        <div className="d-flex align-items-center">
                          <p>{value.Product?.name}</p>
                          <p className="text-danger mx-2">{value.Product?.stock}</p>
                          <p>{value.Product.Unit ? value.Product.Unit.name : "unit" }</p>
                        </div>
                      ))}
                    </div>
                    {/* <div className="content-right">
                      <div className="wrap-image">
                        <img src={iconTrash} alt="Icon Trash" />
                      </div>
                    </div> */}
                  </div>
                </>
              ) : // <h5 style={{ fontWeight: 700 }}>Low Stock Alert (empty)</h5>
              null}
            </div>
            {notifRecapTransaction.length > 0 &&
            emailNotification.emailNotification?.rekap_kas ? (
              <>
                <div>
                  <hr />
                  <div className="low-stock-alert px-8">
                    {notifRecapTransaction.map((value) => (
                      <>
                        <h5 className="mt-4" style={{ fontWeight: 700 }}>
                          {value.title}
                        </h5>
                        <div className="content-notif mt-2">
                          <div className="content-left">
                            <p>{value.message}</p>
                          </div>
                          <div className="content-right">
                            <div
                              className="wrap-image"
                            >
                              <img src={iconTrash} alt="Icon Trash" />
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                    <div className="button-download">Download Report</div>
                  </div>
                </div>
              </>
            ) : /* <div className="low-stock-alert px-8">
                    <h5 className="mt-4" style={{ fontWeight: 700 }}>Transaction Recap (empty)</h5>
                  </div> */
            null}
            {filterWeeklyReport.length > 0 &&
            emailNotification.emailNotification?.penjualan_produk_mingguan ? (
              <div>
                <hr />
                <div className="low-stock-alert px-8">
                  <h5 style={{ fontWeight: 700 }}>
                    Weekly Report has been sent
                  </h5>
                  {filterWeeklyReport.map((value) => (
                    <div className="content-notif mt-5">
                      <div className="content-left">
                        <p>
                          {value.createdAt.split("T")[0]} -{" "}
                          {value.createdAt.split("T")[1]}
                        </p>
                      </div>
                      <div className="content-right">
                        <div className="wrap-image">
                          <img src={iconTrash} alt="Icon Trash" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="button-download">Download Report</div>
                </div>
              </div>
            ) : // <div className="low-stock-alert px-8">
            //   <h5 style={{ fontWeight: 700 }}>Weekly Report (empty)</h5>
            // </div>
            null}
            {filterDailyReport.length > 0 &&
            emailNotification.emailNotification?.penjualan_produk_harian ? (
              <div>
                <hr />
                <div className="low-stock-alert px-8">
                  <h5 style={{ fontWeight: 700 }}>
                    Daily Report has been sent
                  </h5>
                  {filterDailyReport.map((value) => (
                    <div className="content-notif mt-5">
                      <div className="content-left">
                        <p>
                          {value.createdAt.split("T")[0]} -{" "}
                          {value.createdAt.split("T")[1]}
                        </p>
                      </div>
                      <div className="content-right">
                        <div className="wrap-image">
                          <img src={iconTrash} alt="Icon Trash" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="button-download">Download Report</div>
                </div>
              </div>
            ) : /* <div className="low-stock-alert px-8">
                    <h5 style={{ fontWeight: 700 }}>Daily Report (empty)</h5>
                  </div> */
            null}
            {/* End Notification Email */}

            {/* <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-calendar-3 text-success"/>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Profile
                        </div>
                        <div className="text-muted">
                          Account settings and more
                          <span className="label label-light-danger label-inline font-weight-bold">update</span>
                        </div>
                      </div>
                    </div>
                  </a>
      
                  <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-mail text-warning"></i>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Messages
                        </div>
                        <div className="text-muted">
                          Inbox and tasks
                        </div>
                      </div>
                    </div>
                  </a>
      
                  <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-rocket-1 text-danger"></i>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Activities
                        </div>
                        <div className="text-muted">
                          Logs and notifications
                        </div>
                      </div>
                    </div>
                  </a>
      
                  <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-hourglass text-primary"></i>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Tasks
                        </div>
                        <div className="text-muted">
                          latest tasks and projects
                        </div>
                      </div>
                    </div>
                  </a> */}
            <div className="navi-separator mt-3"></div>

            {/* navi-footer px-8 py-5 */}
            <div className="">
              {/* backup logout */}
              {/* <Link
                    to="/logout"
                    className="btn btn-light-primary font-weight-bold"
                  >
                    {t("signOut")}
                  </Link> */}

              {/* <Dropdown>
                    <Dropdown.Toggle variant="light">{t("chooseLanguage")}</Dropdown.Toggle>
      
                    <Dropdown.Menu>
                      {chooseLanguages.map(item =>
                        <Dropdown.Item as="button" onClick={() => changeLanguage(item.key)}>{item.language}</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown> */}

              {/* backup choose language */}
              {/* <DropdownButton
                    id="dropdown-basic-button"
                    title={
                      tabs !== 0
                        ? chooseLanguages.find((item) => item.no === parseInt(tabs))
                            .language
                        : `${t("chooseLanguage")}`
                    }
                  >
                    {chooseLanguages.map((item) => (
                      <Dropdown.Item
                        as="button"
                        onClick={() => changeLanguage(item.key, item.no)}
                        className="selected"
                      >
                        {item.language}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton> */}

              {/* <a href="#" className="btn btn-clean font-weight-bold">
                    Upgrade Plan
                  </a> */}
            </div>
          </div>
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
