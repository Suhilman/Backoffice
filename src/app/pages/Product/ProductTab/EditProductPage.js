import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import { useDropzone } from "react-dropzone";

import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import { useStyles } from "../ProductPage";

import ModalEditVariant from "./ModalEditVariant";
import FormTemplate from "./Form";

export const EditProductPage = ({ match }) => {
  const product_id = match.params.productId;

  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [showAddVariant, setShowAddVariant] = React.useState(false);
  const [showEditVariant, setShowEditVariant] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [alertPhoto, setAlertPhoto] = React.useState("");

  const [product, setProduct] = React.useState([]);
  const [productCode, setProductCode] = React.useState("");
  const [outlet, setOutlet] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [photo, setPhoto] = React.useState("");
  const [tax, setTax] = React.useState("");
  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [productVariantId, setProductVariantId] = React.useState("");
  const [productVariant, setProductVariant] = React.useState([
    {
      name: "",
      barcode: "",
      sku: "",
      price: "",
      size: "",
      type: ""
    }
  ]);
  const [addProductVariant, setAddProductVariant] = React.useState([
    {
      name: "",
      barcode: "",
      sku: "",
      price: "",
      size: "",
      type: ""
    }
  ]);
  const [editProductVariant, setEditProductVariant] = React.useState([
    {
      id: "",
      name: "",
      barcode: "",
      sku: "",
      price: "",
      size: "",
      type: ""
    }
  ]);

  const [photoPreview, setPhotoPreview] = React.useState("");

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProductCategories, setAllProductCategories] = React.useState([]);
  const [allProductTypes, setAllProductTypes] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showModalVariant = () => {
    const data = {
      name: productName,
      barcode: barcode,
      sku: sku,
      price: price,
      size: "",
      type: ""
    };
    setProductVariant([data]);
    setShowAddVariant(true);
  };

  const showAddModalVariant = () => setShowAddVariant(true);
  const closeAddModalVariant = () => {
    setAddProductVariant([
      {
        name: "",
        barcode: "",
        sku: "",
        price: "",
        size: "",
        type: ""
      }
    ]);
    setShowAddVariant(false);
  };

  const showEditModalVariant = () => {
    const variantData = product[0].Product_Variants.map(item => {
      return {
        id: item.id,
        name: item.name,
        barcode: item.barcode,
        sku: item.sku,
        price: item.price,
        size: item.size,
        type: item.type
      };
    });

    setEditProductVariant(variantData);
    setShowEditVariant(true);
  };
  const closeEditModalVariant = () => {
    const variantData = product.map(item => {
      for (const item of item.Product_Variants) {
        return {
          id: item.id,
          name: item.name,
          barcode: item.barcode,
          sku: item.sku,
          price: item.price,
          size: item.size,
          type: item.type
        };
      }
    });

    setEditProductVariant(variantData);
    setShowEditVariant(false);
  };

  const getProductById = async () => {
    getOutlet();
    getProductType();
    getTax();

    try {
      const productData = await axios.get(
        `${API_URL}/api/v1/product/${product_id}`
      );
      setProduct([productData.data.data]);
      setOutlet(productData.data.data.outlet_id);
      setProductName(productData.data.data.name);
      setCategory(productData.data.data.product_category_id);
      setTax(productData.data.data.product_tax_id);
      setType(productData.data.data.product_type_id);
      setStatus(productData.data.data.status);
      setDescription(productData.data.data.description || "");
      setPrice(productData.data.data.price);
      setBarcode(productData.data.data.barcode || "");
      setSku(productData.data.data.sku || "");

      if (productData.data.data.image) {
        setPhoto(`${API_URL}${productData.data.data.image}` || "");
      }

      setProductCode(productData.data.data.Product_Variants[0].product_code);

      getProductCategory(productData.data.data.outlet_id);
    } catch (err) {
      console.log(err);
    }
  };

  const getOutlet = async () => {
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProductCategory = async () => {
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

  const handleAddVariant = () => {
    setAddProductVariant([
      ...addProductVariant,
      {
        name: "",
        barcode: "",
        sku: "",
        price: "",
        size: "",
        type: ""
      }
    ]);
  };

  const handleAddChangeVariant = e => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;
    const name = targetName[0];
    const index = parseInt(targetName[1]);

    const allData = addProductVariant;
    allData[index][name] = targetValue;

    setAddProductVariant(allData);
  };

  const handleEditChangeVariant = e => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;
    const name = targetName[0];
    const index = parseInt(targetName[1]);

    const allData = editProductVariant;
    allData[index][name] = targetValue;

    setEditProductVariant(allData);
  };

  const handleSelectOutlet = e => setOutlet(e.target.value);

  const handleChangeName = e => {
    setProductName(e.target.value);
    setProductVariant([
      {
        name: e.target.value,
        barcode: barcode,
        sku: sku,
        price: price,
        size: "",
        type: ""
      }
    ]);
  };
  const handleSelectCategory = e => setCategory(e.target.value);
  const handleChangePrice = e => {
    setPrice(e.target.value);
    setProductVariant([
      {
        name: productName,
        barcode: barcode,
        sku: sku,
        price: e.target.value,
        size: "",
        type: ""
      }
    ]);
  };
  const handleSelectTax = e => setTax(e.target.value);
  const handleSelectStatus = e => {
    if (status === "active") {
      setStatus("inactive");
    } else {
      setStatus("active");
    }
  };
  const handleChangeDescription = e => setDescription(e.target.value);
  const handleChangeBarcode = e => {
    setBarcode(e.target.value);
    setProductVariant([
      {
        name: productName,
        barcode: e.target.value,
        sku: sku,
        price: price,
        size: "",
        type: ""
      }
    ]);
  };
  const handleChangeSku = e => {
    setSku(e.target.value);
    setProductVariant([
      {
        name: productName,
        barcode: barcode,
        sku: e.target.value,
        price: price,
        size: "",
        type: ""
      }
    ]);
  };
  const handleSelectType = e => setType(parseInt(e.target.value));

  const handlePreviewPhoto = file => {
    setAlert("");

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

  const handleSave = async e => {
    const form = e.currentTarget;
    e.preventDefault();
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    const formData = new FormData();
    formData.append("outlet_id", outlet);
    formData.append("name", productName);
    formData.append("price", price);
    // formData.append("productVariant", JSON.stringify(productVariantData));
    formData.append("product_category_id", category);
    formData.append("product_type_id", type);
    formData.append("product_tax_id", tax);
    formData.append("status", status.toLowerCase());

    if (barcode) formData.append("barcode", barcode);
    if (sku) formData.append("sku", sku);
    if (description) formData.append("description", description);
    if (photo) formData.append("productImage", photo);

    try {
      enableLoading();
      await axios.put(`${API_URL}/api/v1/product/${product_id}`, formData);
      disableLoading();
      history.push("/product");
    } catch (err) {
      console.log(err);
      disableLoading();
    }
  };

  const handleAddSave = async () => {
    const addVariantData = {
      product_id,
      product_code: productCode,
      productVariant: addProductVariant
    };

    try {
      enableLoading();
      await axios.post(`${API_URL}/api/v1/product/add-variant`, addVariantData);
      disableLoading();
      closeAddModalVariant();
      history.push("/product");
    } catch (err) {
      console.log(err);
      disableLoading();
    }
  };

  const handleEditSave = async () => {
    const editVariantData = {
      product_id,
      productVariant: editProductVariant
    };

    try {
      enableLoading();
      await axios.put(
        `${API_URL}/api/v1/product/edit-variant`,
        editVariantData
      );
      disableLoading();
      closeEditModalVariant();
      history.push("/product");
    } catch (err) {
      console.log(err);
      disableLoading();
    }
  };

  React.useEffect(() => {
    getProductById();
  }, []);

  return (
    <Row>
      <ModalEditVariant
        showEditVariant={showEditVariant}
        closeEditModalVariant={closeEditModalVariant}
        loading={loading}
        editProductVariant={editProductVariant}
        handleEditSave={handleEditSave}
        handleEditChangeVariant={handleEditChangeVariant}
      />

      <Col>
        <FormTemplate
          validated={validated}
          handleSave={handleSave}
          title="Edit Product"
          loading={loading}
          outlet={outlet}
          handleSelectOutlet={handleSelectOutlet}
          allOutlets={allOutlets}
          productName={productName}
          handleChangeName={handleChangeName}
          category={category}
          handleSelectCategory={handleSelectCategory}
          allProductCategories={allProductCategories}
          price={price}
          handleChangePrice={handleChangePrice}
          tax={tax}
          handleSelectTax={handleSelectTax}
          allTaxes={allTaxes}
          status={status}
          handleSelectStatus={handleSelectStatus}
          description={description}
          handleChangeDescription={handleChangeDescription}
          barcode={barcode}
          handleChangeBarcode={handleChangeBarcode}
          sku={sku}
          handleChangeSku={handleChangeSku}
          alertPhoto={alertPhoto}
          photoPreview={photoPreview}
          photo={photo}
          handlePreviewPhoto={handlePreviewPhoto}
          allProductTypes={allProductTypes}
          type={type}
          handleSelectType={handleSelectType}
          showModalVariant={showModalVariant}
        />
      </Col>
    </Row>
  );
};
