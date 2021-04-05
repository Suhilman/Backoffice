import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";

import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalTable from "./ModalTable";
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const TableManagementTab = ({ handleRefresh, refresh }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const { t } = useTranslation();
  const [allTables, setAllTables] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const getTables = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterTable = search ? `?name=${search}` : "";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/table-management${filterTable}`
      );
      setAllTables(data.data);
    } catch (err) {
      setAllTables([]);
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

  React.useEffect(() => {
    getTables(debouncedSearch);
  }, [refresh, debouncedSearch]);

  React.useEffect(() => {
    getOutlets();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const initialValueTable = {
    id: "",
    business_id: "",
    outlet_id: "",
    name: "",
    capacity: "",
    status: "available"
  };

  const TableSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please input an outlet."),
    name: Yup.string()
      .min(3, "Minimum 3 characters.")
      .max(50, "Maximum 50 characters.")
      .required("Please input a name."),
    capacity: Yup.number()
      .integer()
      .min(1)
      .required("Please input a capacity."),
    status: Yup.string()
      .matches(/(available)/)
      .required("Please input a status.")
  });

  const formikTable = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTable,
    validationSchema: TableSchema,
    onSubmit: async (values) => {
      const tableData = {
        outlet_id: values.outlet_id,
        name: values.name,
        capacity: values.capacity,
        status: values.status
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/table-management`, tableData);
        handleRefresh();
        disableLoading();
        cancelAddModalTable();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const formikTableEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTable,
    validationSchema: TableSchema,
    onSubmit: async (values) => {
      const tableData = {
        outlet_id: values.outlet_id,
        name: values.name,
        capacity: values.capacity,
        status: values.status
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/table-management/${values.id}`,
          tableData
        );
        handleRefresh();
        disableLoading();
        cancelEditModalTable();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationTable = (fieldname) => {
    if (formikTable.touched[fieldname] && formikTable.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikTable.touched[fieldname] && !formikTable.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const validationTableEdit = (fieldname) => {
    if (
      formikTableEdit.touched[fieldname] &&
      formikTableEdit.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikTableEdit.touched[fieldname] &&
      !formikTableEdit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalTable = () => setStateAddModal(true);
  const cancelAddModalTable = () => {
    formikTable.resetForm();
    setStateAddModal(false);
  };

  const showEditModalTable = (data) => {
    formikTableEdit.setValues({
      id: data.id,
      outlet_id: data.outlet_id,
      name: data.name,
      business_id: data.business_id,
      capacity: data.capacity,
      status: data.status
    });
    setStateEditModal(true);
  };
  const cancelEditModalTable = () => {
    formikTableEdit.resetForm();
    setStateEditModal(false);
  };
  const showDeleteModalTable = (data) => {
    formikTable.setFieldValue("id", data.id);
    formikTable.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalTable = () => {
    formikTable.resetForm();
    setStateDeleteModal(false);
  };

  const handleDeleteTable = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const payment_id = formikTable.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/table-management/${payment_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalTable();
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
      name: `${t("outletName")}`,
      selector: "outlet_name",
      sortable: true
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("capacity")}`,
      selector: "capacity",
      sortable: true
    },
    {
      name: `${t("status")}`,
      selector: "status",
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
                onClick={() => showEditModalTable(rows)}
              >
                {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalTable(rows)}
              >
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataTables = () => {
    return allTables.map((item, index) => {
      return {
        id: item.id,
        business_id: item.business_id,
        outlet_id: item.outlet_id,
        no: index + 1,
        name: item.name,
        outlet_name: item.Outlet?.name,
        capacity: item.capacity,
        status: item.status
      };
    });
  };

  return (
    <Row>
      <ModalTable
        t={t}
        stateModal={stateAddModal}
        cancelModal={cancelAddModalTable}
        title={t("addNewTable")}
        loading={loading}
        formikTable={formikTable}
        validationTable={validationTable}
        allOutlets={allOutlets}
      />

      <ModalTable
        t={t}
        stateModal={stateEditModal}
        cancelModal={cancelEditModalTable}
        title={`${t("editTable")} - ${formikTableEdit.getFieldProps("name").value}`}
        loading={loading}
        formikTable={formikTableEdit}
        validationTable={validationTableEdit}
        allOutlets={allOutlets}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalTable}
        title={`${t("deleteTable")} - ${formikTable.getFieldProps("name").value}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteTable}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>{t("tableManagement")}</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalTable}
              >
                {t("addNewTable")}
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
                    placeholder={t("search")}
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
            data={dataTables()}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};
