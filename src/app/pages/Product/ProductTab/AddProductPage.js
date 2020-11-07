import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col } from "react-bootstrap";

import ModalManageAddons from "./ModalManageAddons";
import FormTemplate from "./Form";

export const AddProductPage = () => {
  const history = useHistory();

  const [photo, setPhoto] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [showManageAddons, setShowManageAddons] = React.useState(false);
  const [validatedModal, setValidatedModal] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState("");

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProductCategories, setAllProductCategories] = React.useState([]);
  const [allProductTypes, setAllProductTypes] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);

  const [productAddons, setProductAddons] = React.useState([
    {
      group_name: "",
      group_type: "",
      addons: [
        {
          name: "",
          price: 0,
          status: "active"
        }
      ]
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
      const API_URL = process.env.REACT_APP_API_URL;

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
      if (productAddons[0].group_name)
        formData.append("groupAddons", JSON.stringify(productAddons));

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
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProductCategory = async (outlet_id) => {
    const API_URL = process.env.REACT_APP_API_URL;
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
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const productTypes = await axios.get(`${API_URL}/api/v1/product-type`);
      setAllProductTypes(productTypes.data.data);
    } catch (err) {
      setAllProductTypes([]);
    }
  };

  const getTax = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const taxes = await axios.get(`${API_URL}/api/v1/product-tax`);
      setAllTaxes(taxes.data.data);
    } catch (err) {
      setAllTaxes([]);
    }
  };

  const showModalAddons = () => setShowManageAddons(true);

  const cancelModalAddons = () => {
    setProductAddons([
      {
        group_name: "",
        group_type: "",
        addons: [
          {
            name: "",
            price: 0,
            status: "active"
          }
        ]
      }
    ]);
    setValidatedModal(false);
    setShowManageAddons(false);
  };

  const saveChangesAddons = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    setValidatedModal(true);
    if (form.checkValidity() === false) {
      return;
    } else {
      setValidatedModal(true);
      setShowManageAddons(false);
    }
  };

  const handleAddGroupAddons = () => {
    setProductAddons([
      ...productAddons,
      {
        group_name: "",
        group_type: "",
        addons: [
          {
            name: "",
            price: 0,
            status: "active"
          }
        ]
      }
    ]);
  };

  const handleAddAddons = (index) => {
    const allProductAddons = [...productAddons];
    const currentAllAddons = allProductAddons[index].addons;

    currentAllAddons.push({
      name: "",
      price: 0,
      status: "active"
    });

    setProductAddons(allProductAddons);
  };

  const handleRemoveAddons = (index, valIndex) => {
    const allProductAddons = [...productAddons];
    const currentAllAddons = allProductAddons[index].addons;
    currentAllAddons.splice(valIndex, 1);

    if (!currentAllAddons.length) {
      allProductAddons.splice(index, 1);
    }

    setProductAddons(allProductAddons);
  };

  const handleChangeAddons = (e) => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;
    const name = targetName[0];
    const index = parseInt(targetName[1]);

    const allData = [...productAddons];

    if (name === "addons") {
      const valName = targetName[2];
      const valIndex = parseInt(targetName[3]);

      allData[index][name][valIndex][valName] = targetValue;
    } else {
      allData[index][name] = targetValue;
    }

    setProductAddons(allData);
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
  };

  React.useEffect(() => {
    getOutlet();
    getProductType();
    getTax();
    getProductCategory();
  }, []);

  return (
    <Row>
      <ModalManageAddons
        title={`Add Product Addons for - ${
          formikProduct.getFieldProps("name").value
        }`}
        validatedModal={validatedModal}
        showManageAddons={showManageAddons}
        cancelModalAddons={cancelModalAddons}
        saveChangesAddons={saveChangesAddons}
        productAddons={productAddons}
        handleAddGroupAddons={handleAddGroupAddons}
        handleAddAddons={handleAddAddons}
        handleRemoveAddons={handleRemoveAddons}
        handleChangeAddons={handleChangeAddons}
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
          showModalAddons={showModalAddons}
          formikProduct={formikProduct}
          validationProduct={validationProduct}
          alert={alert}
          handleDeletePhoto={handleDeletePhoto}
        />
      </Col>
    </Row>
  );
};
