import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { ExcelRenderer } from "react-excel-renderer";
import dayjs from "dayjs";
import Select from "react-select";
import NumberFormat from 'react-number-format'

import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
  ButtonGroup,
  ListGroup
} from "react-bootstrap";
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
import ExportModal from "./ExportModal"

import "../../style.css";

const ProductTab = ({
  t,
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
  const [stateExport, setStateExport] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [filename, setFilename] = React.useState("");
  const [outletProduct, setOutletProduct] = React.useState([])
  const [dataProduct, setDataProduct] = React.useState([])
  const [currency, setCurrency] = React.useState("")

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

  const handleOutletProduct = (data) => {
    var uniqueArray = [];
    for(let i = 0; i < data.length; i++){
      if(uniqueArray.indexOf(data[i].Outlet.name) === -1) {
        uniqueArray.push(data[i].Outlet.name);
      }
    }
    setOutletProduct(uniqueArray)
  }

  const handleExports = (data) => {
    if (data) {
      const result = []
      allProducts.map((value) => {
        data.map(value2 => {
          if (value.Outlet.name === value2.label) {
            result.push(value)
          }
        })
      })
      setDataProduct(result)
    } else {
      setDataProduct([])
    }
  }

  const avoidExport = () => {
    setTimeout(() => {
      setDataProduct([])
    }, 2000);
  }

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
      const { data } = await axios.get(
        `${API_URL}/api/v1/product${filterProduct}`
      );
      setAllProducts(data.data);
      handleOutletProduct(data.data)
    } catch (err) {
      setAllProducts([]);
    }
  };

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
    setCurrency(data.data.Currency.name)
  }

  React.useEffect(() => {
    handleCurrency()
  }, [])

  React.useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    getProduct(debouncedSearch, filter);
    return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
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

      const bundleItems = [];
      let initial_stock_id;
      if (item.has_stock) {
        if (item.Stocks.length) {
          const currStock = item.Stocks.find((val) => val.is_initial);

          if (currStock) {
            initial_stock_id = currStock.id;

            for (const bundle of currStock.Product_Bundle) {
              bundleItems.push({
                id: bundle.id,
                stock_id: bundle.stock_child_id,
                // quantity: bundle.quantity,
                base_system_price: bundle.Bundle_Items.Product.price,
                system_price: bundle.Bundle_Items.Product.price
                // system_price:
                //   bundle.Bundle_Items.Product.price * bundle.quantity,
                // max_quantity: bundle.Bundle_Items.stock
              });
            }
          }
        }
      }
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        category: item.Product_Category ? item.Product_Category.name : "-",
        // purchase_price: item.price_purchase
        //   ? rupiahFormat.convert(item.price_purchase)
        //   : rupiahFormat.convert(0),
        price: <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={currency} />,
        stock: item.stock,
        outlet: item.Outlet?.name,
        unit: item.Unit?.name || "-",
        status: item.status,
        currProduct: item,
        groupAddons,
        bundleItems,
        initial_stock_id
      };
    });
  };
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: `${t("titleTabProduct")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("category")}`,
      selector: "category",
      sortable: true
    },
    {
      name: `${t("price")}`,
      selector: "price",
      sortable: true
    },
    {
      name: `${t("outlet")}`,
      selector: "outlet",
      sortable: true
    },
    {
      name: `${t("stock")}`,
      selector: "stock",
      sortable: true
    },
    {
      name: `${t("unit")}`,
      selector: "unit",
      sortable: true
    },
    {
      name: `${t("status")}`,
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
      name: `${t("actions")}`,
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link
                to={{
                  pathname: rows.currProduct.is_bundle
                    ? `/product-bundle/${rows.id}`
                    : `/product/${rows.id}`,
                  state: {
                    allOutlets,
                    allCategories,
                    allTaxes,
                    allUnit,
                    allMaterials,
                    allProducts,
                    currProduct: rows.currProduct,
                    groupAddons: rows.groupAddons,
                    bundleItems: rows.bundleItems,
                    initial_stock_id: rows.initial_stock_id
                  }
                }}
              >
                <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showConfirmModal(rows)}>
                {t("delete")}
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
        outlet: "",
        name: "",
        category: "",
        price: 0,
        price_purchase: 0,
        description: "",
        status: false,
        is_favorite: false,
        sku: 0,
        barcode: 0,
        pajak: 0,
        with_recipe: false,
        stok_awal: 0
      }
    ]
  };

  const formikImportProduct = useFormik({
    initialValues: initialValueImportProduct,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      try {
        if (!values.outlet_id.length) {
          throw new Error(`${t("minimum1Character")}`);
        }

        const merged = values.outlet_id.map((item) => {
          const output = [];
          for (const val of values.products) {
            if(val.name && val.sku && val.price)
            {
            const obj = {
              ...val,
              outlet_id: item,
              stock: val.stock === "-" ? 0 : val.stock,
              expired_date: val.expired_date
                ? dayjs(val.expired_date)
                    .subtract(1, "days")
                    .format("YYYY-MM-DD")
                : ""
            };
            obj.sku = obj.sku.toString();
            // if (!val.barcode) delete obj.barcode;
            // if (!val.category) delete obj.category;
            if (!val.with_recipe) delete obj.with_recipe;
            if (!val.stock) delete obj.stock;
            if (!val.unit) delete obj.unit;
            if (!val.expired_date) delete obj.expired_date;
            output.push(obj);
            }
          }
          return output;
        });
        enableLoading();
        for (const item of merged.flat(1)) {
          if (!item.name) {
            throw new Error("there is product without name");
          }
          if (!item.sku) {
            throw new Error("there is product without sku");
          }
        }
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
  const handleCloseExport = () => {
    setStateExport(false);
    setDataProduct([])
  };
  const getJsDateFromExcel = (excelDate) => {
    return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
  };
  const handleFile = (file) => {
    setFilename(file[0].name);
    ExcelRenderer(file[0], (err, resp) => {
      if (err) {
        setAlert(err);
      } else {
        const { rows } = resp;
        const keys = [
          "name",
          "description",
          "barcode",
          "sku",
          "price_purchase",
          "price",
          "is_favorite",
          "category",
          "with_recipe",
          "stock",
          "unit",
          "expired_date"
        ];
        const data = [];
        const obj = {};
        rows.slice(4).map((j) => {
          keys.map((i, index) => {
            if (i === "barcode") {
              if (j[index]) {
                obj[i] = j[index].toString();
              } else {
                obj[i] = "-";
              }
            } else if (i === "expired_date") {
              if (j[index]) {
                obj[i] = j[index];
              } else {
                obj[i] = "-";
              }
            } else {
              obj[i] = j[index];
            }
          });
          data.push({
            name: obj.name,
            category: obj.category,
            price: obj.price,
            price_purchase: obj.price_purchase,
            description: obj.description,
            is_favorite: obj.is_favorite,
            sku: obj.sku,
            barcode: obj.barcode,
            with_recipe: obj.with_recipe,
            stock: obj.stock,
            unit: obj.unit,
            expired_date: getJsDateFromExcel(obj.expired_date)
          });
        });
        formikImportProduct.setFieldValue("products", data);
      }
    });
  };

  const ExpandableComponent = ({ data }) => {
    const keys = [
      {
        key: "Product",
        value: "name"
      },
      {
        key: "Category",
        value: "category"
      },
      {
        key: "Outlet",
        value: "outlet"
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

      <ExportModal 
        loading={loading}
        state={stateExport}
        closeModal={handleCloseExport}
        optionsOutlet={optionsOutlet}
        handleExports={handleExports}
        dataProduct={dataProduct}
      />

      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              {!selectedData.length ? (
                <h3>{t("productTitle")}</h3>
              ) : (
                <h3>{selectedData.length} {t("itemSelected")}</h3>
              )}
            </div>
            <div className="headerEnd" style={{ display: "flex" }}>
              {!multiSelect ? (
                <>
                  <Button style={{ marginRight: "0.5rem" }} variant="secondary" onClick={() => setStateExport(true)}>
                    {t("export")}
                  </Button>
                  <Button variant="secondary" onClick={handleOpenImport}>
                    {t("import")}
                  </Button>

                  <Dropdown as={ButtonGroup} style={{ marginLeft: "0.5rem" }}>
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
                      className="btn btn-primary"
                    >
                      <div>{t("addNewProduct")}</div>
                    </Link>

                    <Dropdown.Toggle split variant="primary" />

                    <Dropdown.Menu>
                      <Link
                        to={{
                          pathname: "/product-bundle/add",
                          state: {
                            allCategories,
                            allOutlets,
                            allProducts
                          }
                        }}
                      >
                        <Dropdown.Item as="button">
                          {t("addNewProductBundle")}
                        </Dropdown.Item>
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Button
                  variant="danger"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => showConfirmBulkModal(selectedData)}
                >
                  {t("delete")}
                </Button>
              )}
              {allProducts.length ? (
                <Button
                  variant={!multiSelect ? "danger" : "secondary"}
                  style={{ marginLeft: "0.5rem" }}
                  onClick={handleMode}
                >
                  {!multiSelect ? <Delete /> : `${t("cancel")}`}
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
                        {t("category")}
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="category"
                          value={filter.category}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
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
                        {t("outlet")}
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="outlet"
                          value={filter.outlet}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
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
                        {t("status")}
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="status"
                          value={filter.status}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
                          <option value="active">{t("active")}</option>
                          <option value="inactive">{t("inactive")}</option>
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
            expandableRows
            expandableRowsComponent={<ExpandableComponent />}
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
