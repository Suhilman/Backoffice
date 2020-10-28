/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive("/report", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/report">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Report</span>
          </NavLink>
        </li>

        <li className="menu-section ">
          <h4 className="menu-text">Products</h4>
        </li>

        <li className={`menu-item ${getMenuItemActive("/product", false)}`}>
          <NavLink className="menu-link" to="/product">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span>
            <span className="menu-text">Product</span>
          </NavLink>
        </li>

        <li className="menu-section ">
          <h4 className="menu-text">Management Settings</h4>
        </li>

        <li className={`menu-item ${getMenuItemActive("/outlet", false)}`}>
          <NavLink className="menu-link" to="/outlet">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span>
            <span className="menu-text">Outlet</span>
          </NavLink>
        </li>

        <li className={`menu-item ${getMenuItemActive("/promo", false)}`}>
          <NavLink className="menu-link" to="/promo">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span>
            <span className="menu-text">Promo</span>
          </NavLink>
        </li>

        <li className={`menu-item ${getMenuItemActive("/staff", false)}`}>
          <NavLink className="menu-link" to="/staff">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span>
            <span className="menu-text">Staff</span>
          </NavLink>
        </li>

        <li className={`menu-item ${getMenuItemActive("/role", false)}`}>
          <NavLink className="menu-link" to="/role">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
            </span>
            <span className="menu-text">Role</span>
          </NavLink>
        </li>

        <li className="menu-section ">
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
