import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import { useDropzone } from "react-dropzone";

import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import { useStyles } from "../ProductPage";

import ModalManageVariant from "./ModalManageVariant";
import FormTemplate from "./Form";

export const AddProductPage = () => {
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
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [showManageVariant, setShowManageVariant] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [groupState, setGroupState] = React.useState([false]);

  const [outlet, setOutlet] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [photo, setPhoto] = React.useState("");
  const [tax, setTax] = React.useState("");
  const [type, setType] = React.useState(1);
  const [status, setStatus] = React.useState("active");
  const [description, setDescription] = React.useState("");

  const [productVariant, setProductVariant] = React.useState([
    {
      barcode: "",
      sku: "",
      price: "",
      optionVariants: []
    }
  ]);
  const [optionVariant, setOptionVariant] = React.useState([
    {
      group_name: "",
      variant_name: "",
      name: []
    }
  ]);

  const [photoPreview, setPhotoPreview] = React.useState("");

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProductCategories, setAllProductCategories] = React.useState([]);
  const [allProductTypes, setAllProductTypes] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showModalVariant = () => setShowManageVariant(true);
  const closeModalVariant = () => {
    setProductVariant([
      {
        barcode: "",
        sku: "",
        price: "",
        optionVariants: []
      }
    ]);
    setShowManageVariant(false);
  };

  const getOutlet = async () => {
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProductCategory = async outlet_id => {
    try {
      const headers = {
        "x-outlet": outlet_id
      };
      const productCategory = await axios.get(
        `${API_URL}/api/v1/product-category`,
        { headers }
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

  const handleAddGroupVariant = () => {
    setOptionVariant([
      ...optionVariant,
      {
        group_name: "",
        variant_name: "",
        name: []
      }
    ]);
  };

  const handleRemoveGroupVariant = index => {
    const allVariants = [...optionVariant];
    allVariants.splice(index, 1);

    setOptionVariant(allVariants);
  };

  const handleOptionVariant = e => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;

    const dataGroup = [...optionVariant];

    if (targetName[0] === "group_name") {
      dataGroup[targetName[1]].group_name = targetValue;
    } else {
      dataGroup[targetName[1]].variant_name = targetValue.replace(",", "");
    }

    setOptionVariant(dataGroup);
  };

  const handleOptionVariantBlur = e => {
    if (!e.target.value) {
      return;
    }

    const indexInput = e.target.name.split("-")[1];
    const newGroup = [...groupState];

    if (indexInput === "0") {
      newGroup[indexInput] = true;
    } else {
      newGroup.push(true);
    }

    setGroupState(newGroup);

    const filter = optionVariant.filter((item, index, self) => {
      return (
        index ===
        self.findIndex(
          selfIndex => selfIndex["group_name"] === item["group_name"]
        )
      );
    });

    setOptionVariant(filter);
  };

  // const processDataVariant = data => {
  //   const allGroups = new Set(data.map(item => item.group));
  //
  //   const dataVariant = Array.from(allGroups, item => {
  //     const arr = [];
  //     for (const val of variant) {
  //       if (item === val.group) {
  //         arr.push(val.name);
  //       }
  //     }
  //     return arr;
  //   });
  //
  //   const count = data.reduce((acc, curr) => {
  //     if (typeof acc[curr.group_name] == "undefined") {
  //       acc[curr.group_name] = 1;
  //     } else {
  //       acc[curr.group_name] += 1;
  //     }
  //     return acc;
  //   }, {});
  //
  //   for (var i = 0; i < array.length; i++) {
  //     array[i]
  //   }
  //
  //   const keysSorted = Object.keys(count).sort((a, b) => {
  //     return count[a] - count[b];
  //   });
  //
  //   const highest = keysSorted[keysSorted.length - 1];
  //
  //   const result = data.reduce((acc, curr) => {
  //     if (curr.group_name === highest) {
  //       acc.push([curr.name]);
  //     } else {
  //       acc.forEach(item => item.push(curr.name));
  //     }
  //     return acc;
  //   }, []);
  //
  //   return result;
  // };

  const handleKeyPress = e => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;

    const dataGroup = [...optionVariant];
    const dataVariant = [];

    if (e.key === ",") {
      if (targetValue) {
        dataGroup[targetName[1]].name.push(targetValue);
        dataGroup[targetName[1]].variant_name = "";

        setOptionVariant(dataGroup);

        for (const item of optionVariant) {
          item.name.forEach(val => {
            dataVariant.push({
              barcode: "",
              sku: "",
              price: "",
              group_name: item.group_name,
              name: val
            });
          });
        }
      }
    }

    setProductVariant(dataVariant);
  };

  const handleOnBlur = e => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;

    const dataGroup = [...optionVariant];
    const dataVariant = [...productVariant];

    if (targetValue) {
      dataGroup[targetName[1]].name.push(targetValue);
      dataGroup[targetName[1]].variant_name = "";

      setOptionVariant(dataGroup);

      for (const item of optionVariant) {
        item.name.forEach(val => {
          dataVariant.push({
            barcode: "",
            sku: "",
            price: "",
            optionVariants: { group_name: item.group_name, name: val }
          });
        });
      }
    }

    const newDataVariant = dataVariant.reduce((acc, curr, idx, src) => {
      if (!src.length) {
        return acc;
      }

      acc.push(src[idx]);
      if (acc[idx].group_name !== curr.group_name) {
        for (const item of acc) {
          item.optionVariants = [];
          item.optionVariants.push(curr.name);
        }
      }

      return acc;
    }, []);

    console.log(newDataVariant);

    setProductVariant(dataVariant);
  };

  const handleChangeVariant = e => {
    const targetName = e.target.name.split("-");
    const targetValue = e.target.value;
    const name = targetName[0];
    const index = parseInt(targetName[1]);

    const allData = productVariant;
    allData[index][name] = targetValue;

    setProductVariant(allData);
  };

  const handleSelectOutlet = e => {
    setOutlet(e.target.value);
    getProductCategory(e.target.value);
  };

  const handleChangeName = e => {
    let initial = "";
    const initialEvery = e.target.value.split(" ");
    initialEvery.forEach(item => (initial += item.slice(0, 1)));

    setProductName(e.target.value);
    setSku(initial.toUpperCase());
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
  const handleSelectStatus = () => {
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
    // formData.append("productVariant", JSON.stringify(productVariant));
    formData.append("product_type_id", type);
    formData.append("product_tax_id", tax);
    formData.append("status", status.toLowerCase());

    if (barcode) formData.append("barcode", barcode);
    if (sku) formData.append("sku", sku);
    if (description) formData.append("description", description);
    if (category) formData.append("product_category_id", category);
    if (photo) formData.append("productImage", photo);

    try {
      enableLoading();
      await axios.post(`${API_URL}/api/v1/product`, formData);
      disableLoading();
      closeModalVariant();
      history.push("/product");
    } catch (err) {
      setAlert(err.response.data.message);
      disableLoading();
    }
  };

  React.useEffect(() => {
    getOutlet();
    getProductType();
    getTax();
  }, []);

  return (
    <Row>
      <ModalManageVariant
        showManageVariant={showManageVariant}
        closeModalVariant={closeModalVariant}
        loading={loading}
        productVariant={productVariant}
        optionVariant={optionVariant}
        handleAddGroupVariant={handleAddGroupVariant}
        handleRemoveGroupVariant={handleRemoveGroupVariant}
        handleSave={handleSave}
        handleChangeVariant={handleChangeVariant}
        handleOptionVariant={handleOptionVariant}
        handleKeyPress={handleKeyPress}
        handleOnBlur={handleOnBlur}
        handleOptionVariantBlur={handleOptionVariantBlur}
        groupState={groupState}
        setGroupState={setGroupState}
      />

      <Col>
        <FormTemplate
          validated={validated}
          handleSave={handleSave}
          title="Add Product"
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
          type={type}
          allProductTypes={allProductTypes}
          handleSelectType={handleSelectType}
          showModalVariant={showModalVariant}
        />
      </Col>
    </Row>
  );
};
