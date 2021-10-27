import React, { useState, useEffect } from 'react'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'
import IconBackoffice from '../../../../../images/logo beetPOS new.png'
import styles from './advancedregister.module.css'
import axios from "axios";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";
import dayjs from "dayjs";
import { register, cancelRegistration } from "../../_redux/authCrud";

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

export default function LocationBusiness() {
  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL;
  // const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const [expiredApp, setExpiredApp] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("")

  // expired_app
  const handleExpiredApp = () => {
    const dateNow = new Date();
    const dateNowFormat = dayjs(dateNow);
    const dateExpired = dayjs("2021-08-26");
    const resDate = dateExpired.diff(dateNowFormat, "day");
    console.log("resDate", resDate);
    if (resDate < 1) {
      setExpiredApp(true);
    }
  };
  // React.useEffect(() => {
  //   handleExpiredApp()
  // }, [])

  const { t, i18n } = useTranslation();
  const RegistrationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t('pleaseInputABusinessName')}`),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t('pleaseInputEmail')}`),
    phone_number: Yup.string()
      .min(8, `${t("minimum3Symbols")}`)
      .max(20, `${t("maximum50Symbols")}`)
      .required(`${t('pleaseInputAPhoneNumber')}`),
    password: Yup.string()
      .min(8, `${t("minimum8Character")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t('pleaseInputAPassword')}`)
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        t('mustContain8Characters,OneUppercase,OneLowercaseAndOneNumber')
      ),
    changepassword: Yup.string()
    .required(`${t('pleaseInputAPasswordConfirmation')}`)
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          t('passwordAndConfirmPasswordDidntMatch')
        )
      })
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        t('mustContain8Characters,OneUppercase,OneLowercaseAndOneNumber')
      ),
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
      .required(`${t("pleaseChooseABusinessLocation")}`),
    outlet_location_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t('pleaseChooseAnOutletLocation')}`),
    acceptTerms: Yup.bool().required("You must accept the terms and conditions")
  });

  const [dataSentOTP, setDataSentOTP] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
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
  const [dataFormik, setDataFormik] = useState({});
  const [statusWhatsapp, setStatusWhatsapp] = useState(false);
  const [statusEmail, setStatusEmail] = useState(false);
  const [messageNotSent, setMessageNotSent] = React.useState(false);
  const [showModalPersonal, setShowModalPersonal] = React.useState(false);
  const [methodSendOTP, setMethodSendOTP] = React.useState("");

  const [code, setCode] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  const changePhoneNumber = (number) => setPhonenumber(number);
  const changeEmail = (email) => setSentEmail(email);

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
      const userInfo = JSON.parse(localStorage.getItem("user_info"));

      const { data } = await axios.get(`${API_URL}/api/v1/outlet`, {
        headers: { Authorization: accessToken }
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
        `${API_URL}/api/v1/business/${userInfo.business_id}`,
        businessData,
        { headers: { Authorization: accessToken } }
      );
      const now = new Date();
      now.setDate(now.getDate() + 30);
      const dataSubscription = {
        subscription_type_id: 10,
        expired_date: now,
        status: "active"
      };
      await axios.post(`${API_URL}/api/v1/subscription`, dataSubscription, {
        headers: { Authorization: accessToken }
      });

      const resPartition = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`,
        {
          headers: { Authorization: accessToken }
        }
      );

      userInfo.subscription_partition_id =
        resPartition.data.data[0].subscription_partition_id;

      localStorage.setItem("user_info", JSON.stringify(userInfo));

      await axios.patch(`${API_URL}/api/v1/outlet/${outlet_id}`, outletData, {
        headers: { Authorization: accessToken }
      });
      verifyAccount();
      // disableLoading();
      history.push("/login");
      toast.success(`Register success, please login`, {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      // props.register(token.split(" ")[1]);
      // setShowModalPersonal(true)
    } catch (err) {
      setAlertModal(err.response.data.message);
      disableLoading();
    }
  };
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
        // props.register(token.split(" ")[1]);
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

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const closeVerifyModal = () => setShowVerifyModal(false);
  const openVerifyModal = () => setShowVerifyModal(true);
  const handleVerifyModal = (e) => setCode(e.target.value);

  const closeOTPModal = () => setShowOTPModal(false);
  const openOTPModal = () => setShowOTPModal(true);

  const handleCaptcha = (value) => {
    console.log("handle captcha");
    console.log("value handle captcha", value);
    setCaptchaToken(value);
  };

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

  const handleResendCode = (phone, verify_code, email) => {
    if (methodSendOTP === "whatsapp") {
      handleSendWhatsapp(phone, verify_code);
      setSecond(15);
    }
    if (methodSendOTP === "gmail") {
      handleSendEmail(email, verify_code);
      setSecond(15);
    }
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

  const handleMethodSentOTP = async (param) => {
    setMethodSendOTP(param);
    console.log("dataSentOTP", dataSentOTP);
    if (param === "whatsapp") {
      setSecond(15);
      const resSendWhatsapp = await handleSendWhatsapp(
        dataSentOTP.phoneNumber,
        dataSentOTP.verifyCode
      );
      if (resSendWhatsapp) {
        console.log("send message whatsapp success");
        closeOTPModal();
        openVerifyModal();
        setTimeout(() => {
          setMessageNotSent(true);
        }, 50000);
      } else {
        console.log("send message whatsapp failed");
        setMethodSendOTP("gmail");
        setSentEmail(formik.values.email);
        await handleSendEmail(formik.values.email, dataSentOTP.verifyCode);
        closeOTPModal();
        openVerifyModal();
        setTimeout(() => {
          setMessageNotSent(true);
        }, 50000);
        toast.info(
          `Send whatsapp failed, please check your email ${formik.values.email} for verification`,
          {
            position: "top-right",
            autoClose: 15000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          }
        );
      }
    }
    if (param === "gmail") {
      setSentEmail(formik.values.email);
      const resSendEmail = await handleSendEmail(
        formik.values.email,
        dataSentOTP.verifyCode
      );
      if (resSendEmail) {
        closeOTPModal();
        openVerifyModal();
        setTimeout(() => {
          setMessageNotSent(true);
        }, 50000);
        toast.success("Verification code sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      } else {
        setStatusEmail(false);
        toast.info("Verification code not sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        console.log("send email error");
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setPhonenumber(values.phone_number.toString());
      setDataFormik(values);
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

          // Handle Check Country || jika diluar indonesia, ketika membuat outlet bisa select addres. Jika luar indonesia select diubah menjadi text

          const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };

          const success = async (pos) => {
            try {
              const crd = pos.coords;
              // console.log('Your current position is:');
              // console.log(`Latitude : ${crd.latitude}`);
              // console.log(`Longitude: ${crd.longitude}`);
              // console.log(`More or less ${crd.accuracy} meters.`);
              const result = await axios.get(
                `${API_URL}/api/v1/outlet/get-address?latitude=${parseFloat(
                  crd.latitude
                )}&longitude=${parseFloat(crd.longitude)}`
              );
              console.log("country address", result.data.resultAddress.address);
              const checkCountry = result.data.resultAddress.address.includes(
                "Indonesia"
              );
              // console.log("true kah", checkCountry)
              if (checkCountry) {
                localStorage.setItem("checkCountry", true);
              } else {
                localStorage.setItem("checkCountry", false);
              }
            } catch (error) {
              localStorage.setItem("checkCountry", true);
              console.error(error);
            }
          };

          const error = (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
          };

          navigator.geolocation.getCurrentPosition(success, error, options);

          // End Check Country

          localStorage.setItem("user_info", JSON.stringify(owner));

          if (!owner.is_verified) {
            // pilih sent otp via gmail atau whatsapp
            setDataSentOTP({
              phoneNumber: values.phone_number.toString(),
              verifyCode: owner.verification_code
            });
            openOTPModal();
            setSubmitting(false);
            setSecond(15);

            // await handleSendWhatsapp(values.phone_number.toString(), owner.verification_code, accessToken)
            // openVerifyModal();
            // setTimeout(() => {
            //   setMessageNotSent(true)
            // }, 50000);
          } else {
            // props.login(token);
          }
        })
        .catch((err) => {
          // console.log('ini error formik', err)
          setSubmitting(false);
          console.log("err.response", err.response);
          // setStatus(err.response.data.message);
          disableLoading();
        });
    }
  });

  const handleSendWhatsapp = async (phone, verifyCode) => {
    try {
      // const sendWhatsapp = await axios.get(`${API_URL}/api/v1/send-whatsapp/send-message?phone=${phone}&code=${verifyCode}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // })
      // console.log("response send whatsapp ==>", sendWhatsapp)

      const tempSplit = phone.split("");
      console.log("tempSplit", tempSplit);
      if (tempSplit[0] == 0 || tempSplit[0].length == 0) {
        tempSplit[0] = "62";
      } else if (tempSplit[0] == 8) {
        tempSplit.unshift(62);
      }
      const resultPhone = tempSplit.join("");

      console.log("resultPhone", resultPhone);
      const dataSend = {
        message: `
          Verify Code = ${verifyCode}\nPowered By Beetpos
        `,
        phone: resultPhone,
        device: "backoffice_test3"
      };

      // https://nordicapis.com/10-free-to-use-cors-proxies/
      // Menggunakan proxy thinsproxy agar melewati cors origin
      // const sendMessage = await axios.post('https://thingproxy.freeboard.io/fetch/http://139.59.244.237:3001/api/v1/messaging/sendText', dataSend, {
      //   headers: {
      //     "x-api-key" : "EalYHzTieQVwZ83XnrPv"
      //   }
      // })

      // Menggunakan proxy cors-anywhere agar melewati cors origin
      const sendMessage = await axios.post(
        "shttps://cors-anywhere.herokuapp.com/http://139.59.244.237:3001/api/v1/messaging/sendText",
        dataSend,
        {
          headers: {
            "x-api-key": "EalYHzTieQVwZ83XnrPv"
          }
        }
      );

      console.log("sendMessage =========>", sendMessage);

      // status whatsapp untuk cek response server error tidak
      setStatusWhatsapp(true);
      console.log("send whataspp berhasil");
      toast.success("Verification code sent", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return true;
    } catch (error) {
      console.log("send whataspp error");
      console.log(error);

      // status whatsapp untuk cek response server error tidak
      setStatusWhatsapp(false);
      return false;
    }
  };

  const handleSendEmail = async (email, verifyCode) => {
    try {
      await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/send-email/verify-otp?email=${email}&verifyCode=${verifyCode}`,
        { headers: { Authorization: token } }
      );
      setStatusEmail(true);
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

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
    getBusinessTypes();
    getProvinces();
  }, []);

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
      console.log("verify modal");
      disableLoading();
      closeVerifyModal();
      // openBusinessModal();
    } catch (err) {
      setAlertModal(err.response.data.message);
      disableLoading();
    }
  };

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
    // {
    //   no: 3,
    //   key: "cn",
    //   language: "Chinese"
    // }
  ];

  const changeLanguage = (language, noLanugage) => {
    console.log("language", language)
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const currLanguage = localStorage.getItem("i18nextLng")
    setSelectedLanguage(currLanguage)
  }, [])
  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-end">
        <div className={styles.wrapperLogoBeetpos}>
          <img src={IconBackoffice} alt="Icon Backoffice" />
        </div>
      </div>
      <div>
        <div className={styles.title}>Bisnis Information</div>
        
        <label htmlFor="business_name">Business Name</label>
        <div className="form-group fv-plugins-icon-container mb-5">
          <input
            id="business_name"
            placeholder="Business Name"
            type="text"
            className="form-control h-auto py-3 px-4"
            name="code_verification"
          />
        </div>

        <Form.Group>
          <Form.Label>Select Business Type</Form.Label>
          <Form.Control
            as="select"
            name="business_type_id"
            {...formik.getFieldProps("business_type_id")}
            className={validationBusiness("business_type_id")}
            required
          >
            <option value="" disabled hidden>
              {t('chooseABusinessType')}
            </option>

            {allBusinessTypes.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </Form.Control>
          {formik.touched.business_type_id && formik.errors.business_type_id ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.business_type_id}
              </div>
            </div>
          ) : null}
        </Form.Group>

        <Form.Group>
          <Form.Label>Select Province</Form.Label>
          <Form.Control
            as="select"
            name="business_province_id"
            {...formik.getFieldProps("business_province_id")}
            onChange={handleProvince}
            onBlur={handleProvince}
            className={`validationBusiness("business_province_id")`}
            required
          >
            <option value="" disabled hidden>
              {t('chooseAProvince')}
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
          <Form.Label>Select City</Form.Label>
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
              {t('chooseACity')}
            </option>

            {allCities.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </Form.Control>
          {formik.touched.business_city_id && formik.errors.business_city_id ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.business_city_id}
              </div>
            </div>
          ) : null}
        </Form.Group>

        <Form.Group>
          <Form.Label>Select Location</Form.Label>
          <Form.Control
            as="select"
            name="business_location_id"
            {...formik.getFieldProps("business_location_id")}
            className={validationBusiness("business_location_id")}
            required
          >
            <option value="" disabled hidden>
              {t('chooseALocation')}
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
          <Form.Label>Select Outlet Location</Form.Label>
          <Form.Control
            as="select"
            name="outlet_location_id"
            {...formik.getFieldProps("outlet_location_id")}
            className={validationBusiness("outlet_location_id")}
            required
          >
            <option value="" disabled hidden>
              {t('chooseAOutletLocation')}
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
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary font-weight-bold px-9 py-4 mt-3"
          >
            <span>{t('submit')}</span>
          </button>
        </div>
      </div>
      <div>
        <div className={`${styles.footer} text-muted`}>&copy; 2021 Lifetech</div>
      </div>
    </div>
  )
}
