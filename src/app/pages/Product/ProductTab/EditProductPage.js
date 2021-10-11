import React, { useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import NumberFormat from 'react-number-format';

import ModalManageAddons from "./ModalManageAddons";
import FormTemplate from "./Form";
import dayjs from "dayjs";


export const EditProductPage = ({ match, location }) => {
  const { t } = useTranslation();
  const product_id = match.params.productId;
  const {
    allOutlets,
    allCategories,
    allTaxes,
    allUnit,
    allMaterials,
    currProduct,
    groupAddons,
    showFeature,
  } = location.state;
  const history = useHistory();
  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [allSupplier, setAllSupplier] = React.useState([])
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
  const [defaultWeight, setDefaultWeight] = React.useState("")
  const [syncEcommerce, setSyncEcommerce] = React.useState([])

  const [thereShowSync, setThereShowSync] = React.useState(false)

  const product = {
    outlet_id: currProduct.outlet_id,
    name: currProduct.name,
    product_category_id: currProduct.product_category_id || "",
    price: currProduct.price,
    price_purchase: currProduct.price_purchase || 0,
    mark_up_price: currProduct.mark_up_price,
    max_quantity: currProduct.max_quantity,
    max_range: currProduct.maxRange,
    stock: currProduct.stock,
    product_tax_id: currProduct.product_tax_id,
    status: currProduct.status,
    barcode: currProduct.barcode || "",
    sku: currProduct.sku || "",
    supplier: currProduct.supplier,
    supplier_id: currProduct.supplier_id,
    is_favorite: currProduct.is_favorite,
    has_raw_material: currProduct.has_raw_material,
    raw_material_id: currProduct.raw_material_id,
    has_recipe: currProduct.recipe_id ? true : false,
    has_stock: currProduct.has_stock ? true : false,
    recipe_id: currProduct.recipe_id || "",
    unit_id: currProduct.unit_id || "",
    expired_date: currProduct.expired_date,
    description: currProduct.description || "",
    groupAddons, 
    weight: currProduct.weight < 1 ? currProduct.weight * 1000 : currProduct.weight, 
    length: currProduct.length, 
    width: currProduct.width, 
    height: currProduct.height,
    sync_ecommerce: [],
    has_assembly: currProduct.has_assembly
  };

  const [addonsInitial, setAddonsinitial] = React.useState(groupAddons);

  const ProductSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutletLocation")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character ")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAProductName")}`),
    product_category_id: Yup.number()
      .integer()
      .min(1),
    supplier_id: Yup.number(),
    price: Yup.number()
      .min(1)
      .required(`${t("pleaseInputAPrice")}`),
    price_purchase: Yup.number()
      .required(`${t("pleaseInputAPricePurchase")}`),
    stock: Yup.number()
      .integer()
      .min(0)
      .required(`${t("pleaseInputAStock")}`),
    // product_tax_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required("Please choose a tax."),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required(`${t("pleaseInputAStatus")}`),
    // barcode: Yup.string()
    //   .min(3, `${t("minimum3Character ")}`)
    //   .max(50, `${t("maximum50Character")}`),
    sku: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputSku")}`),
    is_favorite: Yup.boolean().required(),
    has_raw_material: Yup.boolean().required(),
    has_recipe: Yup.boolean().required(),
    has_assembly: Yup.boolean().required(),
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
          .min(3, `${t("minimum3Character ")}`)
          .max(50, `${t("maximum50Character")}`)
          .required(`${t("pleaseInputGroupName")}`),
        group_type: Yup.string()
          .matches(/single|multi/)
          .required(`${t("pleaseInputGroupType")}`),
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
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      console.log("ini data formik edit", values)
      console.log("defaultWeight", defaultWeight)

      const API_URL = process.env.REACT_APP_API_URL;
      const currStock = currProduct.Stocks.find((item) => item.is_initial);

      const formData = new FormData();
      formData.append("outlet_id", values.outlet_id);
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("price_purchase", values.price_purchase);

      formData.append("mark_up_price", values.mark_up_price);
      formData.append("max_quantity", values.max_quantity);
      formData.append("max_range", values.max_range);

      formData.append("stock", values.stock);
      formData.append("supplier", values.supplier || currProduct.supplier);
      formData.append("supplier_id", values.supplier_id || currProduct.supplier_id);
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
      if (photo.name) {
        // console.log('originalFile instanceof File', photo instanceof Blob)
        // const compressedPhoto = await imageCompression(photo, options)
        formData.append("productImage", photo);
      }
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
      if(values.weight) {
        let resultWeight
        if(defaultWeight === 'gram') {
          resultWeight = values.weight / 1000
        } else {
          resultWeight = values.weight
        }
        formData.append("weight", resultWeight);
      }
      if (values.length) formData.append("length", values.length)
      if (values.width) formData.append("width", values.width)
      if (values.height) formData.append("height", values.height)
      formData.append("has_assembly", values.has_assembly)
      formData.append("sync_ecommerce", JSON.stringify(values.sync_ecommerce))

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/product/update-development/${product_id}`, formData);
        disableLoading();
        history.push("/product");
      } catch (err) {
        console.log("error edit product", err.response)
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
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          console.log("reader.result", reader.result)
          setPhotoPreview(reader.result);
        }
      }
      reader.readAsDataURL(file[0])
      img = file[0];
      console.log("img", img)
      setPhoto(img)
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
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

  console.log("optionsOutlet product", optionsOutlet)
  console.log("defaultValueOutlet product", defaultValueOutlet)

  const optionsCategory = allCategories.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueCategory = optionsCategory.find(
    (val) => val.value === formikProduct.values.product_category_id
  );
  const getAllSupplier = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/supplier`)
      setAllSupplier(data.data)
    } catch (error) {
      console.log(error)
    }
  }
  const optionsSupplier = allSupplier.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueSupplier = optionsSupplier.find(
    (val) => val.value === formikProduct.values.supplier_id
  );

  useEffect(() => {
    if(currProduct.weight) {
      if(currProduct.weight < 1) {
        setDefaultWeight("gram")
      } else {
        setDefaultWeight("kg")
      }
    }
    getAllSupplier()
  }, [])
  
  const getSyncEcommerce = async (currProduct) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/outlet/credentials/${currProduct.outlet_id}`)

      const onConnect = []

      if (currProduct.lazada_connect) onConnect.push("lazada_connect")
      if (currProduct.tokopedia_connect) onConnect.push("tokopedia_connect")
      if (currProduct.blibli_connect) onConnect.push("blibli_connect")
      if (currProduct.jdid_connect) onConnect.push("jdid_connect")
      if (currProduct.shopee_connect) onConnect.push("shopee_connect")
      if (currProduct.bukalapak_connect) onConnect.push("bukalapak_connect")
      if (currProduct.zalora_connect) onConnect.push("zalora_connect")

      let temp_boolean;

      onConnect.map(value => {
        data.data.map(value2 => {
          if(value === value2.key) {
            value2.allow = true
          }
          if(value2.show) {
            temp_boolean = true
          }
        })
      })

      setThereShowSync(temp_boolean)
      formikProduct.setFieldValue("sync_ecommerce", data.data);
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    getSyncEcommerce(currProduct)
  }, [currProduct])

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
  const handleSelectWeight = (e) => {
    setDefaultWeight(e.target.value)
  }

  const handleOptionSync = async (outlet_id) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/outlet/credentials/${outlet_id}`)
      formikProduct.setFieldValue("sync_ecommerce", data.data);
      let temp_boolean;
      data.data.map(value => {
        if(value.show) {
          temp_boolean = true
        }
      })

      setThereShowSync(temp_boolean)
      setSyncEcommerce(data.data)
    } catch (error) {
      
    }
  }

  return (
    <Row>
      <ModalManageAddons
        t={t}
        title={`${t("editProductAddonsFor")} - ${formikProduct.values.name}`}
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
          title={t("editProduct")}
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
          optionsSupplier={optionsSupplier}
          defaultValueSupplier={defaultValueSupplier}
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
          showFeature={showFeature}
          handleSelectWeight={handleSelectWeight}
          defaultWeight={defaultWeight}
          handleOptionSync={handleOptionSync}
          syncEcommerce={syncEcommerce}
          thereShowSync={thereShowSync}
        />
      </Col>
    </Row>
  );
};
