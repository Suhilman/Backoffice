import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import imageCompression from 'browser-image-compression';

import QuantityTab from "./Tabs/QuantityTab";
import TransactionTab from "./Tabs/TransactionTab";
import XyTab from "./Tabs/XyTab";

export const EditAutomaticPromoPage = ({ match, location }) => {
  const { promoId } = match.params;
  const { promoData, allOutlets, allProducts } = location.state;
  const history = useHistory();

  const [photo, setPhoto] = React.useState(promoData.image || "");
  const [photoPreview, setPhotoPreview] = React.useState(promoData.image || "");
  const [alert, setAlert] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [startDate, setStartDate] = React.useState(
    new Date(promoData.promo_date_start)
  );
  const [endDate, setEndDate] = React.useState(
    new Date(promoData.promo_date_end)
  );
  const [startHour, setStartHour] = React.useState(promoData.promo_hour_start);
  const [endHour, setEndHour] = React.useState(promoData.promo_hour_end);

  const [weekdays, setWeekdays] = React.useState({
    monday: { checked: false },
    tuesday: { checked: false },
    wednesday: { checked: false },
    thursday: { checked: false },
    friday: { checked: false },
    saturday: { checked: false },
    sunday: { checked: false },
    everyday: { checked: false }
  });

  React.useEffect(() => {
    const currWeekdays = { ...weekdays };
    const keysWeekdays = Object.keys(currWeekdays);
    promoData.promo_days.split(",").forEach((item) => {
      currWeekdays[keysWeekdays[item]].checked = !currWeekdays[
        keysWeekdays[item]
      ].checked;
    });
    setWeekdays(currWeekdays);
  }, []);

  // promo time & location
  const valueTimeLocation = {
    name: promoData.name,
    outlet_id: promoData.outlet_id,
    promo_date_start: promoData.promo_date_start,
    promo_date_end: promoData.promo_date_end,
    promo_days: promoData.promo_days,
    promo_hour_start: promoData.promo_hour_start,
    promo_hour_end: promoData.promo_hour_end,
    description_type: promoData.description_type,
    description: promoData.description ? promoData.description : ""
  };

  // quantity
  const initialValuePromoQuantity = {
    ...valueTimeLocation,
    type: promoData.type,
    quantity_product_id: promoData.Automatic_Promo_Quantity?.product_id,
    quantity_type: promoData.Automatic_Promo_Quantity?.type,
    quantity_value: promoData.Automatic_Promo_Quantity?.value,
    quantity_amount: promoData.Automatic_Promo_Quantity?.amount
  };

  // transaction
  const initialValuePromoTransaction = {
    ...valueTimeLocation,
    type: promoData.type,
    transaction_type: promoData.Automatic_Promo_Transaction?.type,
    transaction_value: promoData.Automatic_Promo_Transaction?.value,
    transaction_amount: promoData.Automatic_Promo_Transaction?.amount
  };

  // xy
  const initialValuePromoXY = {
    ...valueTimeLocation,
    type: promoData.type,
    xy_product_x_id: promoData.Automatic_Promo_XY?.Product_X.map(
      (item) => item.product_id
    ),
    xy_product_y_id: promoData.Automatic_Promo_XY?.Product_Y.map(
      (item) => item.product_id
    ),
    xy_amount_x: promoData.Automatic_Promo_XY?.amount_x,
    xy_amount_y: promoData.Automatic_Promo_XY?.amount_y,
    xy_apply_multiply: promoData.Automatic_Promo_XY?.apply_multiply
  };

  // schema
  const valueTimeSchema = {
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a name"),
    outlet_id: Yup.number()
      .min(1)
      .required("Please choose an outlet"),
    description_type: Yup.string()
      .matches(/regulation|how_to_use/)
      .required("Please choose description type"),
    description: Yup.string().min(1, "Minimum 1 character."),
    promo_date_start: Yup.date().required("Please input date start"),
    promo_date_end: Yup.date().required("Please input date end"),
    promo_days: Yup.string()
      .min(1)
      .required("Please choose promo days"),
    promo_hour_start: Yup.string()
      .min(1)
      .required("Please input hour start"),
    promo_hour_end: Yup.string()
      .min(1)
      .required("Please input hour end")
  };

  // quantity
  const PromoQuantitySchema = Yup.object().shape({
    ...valueTimeSchema,
    quantity_product_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a product"),
    quantity_type: Yup.string()
      .matches(/percentage|currency/)
      .required("Please choose a discount type"),
    quantity_value: Yup.number()
      .min(1, "Minimum 1")
      .required("Please input a discount value"),
    quantity_amount: Yup.number()
      .min(1, "Minimum 1")
      .required("Please input a promo amount")
  });

  // transaction
  const PromoTransactionSchema = Yup.object().shape({
    ...valueTimeSchema,
    transaction_type: Yup.string()
      .matches(/percentage|currency/)
      .required("Please choose a discount type"),
    transaction_value: Yup.number()
      .min(1, "Minimum 1")
      .required("Please input a discount value"),
    transaction_amount: Yup.number()
      .min(1, "Minimum 1")
      .required("Please input a promo amount")
  });

  // xy
  const PromoXYSchema = Yup.object().shape({
    ...valueTimeSchema,
    xy_product_x_id: Yup.array()
      .of(Yup.number())
      .required("Please input product x"),
    xy_product_y_id: Yup.array()
      .of(Yup.number())
      .required("Please input product y"),
    xy_amount_x: Yup.number()
      .min(1, "Minimum 1")
      .required("Please input amount x"),
    xy_amount_y: Yup.number()
      .min(1, "Minimum 1")
      .required("Please input amount y"),
    xy_apply_multiply: Yup.boolean()
  });

  const formikPromoQuantity = useFormik({
    initialValues: initialValuePromoQuantity,
    validationSchema: PromoQuantitySchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("outlet_id", values.outlet_id);
      formData.append("description_type", values.description_type);
      formData.append("promo_date_start", values.promo_date_start);
      formData.append("promo_date_end", values.promo_date_end);
      formData.append("promo_days", values.promo_days);
      formData.append("promo_hour_start", values.promo_hour_start);
      formData.append("promo_hour_end", values.promo_hour_end);
      formData.append("quantity_product_id", values.quantity_product_id);
      formData.append("quantity_value", values.quantity_value);
      formData.append("quantity_type", values.quantity_type);
      formData.append("quantity_amount", values.quantity_amount);

      if (values.description) formData.append("description", values.description);
      if (photo && photoPreview) {
        console.log('originalFile instanceof Blob', photo instanceof Blob)
        const compressedPhoto = await imageCompression(photo, options)
        formData.append("automaticPromoImage", compressedPhoto);
      }

      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/automatic-promo/${promoId}`,
          formData
        );
        disableLoading();
        history.push("/promo/automatic-promo");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const formikPromoTransaction = useFormik({
    initialValues: initialValuePromoTransaction,
    validationSchema: PromoTransactionSchema,
    onSubmit: async (values) => {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      const API_URL = process.env.REACT_APP_API_URL;
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("outlet_id", values.outlet_id);
      formData.append("description_type", values.description_type);
      formData.append("promo_date_start", values.promo_date_start);
      formData.append("promo_date_end", values.promo_date_end);
      formData.append("promo_days", values.promo_days);
      formData.append("promo_hour_start", values.promo_hour_start);
      formData.append("promo_hour_end", values.promo_hour_end);
      formData.append("transaction_value", values.transaction_value);
      formData.append("transaction_type", values.transaction_type);
      formData.append("transaction_amount", values.transaction_amount);

      if (values.description)
        formData.append("description", values.description);
      if (photo && photoPreview) {
        console.log('originalFile instanceof Blob', photo instanceof Blob)
        const compressedPhoto = await imageCompression(photo, options)
        formData.append("automaticPromoImage", compressedPhoto);
      }
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/automatic-promo/${promoId}`,
          formData
        );
        disableLoading();
        history.push("/promo/automatic-promo");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const formikPromoXY = useFormik({
    initialValues: initialValuePromoXY,
    validationSchema: PromoXYSchema,
    onSubmit: async (values) => {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      const API_URL = process.env.REACT_APP_API_URL;
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("outlet_id", values.outlet_id);
      formData.append("description_type", values.description_type);
      formData.append("promo_date_start", values.promo_date_start);
      formData.append("promo_date_end", values.promo_date_end);
      formData.append("promo_days", values.promo_days);
      formData.append("promo_hour_start", values.promo_hour_start);
      formData.append("promo_hour_end", values.promo_hour_end);
      formData.append(
        "xy_product_x_id",
        JSON.stringify(values.xy_product_x_id)
      );
      formData.append(
        "xy_product_y_id",
        JSON.stringify(values.xy_product_y_id)
      );
      formData.append("xy_amount_x", values.xy_amount_x);
      formData.append("xy_amount_y", values.xy_amount_y);
      formData.append("xy_apply_multiply", values.xy_apply_multiply);

      if (values.description)
        formData.append("description", values.description);
      if (photo && photoPreview) {
        console.log('originalFile instanceof Blob', photo instanceof Blob)
        const compressedPhoto = await imageCompression(photo, options)
        formData.append("automaticPromoImage", compressedPhoto);
      }

      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/automatic-promo/${promoId}`,
          formData
        );
        disableLoading();
        history.push("/promo/automatic-promo");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationPromoQuantity = (fieldname) => {
    if (
      formikPromoQuantity.touched[fieldname] &&
      formikPromoQuantity.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikPromoQuantity.touched[fieldname] &&
      !formikPromoQuantity.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const validationPromoTransaction = (fieldname) => {
    if (
      formikPromoTransaction.touched[fieldname] &&
      formikPromoTransaction.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikPromoTransaction.touched[fieldname] &&
      !formikPromoTransaction.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const validationPromoXY = (fieldname) => {
    if (formikPromoXY.touched[fieldname] && formikPromoXY.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPromoXY.touched[fieldname] && !formikPromoXY.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handlePreviewPhoto = (file) => {
    setAlertPhoto("");

    let preview;
    let img;

    if (file.length) {
      preview = URL.createObjectURL(file[0]);
      img = file[0];
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }

    setPhotoPreview(preview);
    setPhoto(img);
  };

  const handlePromoStartDate = (date) => {
    setStartDate(date);

    if (promoData.type === "quantity") {
      formikPromoQuantity.setFieldValue(
        "promo_date_start",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (promoData.type === "transaction") {
      formikPromoTransaction.setFieldValue(
        "promo_date_start",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (promoData.type === "xy") {
      formikPromoXY.setFieldValue(
        "promo_date_start",
        dayjs(date).format("YYYY-MM-DD")
      );
    }
  };

  const handlePromoEndDate = (date) => {
    setEndDate(date);

    if (promoData.type === "quantity") {
      formikPromoQuantity.setFieldValue(
        "promo_date_end",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (promoData.type === "transaction") {
      formikPromoTransaction.setFieldValue(
        "promo_date_end",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (promoData.type === "xy") {
      formikPromoXY.setFieldValue(
        "promo_date_end",
        dayjs(date).format("YYYY-MM-DD")
      );
    }
  };

  const handlePromoDays = (e) => {
    const currWeekdays = { ...weekdays };
    const nameWeekdays = Object.keys(currWeekdays);

    const { name } = e.target;

    if (name === "everyday") {
      nameWeekdays
        .filter((item) => item !== "everyday")
        .forEach((item) => (currWeekdays[item].checked = false));
      currWeekdays.everyday.checked = !currWeekdays.everyday.checked;
    } else {
      currWeekdays[name].checked = !currWeekdays[name].checked;
    }

    const checkedWeekdays = nameWeekdays
      .filter((item) => currWeekdays[item].checked)
      .map((item) => item);

    const indexWeekdays = checkedWeekdays.map((item) =>
      nameWeekdays.indexOf(item)
    );

    setWeekdays(currWeekdays);

    if (promoData.type === "quantity") {
      formikPromoQuantity.setFieldValue("promo_days", indexWeekdays.join(","));
    }

    if (promoData.type === "transaction") {
      formikPromoTransaction.setFieldValue(
        "promo_days",
        indexWeekdays.join(",")
      );
    }

    if (promoData.type === "xy") {
      formikPromoXY.setFieldValue("promo_days", indexWeekdays.join(","));
    }
  };

  const handlePromoHour = (e) => {
    const { name, value } = e.target;

    if (name === "promo_hour_start") {
      setStartHour(value);

      if (promoData.type === "quantity") {
        formikPromoQuantity.setFieldValue("promo_hour_start", value);
      }

      if (promoData.type === "transaction") {
        formikPromoTransaction.setFieldValue("promo_hour_start", value);
      }

      if (promoData.type === "xy") {
        formikPromoXY.setFieldValue("promo_hour_start", value);
      }
    } else {
      setEndHour(value);

      if (promoData.type === "quantity") {
        formikPromoQuantity.setFieldValue("promo_hour_end", value);
      }

      if (promoData.type === "transaction") {
        formikPromoTransaction.setFieldValue("promo_hour_end", value);
      }

      if (promoData.type === "xy") {
        formikPromoXY.setFieldValue("promo_hour_end", value);
      }
    }
  };

  const handleSelectX = (value) => {
    if (value) {
      const productXId = value.map((item) => item.value);
      formikPromoXY.setFieldValue("xy_product_x_id", productXId);
    } else {
      formikPromoXY.setFieldValue("xy_product_x_id", []);
    }
  };

  const handleSelectY = (value) => {
    if (value) {
      const productYId = value.map((item) => item.value);
      formikPromoXY.setFieldValue("xy_product_y_id", productYId);
    } else {
      formikPromoXY.setFieldValue("xy_product_y_id", []);
    }
  };

  return (
    <>
      {promoData.type === "quantity" ? (
        <QuantityTab
          title={`Edit Automatic Promo - ${promoData.name}`}
          formikPromo={formikPromoQuantity}
          validationPromo={validationPromoQuantity}
          allProducts={allProducts}
          allOutlets={allOutlets}
          weekdays={weekdays}
          photo={photo}
          photoPreview={photoPreview}
          alert={alert}
          alertPhoto={alertPhoto}
          loading={loading}
          startDate={startDate}
          endDate={endDate}
          startHour={startHour}
          endHour={endHour}
          handlePreviewPhoto={handlePreviewPhoto}
          handlePromoStartDate={handlePromoStartDate}
          handlePromoEndDate={handlePromoEndDate}
          handlePromoDays={handlePromoDays}
          handlePromoHour={handlePromoHour}
          mode="edit"
        />
      ) : (
        ""
      )}

      {promoData.type === "transaction" ? (
        <TransactionTab
          title={`Edit Automatic Promo - ${promoData.name}`}
          formikPromo={formikPromoTransaction}
          validationPromo={validationPromoTransaction}
          allProducts={allProducts}
          allOutlets={allOutlets}
          weekdays={weekdays}
          photo={photo}
          photoPreview={photoPreview}
          alert={alert}
          alertPhoto={alertPhoto}
          loading={loading}
          startDate={startDate}
          endDate={endDate}
          startHour={startHour}
          endHour={endHour}
          handlePreviewPhoto={handlePreviewPhoto}
          handlePromoStartDate={handlePromoStartDate}
          handlePromoEndDate={handlePromoEndDate}
          handlePromoDays={handlePromoDays}
          handlePromoHour={handlePromoHour}
          mode="edit"
        />
      ) : (
        ""
      )}

      {promoData.type === "xy" ? (
        <XyTab
          title={`Edit Automatic Promo - ${promoData.name}`}
          formikPromo={formikPromoXY}
          validationPromo={validationPromoXY}
          allProducts={allProducts}
          allOutlets={allOutlets}
          weekdays={weekdays}
          photo={photo}
          photoPreview={photoPreview}
          alert={alert}
          alertPhoto={alertPhoto}
          loading={loading}
          startDate={startDate}
          endDate={endDate}
          startHour={startHour}
          endHour={endHour}
          handlePreviewPhoto={handlePreviewPhoto}
          handlePromoStartDate={handlePromoStartDate}
          handlePromoEndDate={handlePromoEndDate}
          handlePromoDays={handlePromoDays}
          handlePromoHour={handlePromoHour}
          handleSelectX={handleSelectX}
          handleSelectY={handleSelectY}
          mode="edit"
        />
      ) : (
        ""
      )}
    </>
  );
};
