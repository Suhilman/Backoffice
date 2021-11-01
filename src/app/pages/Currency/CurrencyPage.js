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
import useDebounce from "../../hooks/useDebounce";
import AddCurrency from './AddCurrency.js'
import ConfirmModal from "../../components/ConfirmModal";

export default function CurrencyPage() {
  const [refresh, setRefresh] = React.useState(0);
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [allOutlets, setAllOutlets] = React.useState([]);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [state, setState] = React.useState("")
  const [showFeature, setShowFeature] = React.useState({
    mdr: false
  })

  const [search, setSearch] = React.useState({
    currency: ""
  });
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });
  const { t } = useTranslation();
  const [currencyConversion, setCurrencyConversion] = React.useState([]);
  const [currCurrency, setCurrCurrency] = React.useState({
    id: "",
    name: ""
  });

  const initialValueCurrency = {
    outlet_id: [],
    currency_a: "",
    currency_b: "",
    conversion_a_to_b: ""
  };

  const CurrencySchema = Yup.object().shape({
    outlet_id: Yup.array().of(Yup.number().min(1)),
    currency_a: Yup.string()
      .required(`${t("pleaseInputCurrencyA")}`),
    currency_b: Yup.number()
      .required(`${t("pleaseInputCurrencyB")}`),
    conversion_a_to_b: Yup.string()
      .typeError(`${t('pleaseInputANumberOnly')}`)
      .required(`${t("pleaseInputconversionAToB")}`)
  });

  const formikCurrency = useFormik({
    enableReinitialize: true,
    initialValues: initialValueCurrency,
    validationSchema: CurrencySchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const data = {
        outlet_id: JSON.stringify(values.outlet_id),
        currency_a: values.currency_a,
        currency_b: values.currency_b,
        conversion_a_to_b: values.conversion_a_to_b
      }
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/currency-conversion`, data);
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

  const validationCurrency = (fieldname) => {
    if (formikCurrency.touched[fieldname] && formikCurrency.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikCurrency.touched[fieldname] &&
      !formikCurrency.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getCurrencyConversion = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const filterCustomer = `?currency=${search.currency}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/currency-conversion${filterCustomer}`
      );
      setCurrencyConversion(data.data);
    } catch (err) {
      setCurrencyConversion([]);
    }
  };

  React.useEffect(() => {
    getCurrencyConversion(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const handleDelete = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/currency-conversion/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response.data.message || err.message);
      disableLoading();
    }
  };

  const handleSearch = (e) => setSearch({currency: e.target.value});
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showAddModal = () => {
    setState("Create")  
    setStateAddModal(true)
  };
  const closeAddModal = () => {
    formikCurrency.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
  };

  const showDeleteModal = (data) => {
    setCurrCurrency({
      id: data.id,
      name: data.outlet_name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const handleSelectOutlet = (value, formik) => {
    if (value) {
      const outlet = value.map((item) => item.value);
      console.log("outletnya", outlet);
      formik.setFieldValue("outlet_id", outlet);
    } else {
      formik.setFieldValue("outlet_id", []);
    }
  };

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getOutlets();
  }, [refresh]);

  const handleSubscriptionPartition = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`
      );

      let mdr;

      if(data.data[0].subscription_partition_id === 3) {
        mdr = true
      }
      if(data.data[0].subscription_partition_id === 2) {
        mdr = true
      }
      if(data.data[0].subscription_partition_id === 1) {
        mdr = false
      }
      setShowFeature({
        mdr
      })
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    handleSubscriptionPartition()
  }, [])

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: `${t("outletName")}`,
      selector: "outlet_name",
      sortable: true
    },
    {
      name: `${t("currencyA")}`,
      selector: "currency_a",
      sortable: true
    },
    {
      name: `${t("currencyB")}`,
      selector: "currency_b",
      sortable: true
    },
    {
      name: `${t("conversionAToB")}`,
      selector: "conversion_a_to_b",
      sortable: true
    },
    {
      name: `${t("conversionBToA")}`,
      selector: "conversion_b_to_a",
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
              {/* <Link to={`/customer/${rows.id}`}>
                <Dropdown.Item as="button">{t("detail")}</Dropdown.Item>
              </Link> */}
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dadtaCurrencyConversion = currencyConversion.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      currency_a: item.data_currency_a.full_name,
      currency_b: item.data_currency_b.full_name,
      conversion_a_to_b: item.conversion_a_to_b,
      conversion_b_to_a: item.conversion_b_to_a,
      outlet_name: item.Outlet ? item.Outlet.name : `${t('allOutlet')}`
    };
  });

  return (
    <>
      <AddCurrency
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addNewCustomer")}
        alert={alert}
        loading={loading}
        formikCurrency={formikCurrency}
        validationCurrency={validationCurrency}
        state={state}
        handleSelectOutlet={handleSelectOutlet}
        allOutlets={allOutlets}
        showFeature={showFeature}
      />

      <ConfirmModal
        t={t}
        title={`${t("deleteCurrencyConversion")} - ${currCurrency.name}`}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={() => handleDelete(currCurrency.id)}
        loading={loading}
        alert={alert}
      />

      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("currencyConversion")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  {t("addCurrencyConversion")}
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
                      value={search.currency}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>

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
                        <option value="newest">{t("newest")}</option>
                        <option value="oldest">{t("oldest")}</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dadtaCurrencyConversion}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
