/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { DropdownButton, Dropdown } from "react-bootstrap";
import iconTrash from '../../../../../../src/images/5981684251543238936 5.png'
import axios from 'axios'


import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import { useTranslation } from "react-i18next";
import './style.css'
export function UserProfileDropdown() {
  const [tabs, setTabs] = React.useState(0);
  const [notifStockAlert, setNotifStockAlert] = useState([])
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
  const handleGetNotification = async () => {
    try {
      const result = await axios.get(`${API_URL}/api/v1/business-notification`)
      setNotifStockAlert(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetNotification()
  }, [])
  const chooseLanguages = [
    {
      no: 1,
      key: "id",
      language: "Indonesia"
    },
    {
      no: 2,
      key: "en",
      language: "English"
    }
  ]
  
  const { t, i18n } = useTranslation();

  const changeLanguage = (language, noLanugage) => {
    setTabs(noLanugage);
    i18n.changeLanguage(language)
  };


  const handleDeleteStock = async () => {
    const idStock = []
    notifStockAlert.map(value => {
      idStock.push(value.id)
    })
    if (idStock) {
      idStock.map(async (value) => {
        const result = await axios.delete(`${API_URL}/api/v1/business-notification/${value}`)
        console.log("thenNotification", result.data.data)
        setNotifStockAlert(result.data.data)
      })
    } 
  }

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
        >
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
            Hi,
          </span>
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
            {user.name}
          </span>
          <span className="symbol symbol-35 symbol-light-success">
            <span className="symbol-label font-size-h5 font-weight-bold">
              {user.name.slice(0, 1)}
            </span>
          </span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
        <>
          {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
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

          {!layoutProps.light && (
            <div
              className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
              style={{
                backgroundImage: `url(${toAbsoluteUrl("/media/misc/bg-1.jpg")})`
              }}
            >
              <div className="symbol bg-white-o-15 mr-3">
                <span className="symbol-label text-success font-weight-bold font-size-h4">
                  {user.name.slice(0, 1)}
                </span>
                {/*<img alt="Pic" className="hidden" src={user.pic} />*/}
              </div>
              <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                {user.name}
              </div>
              {/* <span className="label label-success label-lg font-weight-bold label-inline">
                3 messages
              </span> */}
            </div>
          )}
        </>

        <div className="navi navi-spacer-x-0 pt-5">

          {/* Start Notification Email */}

          <div className="low-stock-alert px-8">
            <h5 style={{ fontWeight: 700 }}>Low Stock Alert</h5>
            {notifStockAlert.length > 0 ? (
              <div className="content-notif mt-5">
                  <div className="content-left">
                    {notifStockAlert.map(value =>
                      <p>{value.message}</p>
                    )}
                  </div>
                <div className="content-right">
                  <div className="wrap-image" onClick={handleDeleteStock}>
                    <img src={iconTrash} alt="Icon Trash"/>
                  </div>
                </div>
              </div>
            ) : <div>empty</div> }
          </div>
          <hr/>
          <div className="low-stock-alert px-8">
            <h5 style={{ fontWeight: 700 }}>Transaction Recap At [Nama Outlet]</h5>
            <div className="content-notif mt-5">
              <div className="content-left">
                <p>[tanggalRecap] - [WaktuRecap]</p>
                <p>[Recap By [NamaStaff]]</p>
                <div className="button-download">
                  Download Report
                </div>
              </div>
              <div className="content-right">
                <div className="wrap-image">
                  <img src={iconTrash} alt="Icon Trash"/>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <div className="low-stock-alert px-8">
            <h5 style={{ fontWeight: 700 }}>Weekly Report has been sent</h5>
            <div className="content-notif mt-5">
              <div className="content-left">
                <p>[tanggalKirim] - [WaktuKirim]</p>
                <div className="button-download">
                  Download Report
                </div>
              </div>
              <div className="content-right">
                <div className="wrap-image">
                  <img src={iconTrash} alt="Icon Trash"/>
                </div>
              </div>
            </div>
          </div>

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

          <div className="navi-footer px-8 py-5">
            <Link
              to="/logout"
              className="btn btn-light-primary font-weight-bold"
            >
              {t("signOut")}
            </Link>
            {/* <Dropdown>
              <Dropdown.Toggle variant="light">{t("chooseLanguage")}</Dropdown.Toggle>

              <Dropdown.Menu>
                {chooseLanguages.map(item =>
                  <Dropdown.Item as="button" onClick={() => changeLanguage(item.key)}>{item.language}</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown> */}
            <DropdownButton id="dropdown-basic-button"
            title={ tabs !== 0 ?
              chooseLanguages.find((item) => item.no === parseInt(tabs))
                .language : `${t("chooseLanguage")}`
            }>
            {chooseLanguages.map(item =>
              <Dropdown.Item
                as="button"
                onClick={() => changeLanguage(item.key, item.no)}
                className="selected"
              >
              {item.language}
              </Dropdown.Item>
            )}
            </DropdownButton>
            {/* <a href="#" className="btn btn-clean font-weight-bold">
              Upgrade Plan
            </a> */}
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
