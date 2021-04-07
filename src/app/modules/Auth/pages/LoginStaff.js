import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { loginStaff } from "../_redux/authCrud";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import ModalVerify from "../components/ModalVerify";
import ModalRegister from "../components/ModalRegister";

const LoginStaff = (props) => {
  const { intl } = props;

  const initialValues = {
    staff_id: "",
    email: "",
    password: ""
  };

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(false);
  const { t } = useTranslation();
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const LoginSchema = Yup.object().shape({
    staff_id: Yup.string()
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required("please input staff_id"),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      ),
    password: Yup.string()
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      )
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      const device = window.navigator.userAgent;

      loginStaff(values.staff_id, values.email, values.password, device)
        .then(({ data }) => {
          const { token, user } = data.data;

          setToken(`Bearer ${token}`);
          localStorage.setItem("user_info", JSON.stringify(user));
          disableLoading();
          props.loginStaff(token, user.privileges);
        })
        .catch((err) => {
          disableLoading();
          setSubmitting(false);
          setStatus(err.response?.data.message || err.message);
        });
    }
  });

  return (
    <>
      <div className="login-form login-signin" id="kt_login_signin_form">
        {/* begin::Head */}
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">Login Staff</h3>
          <p className="text-muted font-weight-bold">
            Enter your owner email, staff id and password
          </p>
        </div>
        {/* end::Head */}

        {/*begin::Form*/}
        <form
          onSubmit={formik.handleSubmit}
          className="form fv-plugins-bootstrap fv-plugins-framework"
        >
          {formik.status ? (
            <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
              <div className="alert-text font-weight-bold">{formik.status}</div>
            </div>
          ) : (
            ""
          )}

          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Staff ID"
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "staff_id"
              )}`}
              name="staff_id"
              {...formik.getFieldProps("staff_id")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>

          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Email"
              type="email"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "email"
              )}`}
              name="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Password"
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>
          <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
            <Link
              to="/auth/forgot-password"
              className="text-dark-50 text-hover-primary my-3 mr-2"
              id="kt_login_forgot"
            >
              <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
            </Link>
            <Link
              to="/auth/login"
              className="text-dark-50 text-hover-primary my-3 mr-2"
              id="kt_login_forgot"
            >
              Owner? Login Here
            </Link>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITE_KEY}
              // onChange={handleCaptcha}
            />
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={formik.isSubmitting}
              className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
            >
              <span>Sign In</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>
        </form>
        {/*end::Form*/}
      </div>
    </>
  );
};

export default injectIntl(connect(null, auth.actions)(LoginStaff));
