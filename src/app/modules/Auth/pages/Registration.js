import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";

import { Modal, Button } from "react-bootstrap";

import ReCAPTCHA from "react-google-recaptcha";

import ModalVerify from "../components/ModalVerify";
import ModalRegister from "../components/ModalRegister";

import * as auth from "../_redux/authRedux";
import { register, cancelRegistration } from "../_redux/authCrud";

const initialValues = {
  name: "",
  email: "",
  phone_number: "",
  password: "",
  changepassword: "",
  acceptTerms: false
};

function Registration(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const RegistrationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      ),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      ),
    phone_number: Yup.string()
      .min(8, "Minimum 3 symbols")
      .max(13, "Maximum 50 symbols")
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
      ),
    changepassword: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      )
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password didn't match"
        )
      }),
    acceptTerms: Yup.bool().required("You must accept the terms and conditions")
  });

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [alertModal, setAlertModal] = useState("");
  const [token, setToken] = useState(false);
  const [second, setSecond] = useState(0);
  const [verificationCode, setVerificationCode] = useState(0);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const [allProvinces, setAllProvinces] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  const [code, setCode] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  const initialValueBusiness = {
    business_type_id: "",
    business_province_id: "",
    business_city_id: "",
    business_location_id: "",
    outlet_location_id: ""
  };

  const BusinessSchema = Yup.object().shape({
    business_type_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a business type."),
    business_province_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a province."),
    business_city_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a city."),
    business_location_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a business location."),
    outlet_location_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose an outlet location.")
  });

  const formikBusiness = useFormik({
    enableReinitialize: true,
    initialValues: initialValueBusiness,
    validationSchema: BusinessSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      try {
        enableLoading();
        setAlertModal("");
        const { business_id } = JSON.parse(localStorage.getItem("user_info"));

        const { data } = await axios.get(`${API_URL}/api/v1/outlet`, {
          headers: { Authorization: token }
        });

        const outlet_id = data.data[0].id;

        const businessData = {
          business_type_id: values.business_type_id,
          location_id: values.business_location_id
        };

        const outletData = {
          location_id: values.outlet_location_id
        };

        await axios.patch(
          `${API_URL}/api/v1/business/${business_id}`,
          businessData,
          { headers: { Authorization: token } }
        );

        await axios.patch(`${API_URL}/api/v1/outlet/${outlet_id}`, outletData, {
          headers: { Authorization: token }
        });

        verifyAccount();
        disableLoading();
        props.register(token.split(" ")[1]);
      } catch (err) {
        setAlertModal(err.response.data.message);
        disableLoading();
      }
    }
  });

  const validationBusiness = (fieldname) => {
    if (formikBusiness.touched[fieldname] && formikBusiness.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikBusiness.touched[fieldname] &&
      !formikBusiness.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const closeVerifyModal = () => setShowVerifyModal(false);
  const openVerifyModal = () => setShowVerifyModal(true);
  const handleVerifyModal = (e) => setCode(e.target.value);

  const handleCaptcha = (value) => setCaptchaToken(value);

  React.useEffect(() => {
    let timer;
    if (showVerifyModal && second > 0) {
      timer = setTimeout(function() {
        setSecond((now) => now - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  });

  const closeBusinessModal = () => setShowBusinessModal(false);
  const openBusinessModal = () => {
    getBusinessTypes();
    getProvinces();
    setShowBusinessModal(true);
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleResendCode = () => {
    setSecond(60);
  };

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
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setPhonenumber(values.phone_number.toString());
      register(
        values.email,
        values.name,
        values.phone_number.toString(),
        values.password,
        captchaToken
      )
        .then(({ data }) => {
          const { owner, accessToken } = data.data;

          setToken(`Bearer ${accessToken}`);
          setVerificationCode(owner.verification_code);
          localStorage.setItem("user_info", JSON.stringify(owner));

          disableLoading();
          openVerifyModal();
          setSecond(60);
        })
        .catch((err) => {
          setSubmitting(false);
          setStatus(err.response.data.message);
          disableLoading();
        });
    }
  });

  const handleProvince = (e) => {
    const province_id = e.target.value;
    formikBusiness.setFieldValue("business_province_id", province_id);
    formikBusiness.setFieldValue("business_city_id", "");
    formikBusiness.setFieldValue("business_location_id", "");
    formikBusiness.setFieldValue("outlet_location_id", "");
    setAllLocations([]);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  const handleCity = (e) => {
    const city_id = e.target.value;
    formikBusiness.setFieldValue("business_city_id", city_id);
    formikBusiness.setFieldValue("business_location_id", "");
    formikBusiness.setFieldValue("outlet_location_id", "");

    if (!city_id) return "";

    if (allCities.length) {
      const cities = [...allCities];
      const [locations] = cities
        .filter((item) => item.id === parseInt(city_id))
        .map((item) => item.Locations);
      setAllLocations(locations);
    }
  };

  const getBusinessTypes = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/business-type`);
      setAllBusinessTypes(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllBusinessTypes([]);
    }
  };

  const getProvinces = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllProvinces([]);
    }
  };

  const verifyAccount = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
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

  const rollbackRegist = async () => {
    setCancelLoading(true);
    await cancelRegistration();
    setCancelLoading(false);
    setShowBusinessModal(false);
  };
  const checkCode = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      enableLoading();
      setAlertModal("");
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account?check=${true}`,
        { code },
        { headers: { Authorization: token } }
      );
      disableLoading();
      closeVerifyModal();
      openBusinessModal();
    } catch (err) {
      setAlertModal(err.response?.data.message);
      disableLoading();
    }
  };

  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <ModalVerify
        showVerifyModal={showVerifyModal}
        closeVerifyModal={closeVerifyModal}
        alertModal={alertModal}
        phonenumber={phonenumber}
        handleVerifyModal={handleVerifyModal}
        code={code}
        checkCode={checkCode}
        loading={loading}
        second={second}
        handleResendCode={handleResendCode}
        verification_code={verificationCode}
      />

      <ModalRegister
        showBusinessModal={showBusinessModal}
        closeBusinessModal={closeBusinessModal}
        alertModal={alertModal}
        loading={loading}
        allBusinessTypes={allBusinessTypes}
        allProvinces={allProvinces}
        allCities={allCities}
        allLocations={allLocations}
        formikBusiness={formikBusiness}
        validationBusiness={validationBusiness}
        handleProvince={handleProvince}
        handleCity={handleCity}
        cancel={rollbackRegist}
        cancelLoading={cancelLoading}
      />

      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">Register to BeetPOS</h3>
        <p className="text-muted font-weight-bold">
          Register and get free trial, no pre payment and credit card needed
        </p>
      </div>

      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
        onSubmit={formik.handleSubmit}
      >
        {/* begin: Alert */}
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        {/* end: Alert */}

        {/* begin: Fullname */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Business Name"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "name"
            )}`}
            name="name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.name}</div>
            </div>
          ) : null}
        </div>
        {/* end: Fullname */}

        {/* begin: Email */}
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
        {/* end: Email */}

        {/* begin: Phone number */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Phone number"
            type="number"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "phone_number"
            )}`}
            name="phone_number"
            {...formik.getFieldProps("phone_number")}
          />
          {formik.touched.phone_number && formik.errors.phone_number ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.phone_number}</div>
            </div>
          ) : null}
        </div>
        {/* end: Phone number */}

        {/* begin: Password */}
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
        {/* end: Password */}

        {/* begin: Confirm Password */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Confirm Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "changepassword"
            )}`}
            name="changepassword"
            {...formik.getFieldProps("changepassword")}
          />
          {formik.touched.changepassword && formik.errors.changepassword ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.changepassword}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Confirm Password */}

        {/* begin: Terms and Conditions */}
        <div className="form-group">
          <label className="checkbox">
            <input
              type="checkbox"
              name="acceptTerms"
              {...formik.getFieldProps("acceptTerms")}
            />
            I agree the{" "}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">
              Terms & Conditions
            </Link>
            .
            <span />
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.acceptTerms}</div>
            </div>
          ) : null}
        </div>
        {/* end: Terms and Conditions */}
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_SITE_KEY}
          onChange={handleCaptcha}
        />

        <div className="form-group d-flex flex-wrap flex-center">
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.values.acceptTerms}
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
          >
            <span>Submit</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>

          <Link to="/auth/login">
            <button
              type="button"
              className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Registration));
