import React from 'react'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'
import IconBackoffice from '../../../../../images/logo beetPOS new.png'
import styles from './advancedregister.module.css'
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
  const { t, i18n } = useTranslation();

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
          <div>{t("emailTo")} hnflasting@gmail.com</div>
        </div>
        <div className="form-group fv-plugins-icon-container mb-4">
          <input
            placeholder="Kode Verifikasi"
            type="code_verification"
            className="form-control h-auto py-3 px-4"
            name="code_verification"
          />
        </div>
        <button
          id="kt_login_signin_submit"
          type="submit"
          className="btn btn-primary font-weight-bold btn-block mb-5"
        >
          <span>{t("confirm")}</span>
        </button>
        <div>{t("didntReceiveTheVerificationCode")}</div>
        <div className={`${styles.resendCode} text-primary`}>{t("resendVerificationCode")}</div>
      </div>
      <div>
        <div className={`${styles.footer} text-muted`}>&copy; 2021 Lifetech</div>
      </div>
    </div>
  )
}
