import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import rupiahFormat from "rupiah-format";

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

import SpecialPromoModal from "./SpecialPromoModal";
import ShowConfirmModal from "../../../components/ConfirmModal";

import "../../style.css";

export const SpecialPromoPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);

  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");

  const [specialPromos, setSpecialPromos] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);

  const initialValuePromo = {
    id: "",
    outlet_id: "",
    name: "",
    description_type: "",
    description: "",
    type: "",
    value: "",
    promo_category_id: 1
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
      .required("Please input value."),
    promo_category_id: Yup.number()
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
      promoData.append("promo_category_id", values.promo_category_id);
      if (photo) promoData.append("specialPromoImage", photo);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/special-promo`, promoData);
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
      promoData.append("promo_category_id", values.promo_category_id);
      if (photo) promoData.append("specialPromoImage", photo);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/special-promo/${values.id}`,
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

  const getSpecialPromos = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/special-promo`);
      setSpecialPromos(data.data);
    } catch (err) {
      setSpecialPromos([]);
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
    getSpecialPromos();
  }, [refresh]);

  React.useEffect(() => {
    getOutlets();
  }, []);

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = specialPromos.map((item) => {
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
      await axios.patch(`${API_URL}/api/v1/special-promo/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setSpecialPromos(edited);
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
      description_type: data.description_type,
      description: data.description,
      type: data.type,
      value: data.rate,
      promo_category_id: 1
    });
    if (data.image) {
      setPhoto(`${API_URL}${data.image}`);
      setPhotoPreview(`${API_URL}${data.image}`);
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
      await axios.delete(`${API_URL}/api/v1/special-promo/${promo_id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      disableLoading();
    }
  };

  const dataPromo = () => {
    return specialPromos.map((item, index) => {
      const value =
        item.type === "percentage"
          ? item.value + "%"
          : rupiahFormat.convert(item.value);

      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        outlet_id: item.outlet_id,
        outlet_name: item.Outlet?.name,
        value,
        rate: item.value,
        type: item.type,
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
      name: "Discount Rate",
      selector: "value",
      sortable: true
    },
    {
      name: "Promo Banner",
      cell: (rows) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const linkImage = `${API_URL}${rows.image}`;
        return (
          <>
            {rows.image ? (
              <img
                src={linkImage}
                alt="promo-banner"
                style={{ width: "100px", height: "auto", padding: "0.5rem 0" }}
              />
            ) : (
              "[No Promo Banner]"
            )}
          </>
        );
      }
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
      <SpecialPromoModal
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title="Add New Special Promo"
        loading={loading}
        alert={alert}
        formikPromo={formikPromo}
        validationPromo={validationPromo}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
        allOutlets={allOutlets}
      />

      <SpecialPromoModal
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
                <h3>Special Promo</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  Add New Special Promo
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
