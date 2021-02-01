import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col } from "react-bootstrap";

import ModalManageAddons from "./ModalManageAddons";
import FormTemplate from "./Form";
import dayjs from "dayjs";

export const EditProductPage = ({ match, location }) => {
  const product_id = match.params.productId;
  const {
    allOutlets,
    allCategories,
    allTaxes,
    allUnit,
    allMaterials,
    currProduct,
    groupAddons
  } = location.state;
  const history = useHistory();
  const API_URL = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [photo, setPhoto] = React.useState(
    currProduct.image ? `${API_URL}/${currProduct.image}` : ""
  );
  const [photoPreview, setPhotoPreview] = React.useState(
    currProduct.image ? `${API_URL}/${currProduct.image}` : ""
  );
  const [showManageAddons, setShowManageAddons] = React.useState(false);
  const [deletePhoto, setDeletePhoto] = React.useState(false);

  const currStock = currProduct.Stocks.find((item) => item.is_initial);

  const [expiredDate, setExpiredDate] = React.useState(
    currStock ? new Date(currStock.expired_date) : ""
  );
  const [hasExpiredDate, setHasExpiredDate] = React.useState(
    currStock && currStock.expired_date ? true : false
  );

  const product = {
    outlet_id: currProduct.outlet_id,
    name: currProduct.name,
    product_category_id: currProduct.product_category_id || "",
    price: currProduct.price,
    price_purchase: currProduct.price_purchase || 0,
    stock: currProduct.stock,
    product_tax_id: currProduct.product_tax_id,
    status: currProduct.status,
    barcode: currProduct.barcode || "",
    sku: currProduct.sku || "",
    is_favorite: currProduct.is_favorite,
    has_raw_material: currProduct.has_raw_material,
    raw_material_id: currProduct.raw_material_id,
    has_recipe: currProduct.recipe_id ? true : false,
    has_stock: currProduct.has_stock ? true : false,
    recipe_id: currProduct.recipe_id || "",
    unit_id: currProduct.unit_id || "",
    expired_date: currProduct.expired_date,
    description: currProduct.description || "",
    groupAddons
  };

  const [addonsInitial, setAddonsinitial] = React.useState(groupAddons);

  const ProductSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose an outlet."),
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a product name."),
    product_category_id: Yup.number()
      .integer()
      .min(1),
    price: Yup.number()
      .integer()
      .min(1)
      .required("Please input a price."),
    price_purchase: Yup.number()
      .integer()
      .min(1)
      .required("Please input a price purchase."),
    stock: Yup.number()
      .integer()
      .min(0)
      .required("Please input a stock."),
    // product_tax_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required("Please choose a tax."),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required("Please input a status."),
    barcode: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters."),
    sku: Yup.string()
      .min(1, "Minimum 1 character.")
      .max(50, "Maximum 50 characters.")
      .required("Please input SKU"),
    is_favorite: Yup.boolean().required(),
    has_raw_material: Yup.boolean().required(),
    has_recipe: Yup.boolean().required(),
    has_stock: Yup.boolean().required(),
    recipe_id: Yup.number().nullable(),
    raw_material_id: Yup.number().nullable(),
    unit_id: Yup.string().nullable(),
    expired_date: Yup.string(),
    description: Yup.string().nullable(),
    groupAddons: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        group_name: Yup.string()
          .min(3, "Minimum 3 characters.")
          .max(50, "Maximum 50 characters.")
          .required("Please input group name"),
        group_type: Yup.string()
          .matches(/single|multi/)
          .required("Please input group type"),
        addons: Yup.array().of(
          Yup.object().shape({
            id: Yup.string(),
            name: Yup.string(),
            price: Yup.number().nullable(),
            has_raw_material: Yup.boolean(),
            quantity: Yup.number().nullable(),
            unit_id: Yup.string().nullable(),
            status: Yup.string()
          })
        )
      })
    )
  });

  const formikProduct = useFormik({
    enableReinitialize: true,
    initialValues: product,
    validationSchema: ProductSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      const currStock = currProduct.Stocks.find((item) => item.is_initial);

      const formData = new FormData();
      formData.append("outlet_id", values.outlet_id);
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("price_purchase", values.price_purchase);
      formData.append("stock", values.stock);
      formData.append("is_favorite", values.is_favorite);
      formData.append("has_recipe", values.has_recipe);
      formData.append("has_stock", values.has_stock);
      formData.append("status", values.status);

      if (currStock) {
        formData.append("stock_id", currStock.id);
      }

      if (values.groupAddons)
        formData.append("groupAddons", JSON.stringify(values.groupAddons));
      if (values.barcode) formData.append("barcode", values.barcode);
      if (values.sku) formData.append("sku", values.sku);
      if (values.description)
        formData.append("description", values.description);
      if (values.product_category_id)
        formData.append("product_category_id", values.product_category_id);
      if (photo) formData.append("productImage", photo);
      if (deletePhoto) formData.append("deletePhoto", deletePhoto);

      if (values.has_raw_material)
        formData.append("has_raw_material", values.has_raw_material);
      if (values.raw_material_id)
        formData.append("raw_material_id", values.raw_material_id);

      if (values.unit_id) formData.append("unit_id", values.unit_id);
      if (values.expired_date)
        formData.append("expired_date", values.expired_date);
      if (values.recipe_id) formData.append("recipe_id", values.recipe_id);
      if (values.product_tax_id)
        formData.append("product_tax_id", values.product_tax_id);

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/product/${product_id}`, formData);
        disableLoading();
        history.push("/product");
      } catch (err) {
        setAlert(err.response.data.message);
        disableLoading();
      }
    }
  });

  const validationProduct = (fieldname) => {
    if (formikProduct.touched[fieldname] && formikProduct.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikProduct.touched[fieldname] && !formikProduct.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showModalAddons = () => {
    setShowManageAddons(true);
  };

  const cancelModalAddons = () => {
    formikProduct.setFieldValue("groupAddons", addonsInitial);
    setShowManageAddons(false);
  };

  const saveChangesAddons = (e) => {
    e.preventDefault();
    setAddonsinitial(formikProduct.values.groupAddons);
    setShowManageAddons(false);
  };

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

  const handleDeletePhoto = () => {
    setPhoto("");
    setPhotoPreview("");
    setDeletePhoto(true);
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueOutlet = optionsOutlet.find(
    (val) => val.value === formikProduct.values.outlet_id
  );

  const optionsCategory = allCategories.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueCategory = optionsCategory.find(
    (val) => val.value === formikProduct.values.product_category_id
  );

  const optionsUnit = allUnit.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnit = (key) =>
    optionsUnit.find((val) => val.value === key);

  const optionsMaterial = allMaterials
    .filter((item) => item.outlet_id === formikProduct.values.outlet_id)
    .map((item) => {
      return { value: item.id, label: item.name };
    });
  const defaultValueMaterial = (key) =>
    optionsMaterial.find((val) => val.value === key);

  const handleExpiredDate = (date) => {
    setExpiredDate(date);
    formikProduct.setFieldValue(
      "expired_date",
      dayjs(date).format("YYYY-MM-DD")
    );
  };

  const handleHasExpired = (e) => {
    const { value } = e.target;
    if (value === "false") {
      setHasExpiredDate(true);
      setExpiredDate(new Date());
    } else {
      setHasExpiredDate(false);
      setExpiredDate("");
    }
  };

  return (
    <Row>
      <ModalManageAddons
        title={`Edit Product Addons for - ${formikProduct.values.name}`}
        showManageAddons={showManageAddons}
        cancelModalAddons={cancelModalAddons}
        saveChangesAddons={saveChangesAddons}
        formikProduct={formikProduct}
        optionsMaterial={optionsMaterial}
        optionsUnit={optionsUnit}
        defaultValueMaterial={defaultValueMaterial}
        defaultValueUnit={defaultValueUnit}
      />

      <Col>
        <FormTemplate
          title="Edit Product"
          loading={loading}
          allTaxes={allTaxes}
          alertPhoto={alertPhoto}
          photoPreview={photoPreview}
          photo={photo}
          handlePreviewPhoto={handlePreviewPhoto}
          showModalAddons={showModalAddons}
          formikProduct={formikProduct}
          validationProduct={validationProduct}
          alert={alert}
          handleDeletePhoto={handleDeletePhoto}
          optionsOutlet={optionsOutlet}
          optionsCategory={optionsCategory}
          optionsUnit={optionsUnit}
          defaultValueOutlet={defaultValueOutlet}
          defaultValueCategory={defaultValueCategory}
          defaultValueUnit={defaultValueUnit}
          expiredDate={expiredDate}
          handleExpiredDate={handleExpiredDate}
          hasExpiredDate={hasExpiredDate}
          handleHasExpired={handleHasExpired}
        />
      </Col>
    </Row>
  );
};
