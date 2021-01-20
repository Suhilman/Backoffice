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
  FormControl
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalTax from "./ModalTax";
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const TaxTab = ({ handleRefresh, refresh }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [allTaxTypes, setAllTaxTypes] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    type: ""
  });

  const debouncedSearch = useDebounce(search, 1000);

  const getTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/tax-type`);
      setAllTypes(data.data);
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
      console.log(err);
    }
  };

  const getTaxes = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterTaxType = `?name=${search}&type=${filter.type}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/tax${filterTaxType}`);
      setAllTaxTypes(data.data);
    } catch (err) {
      setAllTaxTypes([]);
    }
  };

  React.useEffect(() => {
    getTypes();
    getOutlets();
  }, []);

  React.useEffect(() => {
    getTaxes(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const initialValueTax = {
    name: "",
    value: "",
    tax_type_id: "",
    outlet_id: []
  };

  const TaxSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a name."),
    value: Yup.number()
      .integer()
      .min(1)
      .required("Please input a value."),
    tax_type_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose a type."),
    outlet_id: Yup.array().of(Yup.number().min(1))
  });

  const formikTax = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTax,
    validationSchema: TaxSchema,
    onSubmit: async (values) => {
      const taxData = {
        name: values.name,
        value: values.value,
        tax_type_id: values.tax_type_id,
        outlet_id: values.outlet_id
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/tax`, taxData);
        handleRefresh();
        disableLoading();
        cancelAddModalTax();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const formikTaxEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTax,
    validationSchema: TaxSchema,
    onSubmit: async (values) => {
      const taxData = {
        name: values.name,
        value: values.value,
        tax_type_id: values.tax_type_id,
        outlet_id: values.outlet_id
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/tax/${values.id}`, taxData);
        handleRefresh();
        disableLoading();
        cancelEditModalTax();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationTax = (fieldname) => {
    if (formikTax.touched[fieldname] && formikTax.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikTax.touched[fieldname] && !formikTax.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const validationTaxEdit = (fieldname) => {
    if (formikTaxEdit.touched[fieldname] && formikTaxEdit.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikTaxEdit.touched[fieldname] && !formikTaxEdit.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalTax = () => setStateAddModal(true);
  const cancelAddModalTax = () => {
    formikTax.resetForm();
    setStateAddModal(false);
  };

  const showEditModalOutlet = (data) => {
    formikTaxEdit.setValues({
      id: data.id,
      name: data.name,
      value: parseInt(data.amount.slice(0, -1)),
      tax_type_id: data.tax_type_id,
      outlet_id: data.outlet_id
    });

    setStateEditModal(true);
  };
  const cancelEditModalTax = () => {
    formikTaxEdit.resetForm();
    setStateEditModal(false);
  };
  const showDeleteModalTax = (data) => {
    formikTax.setFieldValue("id", data.id);
    formikTax.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalTax = () => {
    formikTax.resetForm();
    setStateDeleteModal(false);
  };

  const handleDeleteTax = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const tax_id = formikTax.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/tax/${tax_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalTax();
    } catch (err) {
      disableLoading();
    }
  };

  const handleSelectOutlet = (value, formik) => {
    if (value) {
      const outlet = value.map((item) => item.value);
      formik.setFieldValue("outlet_id", outlet);
    } else {
      formik.setFieldValue("outlet_id", []);
    }
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
      name: "Amount",
      selector: "amount",
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
                onClick={() => showDeleteModalTax(rows)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataTaxes = () => {
    return allTaxTypes.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        type: item.Tax_Type.name,
        tax_type_id: item.tax_type_id,
        amount: item.value + "%",
        outlet_id: item.Outlet_Taxes.map((item) => item.outlet_id)
      };
    });
  };

  return (
    <Row>
      <ModalTax
        stateModal={stateAddModal}
        cancelModal={cancelAddModalTax}
        title={"Add New Tax/Charges"}
        loading={loading}
        formikTax={formikTax}
        validationTax={validationTax}
        allTypes={allTypes}
        allOutlets={allOutlets}
        handleSelectOutlet={handleSelectOutlet}
      />

      <ModalTax
        stateModal={stateEditModal}
        cancelModal={cancelEditModalTax}
        title={`Edit Tax - ${formikTaxEdit.getFieldProps("name").value}`}
        loading={loading}
        formikTax={formikTaxEdit}
        validationTax={validationTaxEdit}
        allTypes={allTypes}
        allOutlets={allOutlets}
        handleSelectOutlet={handleSelectOutlet}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalTax}
        title={`Delete Tax - ${formikTax.getFieldProps("name").value}`}
        body={"Are you sure want to delete?"}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteTax}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Tax & Charges</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalTax}
              >
                Add New Tax
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
                  <FormControl
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
                </Row>
              </Col>
            </Row>
          </div>

          <DataTable
            noHeader
            pagination
            columns={columns}
            data={dataTaxes()}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};