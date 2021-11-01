import React, {useEffect, useState} from 'react'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'
import IconBackoffice from '../../../../../images/logo beetPOS new.png'
import styles from './advancedregister.module.css'
import { useTranslation } from "react-i18next";
import qs from 'qs'
import { useLocation, useHistory } from 'react-router-dom'
import axios from 'axios'

export default function VerifyEmail({location}) {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [session, setSession] = useState("")
  const [code, setCode] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [timeCount, setTimeCount] = useState(false)
  const [second, setSecond] = useState(0);
  const [defaultValue, setDefaultValue] = useState("")

  // const location = useLocation();

  const getCode = async (token) => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/owner/my-id`, 
        { headers: { Authorization: token }} )
      console.log("data.data.verification_code", data.data.verification_code)
      setCode(data.data.verification_code)
    } catch (error) {
      console.log("error getCode", error)
    }
  }

  const resendCode = async () => {
    console.log("resendCode email", email)
    try {
      await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/send-email/verify-otp?email=${email}&verifyCode=${code}`,
        { headers: { Authorization: token } }
      );
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const showHere = () => {
    if(second > 0) {
      return
    } else {
      setShowCode(true)
    }
  }

  const handleFillCode = () => setDefaultValue(code)

  const checkCode = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account`,
        { code },
        { headers: { Authorization: token } }
      );
      history.push(`/register-process/business-location?session=${session}`)
    } catch (err) {
      console.log("error", err.response?.data.message)
    }
  };

  useEffect(() => {
    const email = qs.parse(location.search, { ignoreQueryPrefix: true }).email
    const token = qs.parse(location.search, { ignoreQueryPrefix: true }).session
    setEmail(email)

    // untuk authorization, state
    setToken(`Bearer ${token}`)

    // untuk session di url, state
    setSession(token)

    // Funsgi untuk mendapatkan code verify, bukan state
    getCode(`Bearer ${token}`)
  }, [location])

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
    setTimeout(() => {
      setTimeCount(true)
      setSecond(5)
    }, 5000 )
  }, [])

  useEffect(() => {
    let timer;
    if (second > 0) {
      timer = setTimeout(function() {
        setSecond((now) => now - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  });

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-end">
        <div className={styles.wrapperLogoBeetpos}>
          <img src={IconBackoffice} alt="Icon Backoffice" />
        </div>
      </div>
      
      <div>
        <div className={styles.title}>{t("accountVerification")}</div>
        <div className="my-3">
          <div>{t("enterTheVerificationCodeWeSend")}</div>
          <div>{t("emailTo")} <span className="ml-2 font-weight-bold">{email}</span></div>
        </div>
        {/* Choose Language */}
        {/* <div className="form-group d-flex align-items-end justify-content-between">
          <label className="mr-4" for="exampleFormControlSelect1">{t('language')}</label>
          <select 
            className="form-control" 
            id="exampleFormControlSelect1" 
            onClick={(e) => changeLanguage(e.target.value)}
          >
            {chooseLanguages?.length
              ? chooseLanguages.map((item) => {
                  return (
                    <option 
                      key={item.id} 
                      value={item.key}
                      selected={selectedLanguage == item.key}
                    >
                      {item.language}
                    </option>
                  );
                })
              : ""}
          </select>
        </div> */}
        {/* End Choose Language */}
        <div className="form-group fv-plugins-icon-container mb-4">
          <input
            placeholder={t("pleaseInputVerifyCode")}
            type="code_verification"
            className="form-control h-auto py-3 px-4"
            name="code_verification"
            defaultValue={defaultValue}
          />
        </div>
        <button
          id="kt_login_signin_submit"
          type="submit"
          className="btn btn-primary font-weight-bold btn-block mb-5"
          onClick={checkCode}
        >
          <span>{t("confirm")}</span>
        </button>
        <div>{t("didntReceiveTheVerificationCode")}</div>
        <div className={`${styles.resendCode} text-primary`} onClick={resendCode}>{t("resendVerificationCode")}</div>
        {timeCount ? 
          showCode ? (
            <div className="text-primary" onClick={handleFillCode}>{code}</div>
          ) : (
            <div className={`${styles.resendCode} ${second > 0 ? 'text-muted' : 'text-primary'}`} onClick={showHere}>{t("showHere")}{second > 0 && (<span className="ml-2">{second}</span>)}</div>
          )
        : null }

      </div>
      <div>
        <div className={`${styles.footer} text-muted`}>&copy; 2021 Lifetech</div>
      </div>
    </div>
  )
}
