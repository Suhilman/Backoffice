import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Dropdown,
  InputGroup,
  ListGroup
} from "react-bootstrap";
import FormControlB from "react-bootstrap/FormControl";
import DataTable from "react-data-table-component";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import { useStyles } from "../ProductPage";

import ConfirmModal from "../../../components/ConfirmModal";

const ProductTab = ({ refresh, handleRefresh }) => {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const [allProducts, setAllProducts] = React.useState([]);

  const [productId, setProductId] = React.useState("");
  const [status, setStatus] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showConfirmModal = id => {
    setProductId(id);
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const getProduct = async () => {
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

  const handleChangeStatus = async id => {
    let currentStatus;

    const edited = allProducts.map(item => {
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

    try {
      await axios.patch(`${API_URL}/api/v1/product/status/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setAllProducts(edited);
  };

  const productData = data => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        category: item.Product_Category ? item.Product_Category.name : "",
        price: item.price,
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
      cell: rows => {
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
      cell: rows => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link to={`/product/${rows.id}`}>
                <Dropdown.Item as="button">Edit</Dropdown.Item>
              </Link>
              <Dropdown.Item
                as="button"
                onClick={() => showConfirmModal(rows.id)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const ExpandableComponent = ({ data }) => {
    return (
      <>
        {data.variants.map(item => {
          return (
            <ListGroup
              key={item.id}
              style={{ padding: "1rem", marginLeft: "1rem" }}
            >
              <ListGroup.Item>
                <Row>
                  <Col md={1} style={{ fontWeight: "700" }}>
                    Variant
                  </Col>
                  <Col>{item.name}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col md={1} style={{ fontWeight: "700" }}>
                    Barcode
                  </Col>
                  <Col>{item.barcode || "-"}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col md={1} style={{ fontWeight: "700" }}>
                    SKU
                  </Col>
                  <Col>{item.sku || "-"}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col md={1} style={{ fontWeight: "700" }}>
                    Size
                  </Col>
                  <Col>{item.size || "-"}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col md={1} style={{ fontWeight: "700" }}>
                    Type
                  </Col>
                  <Col>{item.type || "-"}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col md={1} style={{ fontWeight: "700" }}>
                    Price
                  </Col>
                  <Col>{item.price}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          );
        })}
      </>
    );
  };

  const handleDelete = async () => {
    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product/${productId}`);
      setAllProducts(allProducts.filter(item => item.id !== productId));
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
        title="Delete Product"
        body="Are you sure want to delete?"
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />

      <Col md={12}>
        <div className={classes.header}>
          <div className={classes.headerStart}>
            <h3>Product List</h3>
          </div>
          <div className={classes.headerEnd}>
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

        <div className={`${classes.filter} ${classes.divider}`}>
          <InputGroup className="pb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControlB placeholder="Search..." />
          </InputGroup>

          <Form className="pt-3">
            <Form.Row>
              <Col>
                <Form.Group as={Row}>
                  <Col>
                    <Form.Control as="select" defaultValue={"Default"}>
                      <option value="Default" disabled hidden>
                        Category
                      </option>
                      <option>Food</option>
                      <option>Beverages</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group as={Row}>
                  <Col>
                    <Form.Control as="select" defaultValue={"Default"}>
                      <option value="Default" disabled hidden>
                        Status
                      </option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Col>
            </Form.Row>
          </Form>
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
      </Col>
    </Row>
  );
};

export default ProductTab;
