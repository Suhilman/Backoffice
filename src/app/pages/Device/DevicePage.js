import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import DeviceModal from "./AddDeviceModal";
import ConfirmModal from "../../components/ConfirmModal";
import useDebounce from "../../hooks/useDebounce";

export const DevicePage = () => {
  const [refresh, setRefresh] = React.useState(0);
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });
  const { t } = useTranslation();
  const [devices, setDevices] = React.useState([]);
  const [currDevice, setCurrDevices] = React.useState({
    id: "",
    name: ""
  });

  const initialValueDevices = {
    devices_name: "",
    beetpos_version: "",
    devices_code: "",
    description: ""
  };

  const Deviceschema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputDeviceName")}`),
    email: Yup.string()
      .email()
      .required(`${t("pleaseInputAnEmail")}`),
    phone_number: Yup.number()
      .typeError("Please input a number only")
      .required(`${t("pleaseInputAPhoneNumber")}`),
    address: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAnAddress")}`),
    notes: Yup.string()
  });

  const formikDevices = useFormik({
    enableReinitialize: true,
    initialValues: initialValueDevices,
    validationSchema: Deviceschema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }

      const formData = new FormData();
      formData.append("devices_name", values.devices_name);
      formData.append("beetpos_version", values.beetpos_version);
      formData.append("devices_code", values.devices_code);
      formData.append("description", values.description);

      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/devices`, formData);
        handleRefresh();
        disableLoading();
        setAlert("");
        closeAddModal();
      } catch (err) {
        setAlert(err.response.data.message || err.message);
        disableLoading();
      }
    }
  });

  

  const validationDevices = (fieldname) => {
    if (formikDevices.touched[fieldname] && formikDevices.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikDevices.touched[fieldname] &&
      !formikDevices.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getDevices = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterDevices = `?name=${search}&sort=${filter.time}`;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/devices/${filterDevices}`
      );
      setDevices(data.data);
    } catch (err) {
      setDevices([]);
    }
  };

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  React.useEffect(() => {
    getOutlets()
    getDevices(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);
;

  const handleDelete = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/devices/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response.data.message || err.message);
      disableLoading();
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { description, value } = e.target;
    const filterData = { ...filter };
    filterData[description] = value;
    setFilter(filterData);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    formikDevices.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
  };

  const showDeleteModal = (data) => {
    setCurrDevices({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const handlePreviewPhoto = (e) => {
    setAlertPhoto("");

    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          // console.log("reader.result", reader.result)
          setPhotoPreview(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      // console.log("img", img)
      setPhoto(img)
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
  };

  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: `${t("outlet")}`,
      selector: "location",
      sortable: true
    },
    {
      name: `${t("Devices")}`,
      selector: "devices_name",
      sortable: true
    },
    {
      name: `${t("Beetpos Version")}`,
      selector: "beetpos_version",
      sortable: true
    },
    {
      name: `${t("Devices Code")}`,
      selector: "devices_code",
      sortable: true
    },
    {
      name: `${t("Description")}`,
      selector: "description",
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
              <Link to={`/devices/${rows.id}`}>
                <Dropdown.Item as="button">{t("Edit")}</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("Delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataDevices = devices.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      location: item.Outlet.name,
      devices_name: item.devices_name,
      beetpos_version: item.beetpos_version,
      devices_code: item.devices_code,
      description: item.description
    };
  });

  return (
    <>
      <DeviceModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("Add Device")}
        alert={alert}
        loading={loading}
        formikDevices={formikDevices}
        validationDevices={validationDevices}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
      />

      <ConfirmModal
        t={t}
        title={`${t("Delete Device")} - ${currDevice.devices_name}`}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={() => handleDelete(currDevice.id)}
        loading={loading}
        alert={alert}
      />

      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("Device Management")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  {t("Add Device")}
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
                      placeholder={t("Search")}
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataDevices}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
