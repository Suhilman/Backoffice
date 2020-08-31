import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";

import ModalVerify from "../components/ModalVerify";
import ModalRegister from "../components/ModalRegister";

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  email: "",
  password: ""
};

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [alertModal, setAlertModal] = useState("");
  const [token, setToken] = useState(false);
  const [second, setSecond] = useState(0);

  const [allBusinessCategories, setAllBusinessCategories] = useState([]);
  const [allProvinces, setAllProvinces] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  const [code, setCode] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [outletLocation, setOutletLocation] = useState("");

  const closeVerifyModal = () => setShowVerifyModal(false);
  const openVerifyModal = () => setShowVerifyModal(true);
  const handleVerifyModal = e => setCode(e.target.value);

  React.useEffect(() => {
    let timer;
    if (showVerifyModal && second > 0) {
      timer = setTimeout(function() {
        setSecond(now => now - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  });

  const handleResendCode = () => {
    setSecond(60);
  };

  const closeBusinessModal = () => setShowBusinessModal(false);
  const openBusinessModal = () => {
    getBusinessCategories();
    getProvinces();
    setShowBusinessModal(true);
  };
  const handleBusiness = e => setBusinessCategory(e.target.value);
  const handleProvince = e => {
    setProvince(e.target.value);
    getProvinceById(e.target.value);
  };
  const handleCity = e => {
    setCity(e.target.value);
    getCityById(e.target.value);
  };
  const handleLocation = e => setLocation(e.target.value);
  const handleOutletLocation = e => setOutletLocation(e.target.value);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getBusinessCategories = async () => {
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/business-category`);
      setAllBusinessCategories(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllBusinessCategories([]);
    }
  };

  const getProvinces = async () => {
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllProvinces([]);
    }
  };

  const getProvinceById = async id => {
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/province/${id}`);
      setAllCities(data.data.Cities);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllCities([]);
    }
  };

  const getCityById = async id => {
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/city/${id}`);
      setAllLocations(data.data.Locations);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllLocations([]);
    }
  };

  const verifyAccount = async () => {
    try {
      enableLoading();
      setAlertModal("");
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account`,
        { code },
        { headers: { Authorization: token } }
      );
      disableLoading();
      closeVerifyModal();
      openBusinessModal();
    } catch (err) {
      setAlertModal(err.response.data.message);
      disableLoading();
    }
  };

  const updateBusiness = async () => {
    try {
      enableLoading();
      setAlertModal("");
      const { business_id } = JSON.parse(localStorage.getItem("user_info"));

      const getOutlet = await axios.get(`${API_URL}/api/v1/outlet`, {
        headers: { Authorization: token }
      });

      const outlet_id = getOutlet.data.data[0].id;

      const businessData = {
        business_category_id: businessCategory,
        location_id: location
      };

      const outletData = {
        location_id: location
      };

      await axios.patch(
        `${API_URL}/api/v1/business/${business_id}`,
        businessData,
        { headers: { Authorization: token } }
      );

      await axios.patch(`${API_URL}/api/v1/outlet/${outlet_id}`, outletData, {
        headers: { Authorization: token }
      });

      disableLoading();
      props.register(token.split(" ")[1]);
    } catch (err) {
      setAlertModal(err.response.data.message);
      disableLoading();
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      )
  });

  const getInputClasses = fieldname => {
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
      setTimeout(() => {
        login(values.email, values.password)
          .then(({ data }) => {
            const { token, user } = data.data;
            setToken(`Bearer ${token}`);
            localStorage.setItem("user_info", JSON.stringify(user));

            disableLoading();
            if (!user.is_verified) {
              setSubmitting(false);
              openVerifyModal();
              setSecond(60);
            } else {
              props.login(token);
            }
          })
          .catch(() => {
            disableLoading();
            setSubmitting(false);
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_LOGIN"
              })
            );
          });
      }, 1000);
    }
  });

  return (
    <>
      <ModalVerify
        showVerifyModal={showVerifyModal}
        closeVerifyModal={closeVerifyModal}
        alertModal={alertModal}
        phonenumber={phonenumber}
        handleVerifyModal={handleVerifyModal}
        code={code}
        verifyAccount={verifyAccount}
        loading={loading}
        second={second}
        handleResendCode={handleResendCode}
      />

      <ModalRegister
        showBusinessModal={showBusinessModal}
        closeBusinessModal={closeBusinessModal}
        alertModal={alertModal}
        loading={loading}
        handleBusiness={handleBusiness}
        handleProvince={handleProvince}
        handleCity={handleCity}
        handleLocation={handleLocation}
        handleOutletLocation={handleOutletLocation}
        allBusinessCategories={allBusinessCategories}
        allProvinces={allProvinces}
        allCities={allCities}
        allLocations={allLocations}
        updateBusiness={updateBusiness}
      />

      <div className="login-form login-signin" id="kt_login_signin_form">
        {/* begin::Head */}
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">
            <FormattedMessage id="AUTH.LOGIN.TITLE" />
          </h3>
          <p className="text-muted font-weight-bold">
            Enter your email and password
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
}

export default injectIntl(connect(null, auth.actions)(Login));
