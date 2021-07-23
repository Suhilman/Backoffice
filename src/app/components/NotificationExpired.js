import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios'
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";
import ModalPersonal from '../modules/Auth/components/ModalPersonal'

const NotificationExpired = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [countExpired, setCountExpired] = useState(0)
  const [showModalPersonal, setShowModalPersonal] = React.useState(false)

  const openPersonalModal = () => setShowModalPersonal(true)
  const closePersonalModal = () => setShowModalPersonal(false)

  const handleCheckExpired = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const dataSubscription = await axios.get(`${API_URL}/api/v1/subscription`,
      { headers: { Authorization: localStorage.getItem("token") } })
    if (dataSubscription.data.data.length > 0) {
      const dt = new Date()
      const month = dt.getMonth() + 1
      const year = dt.getFullYear()

      const daysInMonth = new Date(year, month, 0).getDate()
      console.log(`satu bulan ada ${daysInMonth} hari`)
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
          const expired = Math.floor(resultMonth2 * daysInMonth +  dateExpired.getDate())
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
            const expired = daysInMonth - dateNow.getDate() + dateExpired.getDate()
            console.log("dateNow", dateNow.getDate())
            console.log("dateExpired", dateExpired.getDate())
            setCountExpired(expired)
          } else {
            const resultMonth = dateExpired.getMonth() - dateNow.getMonth()
            console.log("dateExpired.getMonth()", dateExpired.getMonth())
            console.log("resultMonth", resultMonth)
            console.log("ini ketika kurang dari 1 tahun dan lebih dari 1 bulan", resultMonth )
            const expired = Math.floor(resultMonth * daysInMonth + dateExpired.getDate())
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
        <div className="wrapper-notification d-flex justify-content-between">
          <p>{t("yourBeetPOSTrialWillEndIn")}<span className="text-danger mx-2">{countExpired}</span>{t("day(s)")}</p>
          {/* <div className="badge badge-info" onClick={openPersonalModal} style={{cursor: 'pointer'}}>
            Upgrade
          </div> */}
        </div>
      ) : (<div></div>) }
      {/* <ModalPersonal
        showModalPersonal={showModalPersonal}
        closePersonalModal={closePersonalModal}
      /> */}
    </div>
  );
}

export default NotificationExpired;
