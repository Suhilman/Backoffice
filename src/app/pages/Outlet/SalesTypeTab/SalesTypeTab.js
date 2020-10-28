import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";

import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalSalesType from "./ModalSalesType";
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const SalesTypeTab = ({ handleRefresh, refresh }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [AllSalesTypes, setAllSalesTypes] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const getSalesTypes = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterSalesType = search ? `?name=${search}` : "";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/sales-type${filterSalesType}`
      );
      setAllSalesTypes(data.data);
    } catch (err) {
      setAllSalesTypes([]);
    }
  };

  React.useEffect(() => {
    getSalesTypes(debouncedSearch);
  }, [refresh, debouncedSearch]);

  const handleSearch = (e) => setSearch(e.target.value);

  const initialValueSalesType = {
    name: "",
    require_table: false,
    charge: ""
  };

  const SalesTypeSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a name."),
    require_table: Yup.boolean(),
    charge: Yup.number()
      .integer()
      .min(0)
      .required("Please input a charge.")
  });

  const formikSalesType = useFormik({
    enableReinitialize: true,
    initialValues: initialValueSalesType,
    validationSchema: SalesTypeSchema,
    onSubmit: async (values) => {
      const salesTypeData = {
        name: values.name,
        require_table: values.require_table,
        charge: values.charge
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/sales-type`, salesTypeData);
        handleRefresh();
        disableLoading();
        cancelAddModalSalesType();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const formikSalesTypeEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValueSalesType,
    validationSchema: SalesTypeSchema,
    onSubmit: async (values) => {
      const salesTypeData = {
        name: values.name,
        require_table: values.require_table,
        charge: values.charge
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/sales-type/${values.id}`,
          salesTypeData
        );
        handleRefresh();
        disableLoading();
        cancelEditModalSalesType();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationSalesType = (fieldname) => {
    if (
      formikSalesType.touched[fieldname] &&
      formikSalesType.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikSalesType.touched[fieldname] &&
      !formikSalesType.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const validationSalesTypeEdit = (fieldname) => {
    if (
      formikSalesTypeEdit.touched[fieldname] &&
      formikSalesTypeEdit.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikSalesTypeEdit.touched[fieldname] &&
      !formikSalesTypeEdit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalSalesType = () => setStateAddModal(true);
  const cancelAddModalSalesType = () => {
    formikSalesType.resetForm();
    setStateAddModal(false);
  };

  const showEditModalSalesType = (data) => {
    formikSalesTypeEdit.setValues({
      id: data.id,
      name: data.name,
      require_table: data.require_table,
      charge: parseInt(data.charge.slice(0, -1))
    });

    setStateEditModal(true);
  };
  const cancelEditModalSalesType = () => {
    formikSalesTypeEdit.resetForm();
    setStateEditModal(false);
  };
  const showDeleteModalSalesType = (data) => {
    formikSalesType.setFieldValue("id", data.id);
    formikSalesType.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalSalesType = () => {
    formikSalesType.resetForm();
    setStateDeleteModal(false);
  };

  const handleDeleteSalesType = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const sales_type_id = formikSalesType.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/sales-type/${sales_type_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalSalesType();
    } catch (err) {
      disableLoading();
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
      name: "Charge",
      selector: "charge",
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
                onClick={() => showEditModalSalesType(rows)}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalSalesType(rows)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataSalesTypes = () => {
    return AllSalesTypes.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        require_table: item.require_table,
        charge: item.charge + "%"
      };
    });
  };

  return (
    <Row>
      <ModalSalesType
        stateModal={stateAddModal}
        cancelModal={cancelAddModalSalesType}
        title={"Add New Sales Type"}
        loading={loading}
        formikSalesType={formikSalesType}
        validationSalesType={validationSalesType}
      />

      <ModalSalesType
        stateModal={stateEditModal}
        cancelModal={cancelEditModalSalesType}
        title={`Edit Sales Type - ${
          formikSalesTypeEdit.getFieldProps("name").value
        }`}
        loading={loading}
        formikSalesType={formikSalesTypeEdit}
        validationSalesType={validationSalesTypeEdit}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalSalesType}
        title={`Delete Sales Type - ${
          formikSalesType.getFieldProps("name").value
        }`}
        body={"Are you sure want to delete?"}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteSalesType}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Sales Type</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalSalesType}
              >
                Add New Sales Type
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
            </Row>
          </div>

          <DataTable
            noHeader
            pagination
            columns={columns}
            data={dataSalesTypes()}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};
