import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import rupiahFormat from "rupiah-format";

import ConfirmModal from "../../../components/ConfirmModal";

import "../../style.css";

const ProductTab = ({ refresh, handleRefresh }) => {
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [allProducts, setAllProducts] = React.useState([]);
  const [product, setProduct] = React.useState({
    id: "",
    name: ""
  });

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showConfirmModal = (data) => {
    setProduct({ id: data.id, name: data.name });
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const getProduct = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const products = await axios.get(`${API_URL}/api/v1/product`);
      setAllProducts(products.data.data);
    } catch (err) {
      setAllProducts([]);
    }
  };

  React.useEffect(() => {
    getProduct();
  }, [refresh]);

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

  const productData = (data) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        category: item.Product_Category ? item.Product_Category.name : "",
        price: rupiahFormat.convert(item.price),
        outlet: item.Outlet.name,
        variants: item.Product_Variants,
        status: item.status
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
              <Link to={`/product/${rows.id}`}>
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

  const ExpandableComponent = ({ data }) => {
    const keys = [
      {
        key: "Variant Name",
        value: "name"
      },
      {
        key: "Barcode",
        value: "barcode"
      },
      {
        key: "SKU",
        value: "sku"
      },
      {
        key: "Price",
        value: "price"
      }
    ];

    return (
      <>
        {data.variants.map((item) => {
          return (
            <ListGroup
              key={item.id}
              style={{ padding: "1rem", marginLeft: "1rem" }}
            >
              {keys.map((val, index) => {
                return (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={3} style={{ fontWeight: "700" }}>
                        {val.key}
                      </Col>
                      {val.value === "price" ? (
                        <Col>
                          {rupiahFormat.convert(item[val.value]) || "-"}
                        </Col>
                      ) : (
                        <Col>{item[val.value] || "-"}</Col>
                      )}
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          );
        })}
      </>
    );
  };

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

      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Product List</h3>
            </div>
            <div className="headerEnd">
              <Button variant="outline-secondary">Import</Button>
              <Button
                variant="outline-secondary"
                style={{ marginLeft: "0.5rem" }}
              >
                Export
              </Button>
              <Link to="/product/add-product">
                <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  Add New Product
                </Button>
              </Link>
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
                  <Form.Control placeholder="Search..." />
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
                        <Form.Control as="select" defaultValue={"all"}>
                          <option value="all" disabled hidden>
                            All
                          </option>
                          <option>Food</option>
                          <option>Beverages</option>
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
                        <Form.Control as="select" defaultValue={"all"}>
                          <option value="all" disabled hidden>
                            All
                          </option>
                          <option>Active</option>
                          <option>Inactive</option>
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
          />
        </Paper>
      </Col>
    </Row>
  );
};

export default ProductTab;
