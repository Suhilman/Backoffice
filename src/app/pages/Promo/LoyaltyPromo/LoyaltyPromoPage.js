import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import rupiahFormat from "rupiah-format";
import dayjs from "dayjs";

import { Row, Col, Button, Dropdown } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import { Search, MoreHoriz } from "@material-ui/icons";

import LoyaltyPromoModal from "./LoyaltyPromoModal";
import LoyaltyPromoEditModal from "./LoyaltyPromoEditModal";
import SettingsModal from "./SettingsModal";
import ShowConfirmModal from "../../../components/ConfirmModal";

import "../../style.css";

export const LoyaltyPromoPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);

  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [stateSettings, setStateSettings] = React.useState(false);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");

  const [expiryDate, setExpiryDate] = React.useState(new Date());
  const [typeDate, setTypeDate] = React.useState({
    "with-date": true,
    "no-date": false
  });

  const [loyaltyPromos, setLoyaltyPromos] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]);

  const [selectedProducts, setSelectedProducts] = React.useState([]);

  const initialValuePromo = {
    outlet_id: "",
    loyaltyPromo: []
  };

  const initialValuePromoEdit = {
    outlet_id: "",
    product_id: "",
    point: ""
  };

  const initialValueSettings = {
    id: "",
    status: "inactive",
    registration_bonus_status: "inactive",
    registration_bonus: 0,
    value: 0,
    type: "percentage",
    expiration_date: ""
  };

  const [initSett, setInitSett] = React.useState({
    id: "",
    status: "inactive",
    registration_bonus_status: "inactive",
    registration_bonus: 0,
    value: 0,
    type: "percentage",
    expiration_date: ""
  });

  const PromoSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose outlet."),
    loyaltyPromo: Yup.array().of(
      Yup.object().shape({
        product_id: Yup.number(),
        point: Yup.number()
          .min(1, "Point must be greater than 0")
          .required("Please input a value")
      })
    )
  });

  const PromoEditSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose outlet."),
    product_id: Yup.number(),
    point: Yup.number()
      .min(1, "Point must be greater than 0")
      .required("Please input a value")
  });

  const SettingsSchema = Yup.object().shape({
    status: Yup.string().oneOf(["active", "inactive"]),
    registration_bonus_status: Yup.string().oneOf(["active", "inactive"]),
    registration_bonus: Yup.number().min(0),
    value: Yup.number().min(0),
    type: Yup.string().oneOf(["percentage", "currency"]),
    expiration_date: Yup.string().nullable()
  });

  const formikPromo = useFormik({
    initialValues: initialValuePromo,
    validationSchema: PromoSchema,
    onSubmit: async (values) => {
      const promoData = {
        outlet_id: values.outlet_id,
        loyaltyPromo: values.loyaltyPromo
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.post(`${API_URL}/api/v1/loyalty-promo`, promoData);
        handleRefresh();
        disableLoading();
        closeAddModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationPromo = (fieldname) => {
    if (formikPromo.touched[fieldname] && formikPromo.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPromo.touched[fieldname] && !formikPromo.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formikEditPromo = useFormik({
    initialValues: initialValuePromoEdit,
    validationSchema: PromoEditSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const promoData = {
        outlet_id: values.outlet_id,
        product_id: values.product_id,
        point: values.point
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/loyalty-promo/${values.id}`,
          promoData
        );
        handleRefresh();
        disableLoading();
        closeEditModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationEditPromo = (fieldname) => {
    if (
      formikEditPromo.touched[fieldname] &&
      formikEditPromo.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikEditPromo.touched[fieldname] &&
      !formikEditPromo.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const formikSettings = useFormik({
    initialValues: initialValueSettings,
    validationSchema: SettingsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const settingsData = {
        status: values.status,
        registration_bonus_status: values.registration_bonus_status,
        registration_bonus: values.registration_bonus,
        value: values.value,
        type: values.type
      };

      if (values.expiration_date) {
        settingsData.expiration_date = values.expiration_date;
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/loyalty-promo/settings/${values.id}`,
          settingsData
        );
        handleRefresh();
        disableLoading();
        closeSettingsModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationPromoSettings = (fieldname) => {
    if (formikSettings.touched[fieldname] && formikSettings.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikSettings.touched[fieldname] &&
      !formikSettings.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getLoyaltyPromos = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/loyalty-promo`);
      setLoyaltyPromos(data.data);
    } catch (err) {
      setLoyaltyPromos([]);
    }
  };

  const getSettings = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/loyalty-promo/settings`
      );

      setInitSett({
        id: data.data.id,
        status: data.data.status,
        registration_bonus_status: data.data.registration_bonus_status,
        registration_bonus: data.data.registration_bonus,
        value: data.data.value,
        type: data.data.type,
        expiration_date: data.data.expiration_date
      });
      if (data.data.expiration_date) {
        setExpiryDate(new Date(data.data.expiration_date));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProduct = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product`);
      setAllProducts(data.data);
    } catch (err) {
      setAllProducts([]);
    }
  };

  React.useEffect(() => {
    getLoyaltyPromos();
    getSettings();
  }, [refresh]);

  React.useEffect(() => {
    getOutlets();
    getProduct();
  }, []);

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = loyaltyPromos.map((item) => {
      if (item.product_id === id) {
        if (item.Product.status === "active") {
          item.Product.status = "inactive";
          currentStatus = "inactive";
        } else {
          item.Product.status = "active";
          currentStatus = "active";
        }
      }

      return item;
    });

    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.patch(`${API_URL}/api/v1/product/status/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setLoyaltyPromos(edited);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    // setPhoto("");
    // setPhotoPreview("");
    formikPromo.resetForm();
    setSelectedProducts([]);
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    // const API_URL = process.env.REACT_APP_API_URL;

    formikEditPromo.setValues({
      id: data.id,
      outlet_id: data.outlet_id,
      name: data.name,
      product_id: data.product_id,
      point: data.point
    });
    // if (data.image) {
    //   setPhoto(`${API_URL}${data.image}`);
    //   setPhotoPreview(`${API_URL}${data.image}`);
    // }

    const currPromoProduct = loyaltyPromos.filter(
      (item) => item.outlet_id === data.outlet_id
    );
    const selected = allProducts.filter(
      (item) => !currPromoProduct.find((val) => item.id === val.product_id)
    );
    setSelectedProducts(selected);
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    formikPromo.resetForm();
    setSelectedProducts([]);
    // setPhoto("");
    // setPhotoPreview("");
    setStateEditModal(false);
  };

  const showDeleteModal = (data) => {
    formikPromo.setFieldValue("id", data.id);
    formikPromo.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);
  const showSettingsModal = () => {
    formikSettings.setValues(initSett);
    if (initSett.expiration_date) {
      setTypeDate({
        "with-date": true,
        "no-date": false
      });
    } else {
      setTypeDate({
        "with-date": false,
        "no-date": true
      });
    }
    setStateSettings(true);
  };
  const closeSettingsModal = () => {
    setExpiryDate(new Date());
    formikSettings.resetForm();
    setTypeDate({
      "with-date": true,
      "no-date": false
    });
    setStateSettings(false);
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

  const handleDeletePromo = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const promo_id = formikPromo.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/loyalty-promo/${promo_id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      disableLoading();
    }
  };

  const handleSelectedProducts = (e) => {
    const { value } = e.target;
    const currSelected = [...selectedProducts];
    const currPromo = [...formikPromo.values.loyaltyPromo];

    const currProduct = allProducts.find((item) => item.id === parseInt(value));

    currSelected.push(currProduct);
    setSelectedProducts(currSelected);

    currPromo.push({ product_id: value, point: 0 });
    formikPromo.setFieldValue("loyaltyPromo", currPromo);
  };

  const handleSelectTypeDate = (e) => {
    const { name } = e.target;
    const currType = { ...typeDate };

    if (name === "with-date") {
      currType["with-date"] = true;
      currType["no-date"] = false;
      formikSettings.setFieldValue("expiration_date", expiryDate);
    } else {
      currType["no-date"] = true;
      currType["with-date"] = false;
      formikSettings.setFieldValue("expiration_date", null);
    }

    setTypeDate(currType);
  };

  const handlePromoExpiryDate = (date) => {
    setExpiryDate(date);

    formikSettings.setFieldValue(
      "expiration_date",
      dayjs(date).format("YYYY-MM-DD")
    );
  };

  const dataPromo = () => {
    return loyaltyPromos.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        outlet_id: item.outlet_id,
        outlet_name: item.Outlet.name,
        product_name: item.Product.name,
        product_category: item.Product.Product_Category.name,
        product_price: rupiahFormat.convert(item.Product.price),
        product_id: item.product_id,
        point: item.point,
        product_status: item.Product.status
      };
    });
  };

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Outlet Name",
      selector: "outlet_name",
      sortable: true
    },
    {
      name: "Product",
      selector: "product_name",
      sortable: true
    },
    {
      name: "Product Category",
      selector: "product_category",
      sortable: true
    },
    {
      name: "Product Price",
      selector: "product_price",
      sortable: true
    },
    {
      name: "Point",
      selector: "point"
    },
    {
      name: "Product Status",
      cell: (rows) => {
        return (
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value={rows.product_status}
                control={
                  <Switch
                    color="primary"
                    checked={rows.product_status === "active" ? true : false}
                    onChange={() => handleChangeStatus(rows.product_id)}
                    name=""
                  />
                }
              />
            </FormGroup>
          </FormControl>
        );
      }
    },
    {
      name: "Actions",
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button" onClick={() => showEditModal(rows)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  return (
    <>
      <LoyaltyPromoModal
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title="Add New Product Point"
        loading={loading}
        alert={alert}
        formikPromo={formikPromo}
        validationPromo={validationPromo}
        loyaltyPromos={loyaltyPromos}
        allOutlets={allOutlets}
        allProducts={allProducts}
        selectedProducts={selectedProducts}
        handleSelectedProducts={handleSelectedProducts}
      />

      <LoyaltyPromoEditModal
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title={`Edit Promo`}
        loading={loading}
        alert={alert}
        formikPromo={formikEditPromo}
        validationPromo={validationEditPromo}
        allOutlets={allOutlets}
        allProducts={allProducts}
        selectedProducts={selectedProducts}
        handleSelectedProducts={handleSelectedProducts}
      />

      <SettingsModal
        stateModal={stateSettings}
        cancelModal={closeSettingsModal}
        loading={loading}
        alert={alert}
        formikSettings={formikSettings}
        validationPromoSettings={validationPromoSettings}
        typeDate={typeDate}
        expiryDate={expiryDate}
        handleSelectTypeDate={handleSelectTypeDate}
        handlePromoExpiryDate={handlePromoExpiryDate}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`Delete Promo`}
        body={"Are you sure want to delete?"}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeletePromo}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Loyalty Promo</h3>
              </div>
              <div className="headerEnd">
                <Button variant="primary" onClick={showAddModal}>
                  Add New Product Point
                </Button>
                <Button
                  variant="outline-secondary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showSettingsModal}
                >
                  Settings
                </Button>
              </div>
            </div>

            {/* <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup className="pb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ background: "transparent" }}>
                        <Search />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      placeholder="Search..."
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </div> */}

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataPromo()}
              // expandableRows
              // expandableRowsComponent={<ExpandableComponent />}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
