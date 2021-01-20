import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";

import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalPayment from "./ModalPayment";
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const PaymentTab = ({ handleRefresh, refresh }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");

  const [allPaymentMethods, setAllPaymentMethods] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    type: "",
    status: ""
  });

  const allStatuses = ["Active", "Inactive"];
  const debouncedSearch = useDebounce(search, 1000);

  const getPaymentMethod = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterPayment = `?name=${search}&type=${filter.type}&status=${filter.status}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/payment-method${filterPayment}`
      );
      setAllPaymentMethods(data.data);
    } catch (err) {
      setAllPaymentMethods([]);
    }
  };

  const getPaymentMethodTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/payment-method-type`);
      setAllTypes(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getPaymentMethod(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  React.useEffect(() => {
    getPaymentMethodTypes();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const initialValuePayment = {
    name: "",
    payment_method_type_id: "",
    mdr: "",
    status: "active"
  };

  const PaymentSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a name."),
    payment_method_type_id: Yup.number()
      .integer()
      .min(1)
      .required("Please input a payment method type."),
    mdr: Yup.number()
      .integer()
      .min(0)
      .required("Please input a mdr."),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required("Please input a status.")
  });

  const formikPayment = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePayment,
    validationSchema: PaymentSchema,
    onSubmit: async (values) => {
      const paymentMethodData = new FormData();
      paymentMethodData.append("name", values.name);
      paymentMethodData.append(
        "payment_method_type_id",
        values.payment_method_type_id
      );
      paymentMethodData.append("mdr", values.mdr);
      paymentMethodData.append("status", values.status);
      if (photo) paymentMethodData.append("qrImage", photo);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/payment-method`, paymentMethodData);
        handleRefresh();
        disableLoading();
        cancelAddModalPayment();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const formikPaymentEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePayment,
    validationSchema: PaymentSchema,
    onSubmit: async (values) => {
      const paymentMethodData = new FormData();
      paymentMethodData.append("name", values.name);
      paymentMethodData.append(
        "payment_method_type_id",
        values.payment_method_type_id
      );
      paymentMethodData.append("mdr", values.mdr);
      paymentMethodData.append("status", values.status);
      if (photo) paymentMethodData.append("qrImage", photo);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/payment-method/${values.id}`,
          paymentMethodData
        );
        handleRefresh();
        disableLoading();
        cancelEditModalPayment();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationPayment = (fieldname) => {
    if (formikPayment.touched[fieldname] && formikPayment.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPayment.touched[fieldname] && !formikPayment.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const validationPaymentEdit = (fieldname) => {
    if (
      formikPaymentEdit.touched[fieldname] &&
      formikPaymentEdit.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikPaymentEdit.touched[fieldname] &&
      !formikPaymentEdit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalPayment = (data) => setStateAddModal(true);
  const cancelAddModalPayment = () => {
    formikPayment.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
  };

  const showEditModalPayment = (data) => {
    formikPaymentEdit.setValues({
      id: data.id,
      name: data.name,
      payment_method_type_id: data.type_id,
      mdr: parseInt(data.mdr.slice(0, -1)),
      status: data.status
    });

    if (data.qr_image) {
      const API_URL = process.env.REACT_APP_API_URL;
      setPhoto(`${API_URL}${data.qr_image}`);
      setPhotoPreview(`${API_URL}${data.qr_image}`);
    }

    setStateEditModal(true);
  };
  const cancelEditModalPayment = () => {
    formikPaymentEdit.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateEditModal(false);
  };
  const showDeleteModalPayment = (data) => {
    formikPayment.setFieldValue("id", data.id);
    formikPayment.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalPayment = () => {
    formikPayment.resetForm();
    setStateDeleteModal(false);
  };

  const handleDeletePayment = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const payment_id = formikPayment.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/payment-method/${payment_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalPayment();
    } catch (err) {
      disableLoading();
    }
  };

  const handleChangeStatus = async (id) => {
    let currentStatus;
    const API_URL = process.env.REACT_APP_API_URL;

    allPaymentMethods.forEach((item) => {
      if (item.id === id) {
        if (item.status === "active") {
          currentStatus = "inactive";
        } else {
          currentStatus = "active";
        }
      }
    });

    try {
      await axios.patch(`${API_URL}/api/v1/payment-method/status/${id}`, {
        status: currentStatus
      });
      handleRefresh();
    } catch (err) {
      console.log(err);
    }
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

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Type",
      selector: "type",
      sortable: true
    },
    {
      name: "MDR",
      selector: "mdr",
      sortable: true
    },
    {
      name: "Status",
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
              <Dropdown.Item
                as="button"
                onClick={() => showEditModalPayment(rows)}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalPayment(rows)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataPayments = () => {
    return allPaymentMethods.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        type: item.Payment_Method_Type.name,
        type_id: item.payment_method_type_id,
        mdr: item.mdr + "%",
        qr_image: item.qr_image,
        status: item.status
      };
    });
  };

  return (
    <Row>
      <ModalPayment
        stateModal={stateAddModal}
        cancelModal={cancelAddModalPayment}
        title={"Add New Payment Method"}
        loading={loading}
        formikPayment={formikPayment}
        validationPayment={validationPayment}
        allTypes={allTypes}
        handlePreviewPhoto={handlePreviewPhoto}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
      />

      <ModalPayment
        stateModal={stateEditModal}
        cancelModal={cancelEditModalPayment}
        title={`Edit Payment Method - ${
          formikPaymentEdit.getFieldProps("name").value
        }`}
        loading={loading}
        formikPayment={formikPaymentEdit}
        validationPayment={validationPaymentEdit}
        allTypes={allTypes}
        handlePreviewPhoto={handlePreviewPhoto}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalPayment}
        title={`Delete Payment Method - ${
          formikPayment.getFieldProps("name").value
        }`}
        body={"Are you sure want to delete?"}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeletePayment}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Payment Methods</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalPayment}
              >
                Add New Payment Method
              </Button>
            </div>
          </div>

          <div className="filterSection lineBottom">
            <Row>
              <Col>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      <Search />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        Type:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="type"
                          value={filter.type}
                          onChange={handleFilter}
                        >
                          <option value="">All</option>
                          {allTypes.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        Status:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="status"
                          value={filter.status}
                          onChange={handleFilter}
                        >
                          <option value="">All</option>
                          {allStatuses.map((item, index) => {
                            return (
                              <option key={index} value={item.toLowerCase()}>
                                {item}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <DataTable
            noHeader
            pagination
            columns={columns}
            data={dataPayments()}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};