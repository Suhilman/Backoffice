import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios'
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";
const NotificationExpired = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [countExpired, setCountExpired] = useState(0)

  const handleCheckExpired = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const dataSubscription = await axios.get(`${API_URL}/api/v1/subscription`,
      { headers: { Authorization: localStorage.getItem("token") } })
    if (dataSubscription.data.data.length > 0) {
      console.log("dataSubscription", dataSubscription.data.data)
      const userInfo = JSON.parse(localStorage.getItem("user_info"))
      const subscription = dataSubscription.data.data.find(item => {
        return item.business_id === userInfo.business_id
      })
      if (subscription) {
        console.log("data subscription", subscription)
        const getDateExpired = subscription.expired_date
        const expired_tolerance = subscription.Subscription_Type.expired_tolerance
        const dateNow = new Date()
        const dateExpired = new Date(getDateExpired)
        console.log("ini bulan expirednya", dateExpired.getMonth())
        console.log("ini bulan sekarang", dateNow.getMonth())
        console.log("ini hasilnya", dateExpired.getMonth() - dateNow.getMonth())
        let countDate;
        if (dateExpired.getFullYear() - dateNow.getFullYear() > 0) {
          const resultMonth = 12 - dateNow.getMonth()
          const resultMonth2 = dateExpired.getMonth() + resultMonth
          const expired = Math.floor(resultMonth2 * 30.5 +  dateExpired.getDate())
          setCountExpired(expired)
          console.log("ini tahuun | ada berapa hari", expired)
        }
        console.log("Bulan dimulai dari 0 (Januari), 1 (Februari) . . . .")
        if (dateExpired.getFullYear() - dateNow.getFullYear() < 1) {
          if (dateExpired.getMonth() - dateNow.getMonth() <= 0) {
            countDate = dateExpired.getDate() - dateNow.getDate()
            setCountExpired(countDate)
            console.log("Masukk 2")
            console.log("ini hari | ada berapa hari", countDate)
            if (countDate < 1) {
              history.push('/logout');
              Swal.fire(`Masa uji coba sudah habis`, "", "warning")
            }
          } else if (dateExpired.getMonth() - dateNow.getMonth() === 1) {
            const expired = 30 - dateNow.getDate() + dateExpired.getDate()
            console.log("dateNow", dateNow.getDate())
            console.log("dateExpired", dateExpired.getDate())
            console.log("Man Jadda Wajada")
            setCountExpired(expired)
          } else {
            const resultMonth = dateExpired.getMonth() - dateNow.getMonth()
            console.log("dateExpired.getMonth()", dateExpired.getMonth())
            console.log("resultMonth", resultMonth)
            console.log("ini ketika kurang dari 1 tahun dan lebih dari 1 bulan", resultMonth )
            const expired = Math.floor(resultMonth * 30.5 + dateExpired.getDate())
            console.log("ini bulan | ada berapa hari", expired)
            setCountExpired(expired)
          }
        }
      } else {
        console.log(null)
      } 
    }
    // const rangeDate = new Date(dateExpired).getDate() - dateNow.getDate()
    // let rangeMonth = new Date(dateExpired).getMonth() - dateNow.getMonth()
    // if (rangeMonth > 0) {
    //   countDate = Math.floor(rangeMonth * 30.5)
    // }
    // console.log("apaaiini =====>", countDate)
    // setCountExpired(countDate)
    // console.log("dateExpired=====>", new Date(dateExpired).getMonth())
    // console.log("dateNow=====>", dateNow.getFullYear())
    // console.log("rangeDate=======>", rangeDate)
    // console.log("dateNow + rangeDate ========>", dateNow.getDate() + rangeDate)
    // console.log("reange date", rangeDate)
    // if (countDate < 1) {
    //   history.push('/logout');
    //   Swal.fire(`Masa uji coba sudah habis`, "", "warning")
    // }
  }
  React.useEffect(() => {
    handleCheckExpired()
  }, [])
  return (
    <div>
      {countExpired <= 14 && typeof countExpired === "number" ? (
        <div className="wrapper-notification">
          <p>{t("yourBeetPOSTrialWillEndIn")}<span className="text-danger mx-2">{countExpired}</span>{t("day(s)")}</p>
        </div>
      ) : (<div></div>) }
    </div>
  );
}

export default NotificationExpired;
