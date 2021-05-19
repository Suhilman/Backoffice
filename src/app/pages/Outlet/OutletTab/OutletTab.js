import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";

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
import useDebounce from "../../../hooks/useDebounce";
import AlertOutletLimit from "./AlertOutletLimit";

import "../../style.css";

export const OutletTab = ({
  allProvinces,
  allTaxes,
  handleRefresh,
  refresh
}) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [alertOutletLimit, setAlertOutletLimit] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    time: "newest"
  });

  const allStatuses = ["Newest", "Oldest"];

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allCities, setAllCities] = React.useState([]);
  const [allLocations, setAllLocations] = React.useState([]);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [latitudeLongitude, setLatitudeLongitude] = React.useState({})

  const debouncedSearch = useDebounce(search, 1000);
  const { t } = useTranslation();
  const initialValueOutlet = {
    name: "",
    phone_number: "",
    address: "",
    province: "",
    city: "",
    location: "",
    payment_description: "",
    postcode: "",
    province_id: "",
    latitude: "",
    longitude: "",
    city_id: "",
    location_id: "",
    status: "active"
  };

  const OutletSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`),
    phone_number: Yup.number().typeError(`${t("pleaseInputANumberOnly")}`),
    address: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(200, `${t("maximum100Character")}`),
    province: Yup.string(),
    city: Yup.string(),
    location: Yup.string(),
    payment_description: Yup.string(),
    postcode: Yup.number()
      .integer()
      .min(1),
    province_id: Yup.number()
      .integer()
      .min(1),
    city_id: Yup.number()
      .integer()
      .min(1),
    location_id: Yup.number()
      .integer()
      .min(1),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required(`${t("pleaseInputAStatus")}`)
  });

  const formikOutlet = useFormik({
    enableReinitialize: true,
    initialValues: initialValueOutlet,
    validationSchema: OutletSchema,
    onSubmit: async (values) => {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      console.log("ini adalah value tambah formik outlet", values)
      const locationPointer = JSON.parse(localStorage.getItem("addLocation"))
      const formData = new FormData();
      formData.append("name", values.name);
      if(values.location_id) {
        formData.append("location_id", values.location_id);
      }
      if(values.province) {
        formData.append("province", values.province);
      }
      if(values.city) {
        formData.append("city", values.city);
      }
      if(values.location) {
        formData.append("location", values.location);
      }
      formData.append("status", values.status);
      if (locationPointer) {
        formData.append("latitude", locationPointer.lat); 
      }
      if (locationPointer) {
        formData.append("longitude", locationPointer.lng);
      }
      formData.append("payment_description", values.payment_description)
      if (photo) {
        console.log("photo apaan", photo)
        formData.append("outlet", photo);
      }
      if (values.address) formData.append("address", values.address);
      if (values.postcode) formData.append("postcode", values.postcode);
      if (values.phone_number)
        formData.append("phone_number", values.phone_number);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/outlet/create-development`, formData);
        handleRefresh();
        disableLoading();
        cancelAddModalOutlet();
        localStorage.removeItem("addLocation")
        localStorage.removeItem("location")
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
      const locationPointer = JSON.parse(localStorage.getItem("addLocation"))
      console.log('ini data di edit', values)
      const formData = new FormData();
      formData.append("name", values.name);
      if(values.location_id) {
        formData.append("location_id", values.location_id);
      }
      if(values.province) {
        formData.append("province", values.province);
      }
      if(values.city) {
        formData.append("city", values.city);
      }
      if(values.location) {
        formData.append("location", values.location);
      }
      formData.append("status", values.status);
      if(locationPointer) {
        formData.append("latitude", locationPointer.lat);
      }
      if(locationPointer) {
        formData.append("longitude", locationPointer.lng);
      }
      formData.append("payment_description", values.payment_description)
      console.log('ini photonya', photo)
      if (photo.name) {
        formData.append("outlet", photo);
      }
      if (values.address) formData.append("address", values.address);
      if (values.postcode) formData.append("postcode", values.postcode);
      if (values.phone_number) formData.append("phone_number", values.phone_number);

      const API_URL = process.env.REACT_APP_API_URL;

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/outlet/update-development/${values.id}`, formData);
        handleRefresh();
        disableLoading();
        cancelEditModalOutlet();
        localStorage.removeItem("addLocation")
        localStorage.removeItem("location")
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

  const showAddModalOutlet = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const dataSubscription = await axios.get(`${API_URL}/api/v1/subscription`)
    const userInfo = JSON.parse(localStorage.getItem("user_info"))
    const subscription = dataSubscription.data.data.find(item => {
      return item.business_id === userInfo.business_id
    })
    if (subscription) {
      console.log("sisa outlet", subscription.outlet_limit - dataOutlets().length)
      if (subscription.outlet_limit === 0) {
        console.log("unlimited outlet")
        setStateAddModal(true)
      } else if (subscription.outlet_limit - dataOutlets().length <= 0) {
        console.log("sudah habis")
        setAlertOutletLimit(true)
      } else {
        console.log("kuota outlet masin", subscription.outlet_limit - dataOutlets().length)
        setStateAddModal(true)
      }
    }
  };
  const cancelAddModalOutlet = () => {
    formikOutlet.resetForm();
    setStateAddModal(false);
    localStorage.removeItem("location")
    localStorage.removeItem("addLocation")
  };

  const showEditModalOutlet = (data) => {
    const API_URL = process.env.REACT_APP_API_URL;
    console.log('ini adalah data yang mau di edit', data)
    setPhoto(data.image ? `${API_URL}/${data.image}` : "")
    setPhotoPreview(data.image ? `${API_URL}/${data.image}` : "")
    if(data.location_id) {
      formikOutletEdit.setValues({
        id: data.id,
        name: data.name,
        phone_number: data.phone_number,
        address: data.address,
        image: data.image,
        payment_description: data.payment_description,
        postcode: data.postcode,
        province_id: data.province_id,
        city_id: data.city_id,
        location_id: data.location_id,
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
    } else {
      formikOutletEdit.setValues({
        id: data.id,
        name: data.name,
        phone_number: data.phone_number,
        address: data.address,
        image: data.image,
        payment_description: data.payment_description,
        postcode: data.postcode,
        province: data.province,
        city: data.city,
        location: data.location,
        status: data.status
      });
      setStateEditModal(true);
    }
    
    const location = {
      lng: data.longitude,
      lat: data.latitude
    }
    localStorage.setItem("location", JSON.stringify(location))
  };

  const cancelEditModalOutlet = () => {
    formikOutletEdit.resetForm();
    setAllCities([]);
    setAllLocations([]);
    setStateEditModal(false);
    localStorage.removeItem("addLocation")
    localStorage.removeItem("location")
  };

  const cancelAlertOutletLimit = () => {
    setAlertOutletLimit(false)
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

  const handleProvince = (e, formik) => {
    const province_id = e.target.value;
    formik.setFieldValue("province_id", province_id);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  const handleCity = (e, formik) => {
    const city_id = e.target.value;
    formik.setFieldValue("city_id", city_id);

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

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const getOutlets = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterOutlet = `?name=${search}&order=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/outlet${filterOutlet}`
      );
      console.log('ini data outlet', data.data)
      setPhoto(
        `${data.data.image ? `${API_URL}/${data.data.image}` : ""}`
      )
      console.log("ini photonya boeowww", `${API_URL}/${data.data.image}`)
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };
  React.useEffect(() => {
    getOutlets(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: `${t("outletName")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("location")}`,
      selector: "location",
      sortable: true
    },
    {
      name: `${t("phoneNumber")}`,
      selector: "phone_number",
      sortable: true
    },
    {
      name: `${t("taxStatus")}`,
      selector: "tax",
      sortable: true
    },
    {
      name: `${t("actions")}`,
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
                {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalOutlet(rows)}
              >
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataOutlets = () => {
    return allOutlets.map((item, index) => {
      console.log("ini item apa", item)
      if(item.Location) {
        console.log("jika locationnya ada")
        const location = `${item.Location.name}, ${item.Location.City.name}, ${item.Location.City.Province.name}`;
        const capitalize = location
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
  
        return {
          id: item.id,
          no: index + 1,
          name: item.name,
          location: item.Location.name,
          address: item.address || "",
          payment_description: item.payment_description,
          postcode: item.postcode || "",
          location_id: item.Location.id,
          city_id: item.Location.City.id,
          province_id: item.Location.City.Province.id,
          locationFull: capitalize,
          latitude: item.latitude,
          longitude: item.longitude,
          image: item.image,
          phone_number: item.phone_number || "",
          status: item.status,
          tax: item.Outlet_Taxes.length ? "Taxable" : "No Tax",
          allTaxes: item.Outlet_Taxes.map((item) => item.Tax.name).join(", ")
        };
      } else {
        console.log("jika tidak ada")
        return {
          id: item.id,
          no: index + 1,
          name: item.name,
          address: item.address || "",
          payment_description: item.payment_description,
          postcode: item.postcode || "",
          province: item.province,
          city: item.city,
          location: item.location,
          latitude: item.latitude,
          longitude: item.longitude,
          image: item.image,
          phone_number: item.phone_number || "",
          status: item.status,
          tax: item.Outlet_Taxes.length ? "Taxable" : "No Tax",
          allTaxes: item.Outlet_Taxes.map((item) => item.Tax.name).join(", ")
        };
      }
      
    });
  };

  console.log("dataOutlet", dataOutlets())

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
      },
      {
        key: "Tax",
        value: "allTaxes"
      }
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
    <>
      <ModalOutlet
        t={t}
        stateModal={stateAddModal}
        cancelModal={cancelAddModalOutlet}
        title={`${t("addNewOutlet")}`}
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
        t={t}
        latitudeLongitude={latitudeLongitude}
        stateModal={stateEditModal}
        cancelModal={cancelEditModalOutlet}
        title={`${t("editOutlet")} - ${formikOutletEdit.getFieldProps("name").value}`}
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

      <AlertOutletLimit
        t={t}
        stateModal={alertOutletLimit}
        cancelModal={cancelAlertOutletLimit}
        title={`${t("outletLimit")}`}
      />

      <ShowConfirmModal
        t={t}
        state={stateDeleteModal}
        closeModal={cancelDeleteModalOutlet}
        title={`${t("deleteOutlet")} - ${formikOutlet.getFieldProps("name").value}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteOutlet}
      />

      <Row style={{ height: "100%" }}>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("outletInformation")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModalOutlet}
                >
                  {t("addNewOutlet")}
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
                      placeholder={t("search")}
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
                          {t("time")}:
                        </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            name="time"
                            value={filter.time}
                            onChange={handleFilter}
                          >
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
              data={dataOutlets()}
              expandableRows
              expandableRowsComponent={<ExpandableComponent />}
              style={{ minHeight: "70%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
