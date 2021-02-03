import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { MoreHoriz } from "@material-ui/icons";

import VoucherPromoModal from "./VoucherPromoModal";
import ShowConfirmModal from "../../../components/ConfirmModal";

import "../../style.css";

export const VoucherPromoPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);

  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");

  const [voucherPromos, setVoucherPromos] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);

  const initialValuePromo = {
    id: "",
    outlet_id: "",
    name: "",
    code: "",
    quota: "",
    description_type: "regulation",
    description: "",
    type: "percentage",
    value: ""
  };

  const PromoSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose outlet."),
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a name."),
    code: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a code."),
    quota: Yup.number()
      .min(1, "Minimum 1 quota.")
      .required("Please input a quota."),
    description_type: Yup.string()
      .matches(/regulation|how_to_use/)
      .required("Please choose type."),
    description: Yup.string().min(1, "Minimum 1 character"),
    type: Yup.string()
      .matches(/percentage|currency/)
      .required("Please choose type."),
    value: Yup.number()
      .integer()
      .min(0)
      .required("Please input value.")
  });

  const formikPromo = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePromo,
    validationSchema: PromoSchema,
    onSubmit: async (values) => {
      const promoData = new FormData();
      promoData.append("outlet_id", values.outlet_id);
      promoData.append("name", values.name);
      promoData.append("description_type", values.description_type);
      promoData.append("description", values.description);
      promoData.append("type", values.type);
      promoData.append("value", values.value);
      promoData.append("code", values.code);
      promoData.append("quota", values.quota);
      promoData.append("promo_date_start", startDate);
      promoData.append("promo_date_end", endDate);
      if (photo) promoData.append("voucherPromoImage", photo);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/voucher-promo`, promoData);
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
    enableReinitialize: true,
    initialValues: initialValuePromo,
    validationSchema: PromoSchema,
    onSubmit: async (values) => {
      const promoData = new FormData();
      promoData.append("outlet_id", values.outlet_id);
      promoData.append("name", values.name);
      promoData.append("description_type", values.description_type);
      promoData.append("description", values.description);
      promoData.append("type", values.type);
      promoData.append("value", values.value);
      promoData.append("code", values.code);
      promoData.append("quota", values.quota);
      promoData.append("promo_date_start", startDate);
      promoData.append("promo_date_end", endDate);
      if (photo) promoData.append("voucherPromoImage", photo);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/voucher-promo/${values.id}`,
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

  const getVoucherPromos = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/voucher-promo`);
      setVoucherPromos(data.data);
    } catch (err) {
      setVoucherPromos([]);
    }
  };

  const getOutlets = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  React.useEffect(() => {
    getVoucherPromos();
  }, [refresh]);

  React.useEffect(() => {
    getOutlets();
  }, []);

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = voucherPromos.map((item) => {
      if (item.id === id) {
        if (item.status === "active") {
          item.status = "inactive";
          currentStatus = "inactive";
        } else {
          item.status = "active";
          currentStatus = "active";
        }
      }

      return item;
    });

    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.patch(`${API_URL}/api/v1/voucher-promo/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setVoucherPromos(edited);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    const API_URL = process.env.REACT_APP_API_URL;

    formikEditPromo.setValues({
      id: data.id,
      outlet_id: data.outlet_id,
      name: data.name,
      code: data.code,
      quota: data.quota_value,
      description_type: data.description_type,
      description: data.description,
      type: data.type,
      value: data.value
    });
    if (data.image) {
      setPhoto(`${API_URL}${data.image}`);
      setPhotoPreview(`${API_URL}${data.image}`);
    }
    if (data.promo_date_start && data.promo_date_end) {
      setStartDate(new Date(data.promo_date_start));
      setEndDate(new Date(data.promo_date_end));
    }
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    formikEditPromo.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateEditModal(false);
  };

  const showDeleteModal = (data) => {
    formikPromo.setFieldValue("id", data.id);
    formikPromo.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

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
      await axios.delete(`${API_URL}/api/v1/voucher-promo/${promo_id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      disableLoading();
    }
  };

  const formatDate = (date) => dayjs(date).format("DD/MM/YYYY HH:mm");

  const dataPromo = () => {
    return voucherPromos.map((item, index) => {
      const quota = `${item.quota - item.quota_used}/${item.quota}`;

      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        outlet_id: item.outlet_id,
        outlet_name: item.Outlet?.name,
        promo_date_start: item.promo_date_start,
        promo_date_end: item.promo_date_end,
        code: item.code,
        quota,
        quota_value: item.quota,
        type: item.type,
        value: item.value,
        description_type: item.description_type,
        description: item.description,
        image: item.image,
        status: item.status
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
      name: "Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Voucher Date",
      cell: (rows) => {
        return (
          <div style={{ padding: "5px 0" }}>
            {formatDate(rows.promo_date_start)} <br />
            until <br />
            {formatDate(rows.promo_date_end)}
          </div>
        );
      }
    },
    {
      name: "Voucher Code",
      selector: "code",
      sortable: true
    },
    {
      name: "Voucher Quota",
      selector: "quota",
      sortable: true
    },
    {
      name: "Promo Status",
      cell: (rows) => {
        return (
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value={rows.status}
                control={
                  <Switch
                    color="primary"
                    checked={rows.status === "active" ? true : false}
                    onChange={() => handleChangeStatus(rows.id)}
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
      <VoucherPromoModal
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title="Add New Voucher Promo"
        loading={loading}
        alert={alert}
        formikPromo={formikPromo}
        validationPromo={validationPromo}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
        allOutlets={allOutlets}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <VoucherPromoModal
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title={`Edit Promo - ${formikEditPromo.getFieldProps("name").value}`}
        loading={loading}
        alert={alert}
        formikPromo={formikEditPromo}
        validationPromo={validationEditPromo}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
        allOutlets={allOutlets}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`Delete Promo - ${formikPromo.getFieldProps("name").value}`}
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
                <h3>Voucher Promo</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  Add New Voucher Promo
                </Button>
              </div>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataPromo()}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
