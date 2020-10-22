import React from "react";
import axios from "axios";

import { Link } from "react-router-dom";

import { Row, Col, Button, Dropdown, InputGroup, Form } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import DataTable from "react-data-table-component";
import { Search, MoreHoriz, Delete } from "@material-ui/icons";

import ConfirmModal from "../../../components/ConfirmModal";
import AddProductModal from "./AddProductModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

const ProductModifierTab = ({ handleRefresh, refresh, allProducts }) => {
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showConfirmBulk, setShowConfirmBulk] = React.useState(false);
  const [addProductModalState, setAddProductModalState] = React.useState(false);

  const [modifier, setModifier] = React.useState({
    id: "",
    group: ""
  });
  const [allProductModifiers, setAllProductModifiers] = React.useState([]);
  const [groupModifiers, setGroupModifiers] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    group: ""
  });

  const [multiSelect, setMultiSelect] = React.useState(false);
  const [clearRows, setClearRows] = React.useState(true);
  const [selectedData, setSelectedData] = React.useState([]);

  const [selectedModifier, setSelectedModifier] = React.useState({});
  const [selectedDataAdd, setSelectedDataAdd] = React.useState([]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const debouncedSearch = useDebounce(search, 1000);

  const showConfirmBulkModal = (data) => {
    if (!data.length) {
      return handleMode();
    }
    setShowConfirmBulk(true);
  };
  const closeConfirmBulkModal = () => {
    handleMode();
    setShowConfirmBulk(false);
  };

  const showConfirmModal = (data) => {
    setModifier({ id: data.id, group: data.group });
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const showAddProductModal = (data) => {
    setSelectedModifier(data);
    setAddProductModalState(true);
  };
  const closeAddProductModal = () => {
    setAddProductModalState(false);
    setSelectedDataAdd([]);
  };

  const handleMode = () => {
    setSelectedData([]);
    setMultiSelect((state) => !state);
    setClearRows((state) => !state);
  };

  const handleSelected = (state) => setSelectedData(state.selectedRows);
  const handleSelectedAdd = (state) => setSelectedDataAdd(state.selectedRows);

  const handleAddProductModal = async () => {
    if (!selectedDataAdd.length) {
      return closeAddProductModal();
    }

    const API_URL = process.env.REACT_APP_API_URL;
    const productModifierData = {
      group_id: selectedModifier.id,
      product_id: selectedDataAdd.map((item) => item.id)
    };

    try {
      enableLoading();
      await axios.post(
        `${API_URL}/api/v1/modifier/add-to-product`,
        productModifierData
      );
      disableLoading();
      closeAddProductModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleBulkDelete = async (data) => {
    if (!data.length) {
      return handleMode();
    }

    const API_URL = process.env.REACT_APP_API_URL;
    const group_modifier_id = data.map((item) => item.id);

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/modifier/bulk-delete`, {
        data: { group_modifier_id }
      });
      disableLoading();
      handleRefresh();
      closeConfirmBulkModal();
    } catch (err) {
      console.log(err);
    }
  };

  const getGroupModifier = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/group-modifier`);
      setGroupModifiers(data.data);
    } catch (err) {
      setGroupModifiers([]);
    }
  };

  const getProductModifier = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterProductModifier = `?name=${search}&group=${filter.group}`;

    try {
      const modifiers = await axios.get(
        `${API_URL}/api/v1/group-modifier${filterProductModifier}`
      );
      setAllProductModifiers(modifiers.data.data);
    } catch (err) {
      setAllProductModifiers([]);
    }
  };

  React.useEffect(() => {
    getGroupModifier();
  }, [refresh]);

  React.useEffect(() => {
    getProductModifier(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const modifierData = (data) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      return {
        no: index + 1,
        id: item.id,
        group: item.name,
        modifiers: item.Modifiers.map((val) => val.name).join(", ")
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
      name: "Group Modifiers",
      selector: "group"
    },
    {
      name: "Modifiers",
      selector: "modifiers"
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
                onClick={() => showAddProductModal(rows)}
              >
                Add to Products
              </Dropdown.Item>
              <Link to={`/product/edit-product-modifier/${rows.id}`}>
                <Dropdown.Item as="button">Edit</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showConfirmModal(rows)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const handleDelete = async () => {
    enableLoading();
    handleRefresh();
    disableLoading();
    closeConfirmModal();
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  return (
    <Row>
      <ConfirmModal
        title={`Delete Product Modifier - ${modifier.group}`}
        body="Are you sure want to delete?"
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />

      <ConfirmModal
        title={`Delete ${selectedData.length} Selected Modifiers`}
        body="Are you sure want to delete?"
        buttonColor="danger"
        handleClick={() => handleBulkDelete(selectedData)}
        state={showConfirmBulk}
        closeModal={closeConfirmBulkModal}
        loading={loading}
      />

      <AddProductModal
        title={`Add Modifier ${selectedModifier.group} to Products`}
        handleClick={handleAddProductModal}
        state={addProductModalState}
        closeModal={closeAddProductModal}
        loading={loading}
        selectedDataAdd={selectedDataAdd}
        handleSelectedAdd={handleSelectedAdd}
        allProducts={allProducts}
      />

      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              {!selectedData.length ? (
                <h3>Product Modifier List</h3>
              ) : (
                <h3>{selectedData.length} items selected</h3>
              )}
            </div>
            <div className="headerEnd">
              {!multiSelect ? (
                <>
                  <Link to="/product/add-product-modifier">
                    <Button variant="primary">Add New Product Modifier</Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="danger"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => showConfirmBulkModal(selectedData)}
                >
                  Delete
                </Button>
              )}
              {allProductModifiers.length ? (
                <Button
                  variant={!multiSelect ? "danger" : "secondary"}
                  style={{ marginLeft: "0.5rem" }}
                  onClick={handleMode}
                >
                  {!multiSelect ? <Delete /> : "Cancel"}
                </Button>
              ) : (
                ""
              )}
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
              <Col>
                <Form.Group as={Row}>
                  <Form.Label
                    style={{ alignSelf: "center", marginBottom: "0" }}
                  >
                    Group Modifiers:
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      name="group"
                      value={filter.group}
                      onChange={handleFilter}
                    >
                      <option value="">All</option>
                      {groupModifiers.map((item) => {
                        return (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        );
                      })}
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
            data={modifierData(allProductModifiers)}
            style={{ minHeight: "100%" }}
            selectableRows={multiSelect}
            onSelectedRowsChange={handleSelected}
            clearSelectedRows={clearRows}
          />
        </Paper>
      </Col>
    </Row>
  );
};

export default ProductModifierTab;
