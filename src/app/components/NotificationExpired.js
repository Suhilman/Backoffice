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
    const dateExpired = dataSubscription.data.data[0].expired_date
    const expired_tolerance = dataSubscription.data.data[0].Subscription_Type.expired_tolerance
    const dateNow = new Date()
    const rangeDate = new Date(dateExpired).getDate() - dateNow.getDate()
    setCountExpired(rangeDate)
    console.log("dateExpired=====>", dateExpired)
    console.log("expired_tolerance=====>", expired_tolerance)
    console.log("rangeDate=======>", rangeDate)
    console.log("dateNow + rangeDate ========>", dateNow.getDate() + rangeDate)
    if (rangeDate < 1) {
      history.push('/logout');
      Swal.fire(`Masa tenggang sudah habis`, "", "warning")
    } 
    // else if (expired_tolerance - rangeDate >= expired_tolerance) {
    //   Swal.fire(`Masa tenggang tinggal ${expired_tolerance + rangeDate} hari lagi`, "", "warning")
    // } 
    // else if (rangeDate <= 3) (
    //   Swal.fire(`Masa trial tinggal ${rangeDate} hari lagi`, "", "warning")
    // )
  }
  React.useEffect(() => {
    handleCheckExpired()
  }, [])
  return (
    <div className="wrapper-notification">
      <p>{t("yourBeetPOSTrialWillEndIn")}<span className="text-danger mx-2">{countExpired}</span>{t("day(s)")}</p>
    </div>
  );
}

export default NotificationExpired;
