import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";

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
  business_type_id: "",
  business_province_id: "",
  business_city_id: "",
  business_location_id: "",
  outlet_location_id: "",
  acceptTerms: false
};

function Registration(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const { t } = useTranslation();
  const RegistrationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      ),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD"
        })
      ),
    phone_number: Yup.string()
      .min(8, `${t("minimum3Symbols")}`)
      .max(13, `${t("maximum50Symbols")}`)
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
    business_type_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseABusinessType")}`),
    business_province_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAProvince")}`),
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
      .required("Please choose an outlet location."),
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
  const [dataFormik, setDataFormik] = useState({})

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
      .required(`${t("pleaseChooseABusinessType")}`),
    business_province_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAProvince")}`),
    business_city_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseACity")}`),
    business_location_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseABusinessLocation ")}`),
    outlet_location_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutletLocation")}`)
  });

  const handleFormikBusiness = async (values, accessToken) => {
    const API_URL = process.env.REACT_APP_API_URL;
      try {
        setAlertModal("");
        const { business_id } = JSON.parse(localStorage.getItem("user_info"));

        const { data } = await axios.get(`${API_URL}/api/v1/outlet`, {
          headers: { Authorization: accessToken }
        });

        const outlet_id = data.data[0].id;

        console.log('ini data outlet', data)
        console.log('ini data outlet_id', outlet_id)

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
          { headers: { Authorization: accessToken } }
        );
        const now = new Date()
        now.setDate(now.getDate()+14)
        const dataSubscription = {
          subscription_type_id: 10,
          expired_date: now,
          status: "active"
        }
        await axios.post(`${API_URL}/api/v1/subscription`,
          dataSubscription,
          { headers: { Authorization: accessToken } }
        )

        await axios.patch(`${API_URL}/api/v1/outlet/${outlet_id}`, outletData, {
          headers: { Authorization: accessToken }
        });
        verifyAccount();
        // disableLoading();
        props.register(accessToken.split(" ")[1]);
      } catch (err) {
        setAlertModal(err.response.data.message);
        disableLoading();
      }
  }

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

        console.log('ini data outlet', data)
        console.log('ini data outlet_id', outlet_id)

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
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formik.touched[fieldname] &&
      !formik.errors[fieldname]
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
      console.log('hellow')
      enableLoading();
      setPhonenumber(values.phone_number.toString());
      setDataFormik(values)
      register(
        values.email,
        values.name,
        values.phone_number.toString(),
        values.password,
        captchaToken
      )
        .then(async ({ data }) => {
          const { owner, accessToken } = data.data;
          setToken(`Bearer ${accessToken}`);
          setVerificationCode(owner.verification_code);

          console.log("ownernye", owner)

          const sendWhatsapp = await axios.get(`${API_URL}/api/v1/send-whatsapp/send-message?phone=${values.phone_number.toString()}&code=${owner.verification_code}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })

          console.log("response send whatsapp ==>", sendWhatsapp)

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

          localStorage.setItem("user_info", JSON.stringify(owner));
          
          if (!owner.is_verified) {
            setSubmitting(false);
            openVerifyModal();
            setSecond(60);
          } else {
            props.login(token);
          }
        })
        .catch((err) => {
          console.log('ini error formik', err)
          setSubmitting(false);
          console.log("err.response", err.response)
          // setStatus(err.response.data.message);
          disableLoading();
        });
    }
  });

  const handleProvince = (e) => {
    if (!e.target.value) {
      return;
    }
    const province_id = e.target.value;
    formik.setFieldValue("business_province_id", province_id);
    formik.setFieldValue("business_city_id", "");
    formik.setFieldValue("business_location_id", "");
    formik.setFieldValue("outlet_location_id", "");
    setAllLocations([]);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  const handleCity = (e) => {
    const city_id = e.target.value;
    formik.setFieldValue("business_city_id", city_id);
    formik.setFieldValue("business_location_id", "");
    formik.setFieldValue("outlet_location_id", "");

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

  useEffect(() => {
    getBusinessTypes()
    getProvinces()
  }, [])

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
      // openBusinessModal();
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
      setAlertModal("");
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account?check=${true}`,
        { code },
        { headers: { Authorization: token } }
      );
      closeVerifyModal();
      handleFormikBusiness(dataFormik, token)
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
            className={`form-control py-5 px-6 ${getInputClasses(
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
            className={`form-control py-5 px-6 ${getInputClasses(
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
            className={`form-control py-5 px-6 ${getInputClasses(
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

        {/* Start business location */}
          <Form.Group>
            {/* <Form.Label>Select Business Type</Form.Label> */}
            <Form.Control
              as="select"
              name="business_type_id"
              {...formik.getFieldProps("business_type_id")}
              className={validationBusiness("business_type_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Business Type
              </option>

              {allBusinessTypes.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formik.touched.business_type_id &&
            formik.errors.business_type_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.business_type_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            {/* <Form.Label>Select Province</Form.Label> */}
            <Form.Control
              as="select"
              name="business_province_id"
              {...formik.getFieldProps("business_province_id")}
              onChange={handleProvince}
              onBlur={handleProvince}
              className={validationBusiness("business_province_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Province
              </option>

              {allProvinces.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formik.touched.business_province_id &&
            formik.errors.business_province_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.business_province_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            {/* <Form.Label>Select City</Form.Label> */}
            <Form.Control
              as="select"
              name="business_city_id"
              {...formik.getFieldProps("business_city_id")}
              onChange={handleCity}
              onBlur={handleCity}
              className={validationBusiness("business_city_id")}
              required
            >
              <option value="" disabled hidden>
                Choose City
              </option>

              {allCities.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formik.touched.business_city_id &&
            formik.errors.business_city_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.business_city_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            {/* <Form.Label>Select Location</Form.Label> */}
            <Form.Control
              as="select"
              name="business_location_id"
              {...formik.getFieldProps("business_location_id")}
              className={validationBusiness("business_location_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Location
              </option>

              {allLocations.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formik.touched.business_location_id &&
            formik.errors.business_location_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.business_location_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            {/* <Form.Label>Select Outlet Location</Form.Label> */}
            <Form.Control
              as="select"
              name="outlet_location_id"
              {...formik.getFieldProps("outlet_location_id")}
              className={validationBusiness("outlet_location_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Outlet Location
              </option>

              {allLocations.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formik.touched.outlet_location_id &&
            formik.errors.outlet_location_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.outlet_location_id}
                </div>
              </div>
            ) : null}
          </Form.Group>
        {/* End business location*/}

        {/* begin: Password */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Password"
            type="password"
            className={`form-control py-5 px-6 ${getInputClasses(
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
            className={`form-control py-5 px-6 ${getInputClasses(
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
