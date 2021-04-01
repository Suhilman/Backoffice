import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

import { Paper } from "@material-ui/core";
import {
  Button,
  InputGroup,
  Form,
  Row,
  Col,
  Dropdown,
  ListGroup
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import AddModal from "./RawMaterial/AddModal";
import EditModal from "./RawMaterial/EditModal";
import ConfirmModal from "../../../components/ConfirmModal";

const InventoryIngredientTab = ({
  allOutlets,
  allCategories,
  allUnits,
  refresh,
  handleRefresh
}) => {
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });

  const [rawMaterial, setRawMaterial] = React.useState([]);

  const [currMaterial, setCurrMaterial] = React.useState({
    id: "",
    name: ""
  });
  const initialValueMaterial = {
    outlet_id: "",
    name: "",
    raw_material_category_id: "",
    stock: "",
    unit_id: "",
    price_per_unit: "",
    calorie_per_unit: "",
    calorie_unit: "",
    notes: "",
    is_sold: false
  };
  const initialValueMaterialEdit = {
    id: "",
    outlet_id: "",
    name: "",
    raw_material_category_id: "",
    stock: "",
    unit_id: "",
    calorie_per_unit: "",
    price_per_unit: "",
    calorie_unit: "",
    notes: "",
    stock_id: "",
    is_sold: false
  };

  const MaterialSchema = Yup.object().shape({
    outlet_id: Yup.number().required("Please choose outlet"),
    name: Yup.string()
      .min(1, "Minimum 1 character")
      .required("Please input name"),
    raw_material_category_id: Yup.number().required("Please choose category"),
    stock: Yup.number().required("Please input stock"),
    unit_id: Yup.number().required("Please choose unit"),
    price_per_unit: Yup.number().required("Please input price per unit"),
    calorie_per_unit: Yup.number().required("Please input calorie"),
    calorie_unit: Yup.string().required("Please input calorie unit"),
    notes: Yup.string().min(1, "Minimum 1 character"),
    is_sold: Yup.boolean()
  });

  const MaterialEditSchema = Yup.object().shape({
    outlet_id: Yup.number().required("Please choose outlet"),
    name: Yup.string()
      .min(1, "Minimum 1 character")
      .required("Please input name"),
    raw_material_category_id: Yup.number().required("Please choose category"),
    stock: Yup.number().required("Please input stock"),
    unit_id: Yup.number().required("Please choose unit"),
    price_per_unit: Yup.number().required("Please input price per unit"),
    notes: Yup.string().min(1, "Minimum 1 character"),
    is_sold: Yup.boolean()
  });

  const formikMaterial = useFormik({
    initialValues: initialValueMaterial,
    validationSchema: MaterialSchema,
    onSubmit: async (values) => {
      const materialData = {
        outlet_id: values.outlet_id,
        name: values.name,
        raw_material_category_id: values.raw_material_category_id,
        stock: values.stock,
        unit_id: values.unit_id,
        price_per_unit: values.price_per_unit,
        calorie_per_unit: values.calorie_per_unit,
        calorie_unit: values.calorie_unit,
        notes: values.notes,
        is_sold: values.is_sold
      };

      try {
        console.log('ini data materialnya', materialData)
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.post(`${API_URL}/api/v1/raw-material`, materialData);
        handleRefresh();
        disableLoading();
        closeAddModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationMaterial = (fieldname) => {
    if (formikMaterial.touched[fieldname] && formikMaterial.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikMaterial.touched[fieldname] &&
      !formikMaterial.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const formikEditMaterial = useFormik({
    initialValues: initialValueMaterialEdit,
    validationSchema: MaterialEditSchema,
    onSubmit: async (values) => {
      const materialData = {
        outlet_id: values.outlet_id,
        name: values.name,
        raw_material_category_id: values.raw_material_category_id,
        stock: values.stock,
        unit_id: values.unit_id,
        price_per_unit: values.price_per_unit, 
        calorie_per_unit: values.calorie_per_unit,
        calorie_unit: values.calorie_unit,
        notes: values.notes,
        stock_id: values.stock_id,
        is_sold: values.is_sold
      };
      console.log('data edit', materialData)
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/raw-material/${values.id}`,
          materialData
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

  const validationEditMaterial = (fieldname) => {
    if (
      formikEditMaterial.touched[fieldname] &&
      formikEditMaterial.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikEditMaterial.touched[fieldname] &&
      !formikEditMaterial.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getRawMaterial = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filter = `?name=${search}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/raw-material${filter}`
      );
      setRawMaterial(data.data);
    } catch (err) {
      setRawMaterial([]);
    }
  };

  React.useEffect(() => {
    getRawMaterial(debouncedSearch);
  }, [refresh, debouncedSearch]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSearch = (e) => setSearch(e.target.value);
  // const handleFilter = (e) => {
  //   const { name, value } = e.target;
  //   const filterData = { ...filter };
  //   filterData[name] = value;
  //   setFilter(filterData);
  // };

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    setAlert("");
    formikMaterial.resetForm();
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    console.log('data show edit modal', data)
    formikEditMaterial.setValues({
      id: data.id,
      outlet_id: data.outlet_id,
      name: data.name,
      raw_material_category_id: data.raw_material_category_id,
      stock: data.stock,
      unit_id: data.unit_id,
      price_per_unit: data.stocks[0].price_per_unit,
      calorie_per_unit: data.calorie_per_unit,
      calorie_unit: data.calorie_unit,
      notes: data.notes,
      stock_id: data.stock_id,
      is_sold: data.is_sold
    });
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    setAlert("");
    formikEditMaterial.resetForm();
    setStateEditModal(false);
  };

  const showDeleteModal = (data) => {
    setCurrMaterial({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setAlert("");
    setStateDeleteModal(false);
  };

  const handleDeleteMaterial = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/raw-material/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Location",
      selector: "location",
      sortable: true
    },
    {
      name: "Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Stock",
      selector: "stock",
      sortable: true
    },
    {
      name: "Unit",
      selector: "unit_name",
      sortable: true
    },
    {
      name: "Notes",
      selector: "notes",
      sortable: true
    },
    {
      name: "Actions",
      cell: (rows) => {
        console.log('ini rows apa?')
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

  const dataRawMaterial = rawMaterial.map((item, index) => {
    const stock_initial = item.Stocks.find((item) => item.is_initial);

    return {
      id: item.id,
      no: index + 1,
      outlet_id: item.outlet_id,
      location: item.Outlet?.name,
      name: item.name,
      raw_material_category_id: item.raw_material_category_id,
      stock: item.stock,
      unit_id: item.unit_id,
      unit_name: item.Unit?.name || "-",
      calorie_per_unit: item.calorie_per_unit,
      calorie_unit: item.calorie_unit,
      notes: item.notes,
      stock_id: stock_initial ? stock_initial.id : "",
      stocks: item.Stocks,
      is_sold: item.Product ? true : false
    };
  });

  const ExpandableComponent = ({ data }) => {
    const stockData = data.stocks.map((item) => {
      return {
        batch: item.Incoming_Stock
          ? item.Incoming_Stock.code
          : item.Transfer_Stock
          ? item.Transfer_Stock.code
          : "-",
        stock: item.stock || 0,
        unit: item.Unit?.name || "-"
      };
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>Batch</Col>
              <Col style={{ fontWeight: "700" }}>Stock</Col>
              <Col style={{ fontWeight: "700" }}>Unit</Col>
            </Row>
          </ListGroup.Item>
          {stockData.length ? (
            stockData.map((val, index) => {
              return (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col>{val.batch}</Col>
                    <Col>{val.stock}</Col>
                    <Col>{val.unit}</Col>
                  </Row>
                </ListGroup.Item>
              );
            })
          ) : (
            <ListGroup.Item>
              <Row>
                <Col>-</Col>
                <Col>-</Col>
                <Col>-</Col>
              </Row>
            </ListGroup.Item>
          )}
        </ListGroup>
      </>
    );
  };

  return (
    <>
      <AddModal
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title="Add New Raw Material"
        loading={loading}
        alert={alert}
        formikMaterial={formikMaterial}
        validationMaterial={validationMaterial}
        allOutlets={allOutlets}
        allCategories={allCategories}
        allUnits={allUnits}
      />

      <EditModal
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title="Edit Raw Material"
        loading={loading}
        alert={alert}
        formikMaterial={formikEditMaterial}
        validationMaterial={validationEditMaterial}
        allOutlets={allOutlets}
        allCategories={allCategories}
        allUnits={allUnits}
      />

      <ConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`Delete Raw Material - ${currMaterial.name}`}
        body={"Are you sure want to delete?"}
        loading={loading}
        buttonColor="danger"
        handleClick={() => handleDeleteMaterial(currMaterial.id)}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Raw Material</h3>
              </div>
              <div className="headerEnd" style={{ display: "flex" }}>
                <div style={{ marginRight: "0.5rem" }}>
                  <Button variant="primary" onClick={showAddModal}>
                    Add Raw Material
                  </Button>
                </div>

                <Dropdown>
                  <Dropdown.Toggle variant="light">Stock</Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Link
                      to={{
                        pathname: "/ingredient-inventory/incoming-stock"
                      }}
                    >
                      <Dropdown.Item as="button">Incoming Stock</Dropdown.Item>
                    </Link>
                    <Link
                      to={{
                        pathname: "/ingredient-inventory/outcoming-stock"
                      }}
                    >
                      <Dropdown.Item as="button">Outcoming Stock</Dropdown.Item>
                    </Link>
                    <Link
                      to={{
                        pathname: "/ingredient-inventory/transfer-stock"
                      }}
                    >
                      <Dropdown.Item as="button">Transfer Stock</Dropdown.Item>
                    </Link>
                    <Link
                      to={{
                        pathname: "/ingredient-inventory/stock-opname"
                      }}
                    >
                      <Dropdown.Item as="button">Stock Opname</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>

                {/* <Link to={{ pathname: "/inventory/stock-opname" }}>
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                    Stock Opname
                  </Button>
                </Link> */}
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
                      placeholder="Search..."
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>

                {/* <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Time:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="time"
                        value={filter.time}
                        onChange={handleFilter}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col> */}
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataRawMaterial}
              expandableRows
              expandableRowsComponent={<ExpandableComponent />}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default InventoryIngredientTab;
