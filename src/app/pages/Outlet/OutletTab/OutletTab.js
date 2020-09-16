import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
  ListGroup
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalOutlet from "./ModalOutlet";
import ShowConfirmModal from "../../../components/ConfirmModal";

import "../../style.css";

export const OutletTab = ({
  allOutlets,
  allProvinces,
  allTaxes,
  handleRefresh
}) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [allCities, setAllCities] = React.useState([]);
  const [allLocations, setAllLocations] = React.useState([]);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");

  const initialValueOutlet = {
    name: "",
    phone_number: "",
    address: "",
    postcode: "",
    province_id: "",
    city_id: "",
    location_id: "",
    tax_id: [],
    status: "active"
  };

  const OutletSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a product name."),
    phone_number: Yup.number()
      .integer()
      .min(1),
    address: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(100, "Maximum 100 characters."),
    postcode: Yup.number()
      .integer()
      .min(1),
    province_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a province."),
    city_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a city."),
    location_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a location."),
    tax_id: Yup.array()
      .of(Yup.number().required())
      .required("Please choose a tax."),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required("Please input a status.")
  });

  const formikOutlet = useFormik({
    enableReinitialize: true,
    initialValues: initialValueOutlet,
    validationSchema: OutletSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("location_id", values.location_id);
      formData.append("tax_id", JSON.stringify(values.tax_id));
      formData.append("status", values.status);

      if (photo) formData.append("outlet", photo);
      if (values.address) formData.append("address", values.address);
      if (values.postcode) formData.append("postcode", values.postcode);
      if (values.phone_number)
        formData.append("phone_number", values.phone_number);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/outlet`, formData);
        handleRefresh();
        disableLoading();
        cancelAddModalOutlet();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const formikOutletEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValueOutlet,
    validationSchema: OutletSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("location_id", values.location_id);
      formData.append("tax_id", JSON.stringify(values.tax_id));
      formData.append("status", values.status);

      if (photo) formData.append("outlet", photo);
      if (values.address) formData.append("address", values.address);
      if (values.postcode) formData.append("postcode", values.postcode);
      if (values.phone_number)
        formData.append("phone_number", values.phone_number);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/outlet/${values.id}`, formData);
        handleRefresh();
        disableLoading();
        cancelEditModalOutlet();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationOutlet = (fieldname) => {
    if (formikOutlet.touched[fieldname] && formikOutlet.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikOutlet.touched[fieldname] && !formikOutlet.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const validationOutletEdit = (fieldname) => {
    if (
      formikOutletEdit.touched[fieldname] &&
      formikOutletEdit.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikOutletEdit.touched[fieldname] &&
      !formikOutletEdit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalOutlet = () => setStateAddModal(true);
  const cancelAddModalOutlet = () => {
    formikOutlet.resetForm();
    setStateAddModal(false);
  };

  const showEditModalOutlet = (data) => {
    formikOutletEdit.setValues({
      id: data.id,
      name: data.name,
      phone_number: data.phone_number,
      address: data.address,
      postcode: data.postcode,
      province_id: data.province_id,
      city_id: data.city_id,
      location_id: data.location_id,
      tax_id: data.tax_id,
      status: data.status
    });

    const province_id = data.province_id;
    const city_id = data.city_id;

    formikOutletEdit.setFieldValue("province_id", province_id);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);

    formikOutletEdit.setFieldValue("city_id", city_id);

    const [locations] = cities
      .filter((item) => item.id === parseInt(city_id))
      .map((item) => item.Locations);
    setAllLocations(locations);

    setStateEditModal(true);
  };
  const cancelEditModalOutlet = () => {
    formikOutletEdit.resetForm();
    setAllCities([]);
    setAllLocations([]);
    setStateEditModal(false);
  };
  const showDeleteModalOutlet = (data) => {
    formikOutlet.setFieldValue("id", data.id);
    formikOutlet.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalOutlet = () => {
    formikOutlet.resetForm();
    setStateDeleteModal(false);
  };

  const handleProvince = (e) => {
    const province_id = e.target.value;
    formikOutlet.setFieldValue("province_id", province_id);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  const handleCity = (e) => {
    const city_id = e.target.value;
    formikOutlet.setFieldValue("city_id", city_id);

    if (allCities.length) {
      const cities = [...allCities];
      const [locations] = cities
        .filter((item) => item.id === parseInt(city_id))
        .map((item) => item.Locations);
      setAllLocations(locations);
    }
  };

  const handleDeleteOutlet = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = formikOutlet.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/outlet/${outlet_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalOutlet();
    } catch (err) {
      disableLoading();
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
      name: "Outlet Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Location",
      selector: "location",
      sortable: true
    },
    {
      name: "Phone Number",
      selector: "phone_number",
      sortable: true
    },
    {
      name: "Tax Status",
      selector: "tax",
      sortable: true
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
                onClick={() => showEditModalOutlet(rows)}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalOutlet(rows)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataOutlets = () => {
    return allOutlets.map((item, index) => {
      const location = `${item.Location.name}, ${item.Location.City.name}, ${item.Location.City.Province.name}`;
      const capitalize = location
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const tax_id = item.Outlet_Taxes.map((item) => item.tax_id);

      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        location: item.Location.name,
        address: item.address || "",
        postcode: item.postcode || "",
        location_id: item.Location.id,
        city_id: item.Location.City.id,
        province_id: item.Location.City.Province.id,
        locationFull: capitalize,
        phone_number: item.phone_number || "",
        status: item.status,
        tax: tax_id.length ? "Taxable" : "No Tax",
        tax_id
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    const keys = [
      {
        key: "Location",
        value: "locationFull"
      },
      {
        key: "Address",
        value: "address"
      },
      {
        key: "Postcode",
        value: "postcode"
      },
      {
        key: "Phone Number",
        value: "phone_number"
      }
      // {
      //   key: "Tax Status",
      //   value: "tax"
      // }
    ];

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          {keys.map((val, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  <Col md={3} style={{ fontWeight: "700" }}>
                    {val.key}
                  </Col>
                  <Col>{data[val.value] || "-"}</Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  return (
    <Row>
      <ModalOutlet
        stateModal={stateAddModal}
        cancelModal={cancelAddModalOutlet}
        title={"Add New Outlet"}
        loading={loading}
        formikOutlet={formikOutlet}
        validationOutlet={validationOutlet}
        allProvinces={allProvinces}
        allTaxes={allTaxes}
        allCities={allCities}
        allLocations={allLocations}
        handleProvince={handleProvince}
        handleCity={handleCity}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
      />

      <ModalOutlet
        stateModal={stateEditModal}
        cancelModal={cancelEditModalOutlet}
        title={`Edit Outlet - ${formikOutletEdit.getFieldProps("name").value}`}
        loading={loading}
        formikOutlet={formikOutletEdit}
        validationOutlet={validationOutletEdit}
        allProvinces={allProvinces}
        allTaxes={allTaxes}
        allCities={allCities}
        allLocations={allLocations}
        handleProvince={handleProvince}
        handleCity={handleCity}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalOutlet}
        title={`Delete Outlet - ${formikOutlet.getFieldProps("name").value}`}
        body={"Are you sure want to delete?"}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteOutlet}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Outlet Information</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalOutlet}
              >
                Add New Outlet
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
                  <Form.Control placeholder="Search..." />
                </InputGroup>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        Status:
                      </Form.Label>
                      <Col>
                        <Form.Control as="select" defaultValue={"all"}>
                          <option value="all">All</option>
                          <option>Pending</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        Type:
                      </Form.Label>
                      <Col>
                        <Form.Control as="select" defaultValue={"all"}>
                          <option value="all">All</option>
                          <option>Online</option>
                          <option>Retail</option>
                          <option>Direct</option>
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
            data={dataOutlets()}
            expandableRows
            expandableRowsComponent={<ExpandableComponent />}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};
