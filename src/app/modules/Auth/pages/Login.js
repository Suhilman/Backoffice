import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import ModalVerify from "../components/ModalVerify";
import ModalRegister from "../components/ModalRegister";

const initialValues = {
  email: "",
  password: ""
};

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [token, setToken] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [alertModal, setAlertModal] = useState("");
  const [second, setSecond] = useState(0);

  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const [allProvinces, setAllProvinces] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const { t } = useTranslation();
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

  const handleResendCode = () => setSecond(60);

  const closeBusinessModal = () => setShowBusinessModal(false);
  const openBusinessModal = () => {
    getBusinessTypes();
    getProvinces();
    setShowBusinessModal(true);
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

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
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/business-type`);
      setAllBusinessTypes(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllBusinessTypes([]);
    }
  };

  const getProvinces = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllProvinces([]);
    }
  };

  const verifyAccount = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
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

  const checkCode = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
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

  const handleCaptcha = (value) => setCaptchaToken(value);

  React.useEffect(() => {
    let timer;
    if (showVerifyModal && second > 0) {
      timer = setTimeout(() => {
        setSecond((now) => now - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  });

  const LoginSchema = Yup.object().shape({
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
      login(values.email, values.password, captchaToken)
        .then(async ({ data }) => {
          const API_URL = process.env.REACT_APP_API_URL;

          const { token, user } = data.data;
          const dataBusiness = await axios.get(`${API_URL}/api/v1/business/${user.business_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          localStorage.setItem("currency", dataBusiness.data.data.Currency.name)
          localStorage.setItem("token", `Bearer ${token}`)
          setToken(`Bearer ${token}`);

          // Handle Check Country || jika diluar indonesia, ketika membuat outlet bisa select addres. Jika luar indonesia select diubah menjadi text

          const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          
          const success = async (pos) =>  {
            try {
              const crd = pos.coords;
              console.log('Your current position is:');
              console.log(`Latitude : ${crd.latitude}`);
              console.log(`Longitude: ${crd.longitude}`);
              console.log(`More or less ${crd.accuracy} meters.`);
              const result = await axios.get(`${API_URL}/api/v1/outlet/get-address?latitude=${parseFloat(crd.latitude)}&longitude=${parseFloat(crd.longitude)}`)
              console.log("country address", result.data.resultAddress.address)
              const checkCountry = result.data.resultAddress.address.includes("Indonesia");
              console.log("true kah", checkCountry)
              if(checkCountry) {
                localStorage.setItem("checkCountry", true);
              } else {
                localStorage.setItem("checkCountry", false);
              }
            } catch (error) {
              console.error(error)
            }
          }
          
          const error = (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
          }
          
          navigator.geolocation.getCurrentPosition(success, error, options)

          // End Check Country

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
        .catch((err) => {
          console.log(err);
          disableLoading();
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN"
            })
          );
        });
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
        checkCode={checkCode}
        loading={loading}
        second={second}
        handleResendCode={handleResendCode}
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
            <Link
              to="/auth/login/staff"
              className="text-dark-50 text-hover-primary my-3 mr-2"
            >
              Staff? Login Here
            </Link>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITE_KEY}
              onChange={handleCaptcha}
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
}

export default injectIntl(connect(null, auth.actions)(Login));
