import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col } from "react-bootstrap";

import ModalManageVariant from "./ModalManageVariant";
import FormTemplate from "./Form";

export const AddProductPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory();

  const [photo, setPhoto] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [showManageVariant, setShowManageVariant] = React.useState(false);
  const [validatedModal, setValidatedModal] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState("");

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProductCategories, setAllProductCategories] = React.useState([]);
  const [allProductTypes, setAllProductTypes] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);

  const [productVariant, setProductVariant] = React.useState([
    {
      name: "",
      barcode: "",
      sku: "",
      price: ""
    }
  ]);

  const initialValueProduct = {
    outlet_id: "",
    name: "",
    product_category_id: "",
    price: "",
    product_tax_id: "",
    status: "active",
    barcode: "",
    sku: "",
    product_type_id: 1,
    description: ""
  };

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
    product_tax_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a tax."),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required("Please input a status."),
    barcode: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters."),
    sku: Yup.string()
      .min(1, "Minimum 1 character.")
      .max(50, "Maximum 50 characters."),
    product_type_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a type."),
    description: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
  });

  const formikProduct = useFormik({
    initialValues: initialValueProduct,
    validationSchema: ProductSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("outlet_id", values.outlet_id);
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("product_type_id", values.product_type_id);
      formData.append("product_tax_id", values.product_tax_id);
      formData.append("status", values.status);

      if (values.barcode) formData.append("barcode", values.barcode);
      if (values.sku) formData.append("sku", values.sku);
      if (values.description)
        formData.append("description", values.description);
      if (values.product_category_id)
        formData.append("product_category_id", values.product_category_id);
      if (photo) formData.append("productImage", photo);
      if (productVariant[0].name)
        formData.append("productVariants", JSON.stringify(productVariant));

      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/product`, formData);
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

  const getOutlet = async () => {
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProductCategory = async (outlet_id) => {
    try {
      const productCategory = await axios.get(
        `${API_URL}/api/v1/product-category`
      );
      setAllProductCategories(productCategory.data.data);
    } catch (err) {
      setAllProductCategories([]);
    }
  };

  const getProductType = async () => {
    try {
      const productTypes = await axios.get(`${API_URL}/api/v1/product-type`);
      setAllProductTypes(productTypes.data.data);
    } catch (err) {
      setAllProductTypes([]);
    }
  };

  const getTax = async () => {
    try {
      const taxes = await axios.get(`${API_URL}/api/v1/product-tax`);
      setAllTaxes(taxes.data.data);
    } catch (err) {
      setAllTaxes([]);
    }
  };

  const showModalVariant = () => {
    if (!productVariant[0].name) {
      productVariant[0].barcode = formikProduct.getFieldProps("barcode").value;

      if (formikProduct.getFieldProps("sku").value) {
        productVariant[0].sku = formikProduct.getFieldProps("sku").value + "-1";
      }

      productVariant[0].price = formikProduct.getFieldProps("price").value;

      setProductVariant(productVariant);
    }

    setShowManageVariant(true);
  };

  const cancelModalVariant = () => {
    setProductVariant([
      {
        name: "",
        barcode: "",
        sku: "",
        price: ""
      }
    ]);
    setValidatedModal(false);
    setShowManageVariant(false);
  };

  const saveChangesVariant = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    setValidatedModal(true);
    if (form.checkValidity() === false) {
      return;
    } else {
      setValidatedModal(true);
      setShowManageVariant(false);
    }
  };

  const handleAddVariant = () => {
    let countSku;
    const variants = productVariant;
    const lastIndex = variants.length - 1 < 0 ? 0 : variants.length - 1;

    if (variants[lastIndex].sku) {
      const skuVariant = variants[lastIndex].sku.split("-");
      const number = parseInt(skuVariant[1]);

      countSku = skuVariant[0] + `-${number + 1}`;
    } else {
      countSku = "";
    }

    setProductVariant([
      ...productVariant,
      {
        name: "",
        barcode: "",
        sku: countSku,
        price: formikProduct.getFieldProps("price").value
      }
    ]);
  };

  const handleRemoveVariant = (index) => {
    const allVariants = [...productVariant];
    allVariants.splice(index, 1);

    setProductVariant(allVariants);
  };

  const handleChangeVariant = (e) => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;
    const name = targetName[0];
    const index = parseInt(targetName[1]);

    const allData = [...productVariant];
    allData[index][name] = targetValue;

    setProductVariant(allData);
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

  React.useEffect(() => {
    getOutlet();
    getProductType();
    getTax();
    getProductCategory();
  }, []);

  return (
    <Row>
      <ModalManageVariant
        title={`Add Product Variant - ${
          formikProduct.getFieldProps("name").value
        }`}
        validatedModal={validatedModal}
        showManageVariant={showManageVariant}
        cancelModalVariant={cancelModalVariant}
        saveChangesVariant={saveChangesVariant}
        loading={loading}
        productVariant={productVariant}
        handleAddVariant={handleAddVariant}
        handleRemoveVariant={handleRemoveVariant}
        handleChangeVariant={handleChangeVariant}
      />

      <Col>
        <FormTemplate
          title="Add Product"
          loading={loading}
          allOutlets={allOutlets}
          allProductCategories={allProductCategories}
          allTaxes={allTaxes}
          allProductTypes={allProductTypes}
          alertPhoto={alertPhoto}
          photoPreview={photoPreview}
          photo={photo}
          handlePreviewPhoto={handlePreviewPhoto}
          showModalVariant={showModalVariant}
          formikProduct={formikProduct}
          validationProduct={validationProduct}
        />
      </Col>
    </Row>
  );
};
