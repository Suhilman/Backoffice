import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ExcelRenderer } from "react-excel-renderer";

import { Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import { Search, MoreHoriz, Delete } from "@material-ui/icons";

import rupiahFormat from "rupiah-format";
import useDebounce from "../../../hooks/useDebounce";

import ConfirmModal from "../../../components/ConfirmModal";
import ImportModal from "./ImportModal";

import "../../style.css";

const ProductTab = ({
  refresh,
  handleRefresh,
  allCategories,
  allOutlets,
  allTaxes,
  allUnit,
  allMaterials
}) => {
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showConfirmBulk, setShowConfirmBulk] = React.useState(false);
  const [stateImport, setStateImport] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [filename, setFilename] = React.useState("");

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    category: "",
    status: "",
    outlet: ""
  });

  const [allProducts, setAllProducts] = React.useState([]);

  const [product, setProduct] = React.useState({
    id: "",
    name: ""
  });

  const [multiSelect, setMultiSelect] = React.useState(false);
  const [clearRows, setClearRows] = React.useState(true);
  const [selectedData, setSelectedData] = React.useState([]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

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
    setProduct({ id: data.id, name: data.name });
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const debouncedSearch = useDebounce(search, 1000);

  const getProduct = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterProduct = `?name=${search}&product_category_id=${filter.category}&outlet_id=${filter.outlet}&status=${filter.status}`;

    try {
      const products = await axios.get(
        `${API_URL}/api/v1/product${filterProduct}&per_page=1000`
      );
      setAllProducts(products.data.data);
    } catch (err) {
      setAllProducts([]);
    }
  };

  React.useEffect(() => {
    getProduct(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const handleMode = () => {
    setSelectedData([]);
    setMultiSelect((state) => !state);
    setClearRows((state) => !state);
  };

  const handleSelected = (state) => {
    setSelectedData(state.selectedRows);
  };

  const handleBulkDelete = async (data) => {
    if (!data.length) {
      return handleMode();
    }

    const API_URL = process.env.REACT_APP_API_URL;
    const product_id = data.map((item) => item.id);

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product/bulk-delete`, {
        data: { product_id }
      });
      disableLoading();
      handleRefresh();
      closeConfirmBulkModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = allProducts.map((item) => {
      if (item.id === id) {
        if (item.status === "active") {
          item.status = "inactive";
          currentStatus = "inactive";
        } else {
          item.status = "active";
          currentStatus = "active";
        }
      }

      return item;
    });

    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.patch(`${API_URL}/api/v1/product/status/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setAllProducts(edited);
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const productData = (data) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      const groupAddons = item.Group_Addons.map((group) => {
        return {
          id: group.id,
          group_name: group.name,
          group_type: group.type,
          addons: group.Addons.map((addon) => {
            return {
              id: addon.id,
              name: addon.name,
              price: addon.price,
              has_raw_material: addon.has_raw_material,
              raw_material_id: addon.raw_material_id,
              quantity: addon.quantity,
              unit_id: addon.unit_id,
              status: addon.status
            };
          })
        };
      });

      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        category: item.Product_Category ? item.Product_Category.name : "",
        price: rupiahFormat.convert(item.price),
        stock: item.stock,
        outlet: item.Outlet.name,
        unit: item.Unit?.name || "-",
        status: item.status,
        currProduct: item,
        groupAddons
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
      name: "Product",
      selector: "name",
      sortable: true
    },
    {
      name: "Category",
      selector: "category",
      sortable: true
    },
    {
      name: "Price",
      selector: "price",
      sortable: true
    },
    {
      name: "Outlet",
      selector: "outlet",
      sortable: true
    },
    {
      name: "Stock",
      selector: "stock",
      sortable: true
    },
    {
      name: "Unit",
      selector: "unit",
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
              <Link
                to={{
                  pathname: `/product/${rows.id}`,
                  state: {
                    allOutlets,
                    allCategories,
                    allTaxes,
                    allUnit,
                    allMaterials,
                    currProduct: rows.currProduct,
                    groupAddons: rows.groupAddons
                  }
                }}
              >
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
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product/${product.id}`);
      handleRefresh();
      disableLoading();
      closeConfirmModal();
    } catch (err) {
      console.log(err);
    }
  };

  const initialValueImportProduct = {
    outlet_id: [],
    products: [
      {
        name: "",
        price: 0,
        price_purchase: 0,
        product_tax_id: "",
        barcode: "",
        sku: "",
        is_favorite: false,
        description: "",
        status: "active"
      }
    ]
  };

  const ImportProductSchema = Yup.object().shape({
    outlet_id: Yup.array().of(Yup.number().required("Please choose an outlet."))
  });

  const formikImportProduct = useFormik({
    initialValues: initialValueImportProduct,
    validationSchema: ImportProductSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const merged = values.outlet_id.map((item) => {
        const output = [];
        for (const val of values.products) {
          const obj = { ...val, outlet_id: item };
          output.push(obj);
        }
        return output;
      });

      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/product/bulk-create`, {
          products: merged.flat(1)
        });
        disableLoading();
        handleRefresh();
        handleCloseImport();
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const handleOpenImport = () => setStateImport(true);
  const handleCloseImport = () => {
    setStateImport(false);
    setFilename("");
    formikImportProduct.setFieldValue("outlet_id", []);
    formikImportProduct.setFieldValue("products", []);
  };

  const handleFile = (file) => {
    setFilename(file[0].name);
    ExcelRenderer(file[0], (err, resp) => {
      if (err) {
        setAlert(err);
      } else {
        const { rows } = resp;

        const data = [];
        for (const item of rows.slice(1)) {
          const val = rows[0].reduce((init, curr, index) => {
            init[curr] = item[index];
            init["status"] = "active";
            return init;
          }, {});
          data.push(val);
        }

        formikImportProduct.setFieldValue("products", data);
      }
    });
  };

  return (
    <Row>
      <ConfirmModal
        title={`Delete Product - ${product.name}`}
        body="Are you sure want to delete?"
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />

      <ConfirmModal
        title={`Delete ${selectedData.length} Selected Products`}
        body="Are you sure want to delete?"
        buttonColor="danger"
        handleClick={() => handleBulkDelete(selectedData)}
        state={showConfirmBulk}
        closeModal={closeConfirmBulkModal}
        loading={loading}
      />

      <ImportModal
        state={stateImport}
        loading={loading}
        alert={alert}
        closeModal={handleCloseImport}
        formikImportProduct={formikImportProduct}
        allOutlets={allOutlets}
        handleFile={handleFile}
        filename={filename}
      />

      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              {!selectedData.length ? (
                <h3>Product List</h3>
              ) : (
                <h3>{selectedData.length} items selected</h3>
              )}
            </div>
            <div className="headerEnd">
              {!multiSelect ? (
                <>
                  <Button
                    variant="outline-secondary"
                    onClick={handleOpenImport}
                  >
                    Import
                  </Button>
                  {/* <Button
                    variant="outline-secondary"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Export
                  </Button> */}
                  <Link
                    to={{
                      pathname: "/product/add-product",
                      state: {
                        allCategories,
                        allTaxes,
                        allOutlets,
                        allUnit,
                        allMaterials
                      }
                    }}
                  >
                    <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                      Add New Product
                    </Button>
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
              {allProducts.length ? (
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
                <InputGroup>
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
                <Row>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        Category:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="category"
                          value={filter.category}
                          onChange={handleFilter}
                        >
                          <option value="">All</option>
                          {allCategories.map((item) => {
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
                        Outlet:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="outlet"
                          value={filter.outlet}
                          onChange={handleFilter}
                        >
                          <option value="">All</option>
                          {allOutlets.map((item) => {
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
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
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
            data={productData(allProducts)}
            // expandableRows
            // expandableRowsComponent={<ExpandableComponent />}
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

export default ProductTab;
