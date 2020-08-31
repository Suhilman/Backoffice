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
  FormControl,
  ListGroup
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Search, MoreHoriz } from "@material-ui/icons";

import { useStyles } from "../ProductPage";

import ConfirmModal from "../../../components/ConfirmModal";

const ProductCategoryTab = ({ allOutlets, refresh, handleRefresh }) => {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const [categoryId, setCategoryId] = React.useState(false);
  const [outletId, setOutletId] = React.useState("");

  const [categoryName, setCategoryName] = React.useState("");

  const [allCategories, setAllCategories] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertModal, setAlertModal] = React.useState("");

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const [showEditCategory, setShowEditCategory] = React.useState(false);
  const [showAddProduct, setShowAddProduct] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showAddCategoryModal = () => {
    setCategoryName("");
    setShowAddCategory(true);
  };
  const closeAddCategoryModal = () => setShowAddCategory(false);

  const showEditCategoryModal = data => {
    setCategoryId(data.id);
    setCategoryName(data.name);
    setOutletId(data.outlet_id);
    setShowEditCategory(true);
  };
  const closeEditCategoryModal = () => setShowEditCategory(false);

  const showAddProductModal = data => {
    setCategoryId(data.id);
    setOutletId(data.outlet_id);
    setShowAddProduct(true);
  };
  const closeAddProductModal = () => setShowAddProduct(false);

  const showConfirmModal = data => {
    setCategoryId(data.id);
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const getProductCategory = async () => {
    try {
      const allCategories = await axios.get(
        `${API_URL}/api/v1/product-category`
      );
      setAllCategories(allCategories.data.data);
    } catch (err) {
      setAllCategories([]);
    }
  };

  React.useEffect(() => {
    getProductCategory();
  }, [refresh]);

  const handleSelectOutlet = e => setOutletId(e.target.value);

  const handleChangeCategory = e => setCategoryName(e.target.value);

  const handleAddSave = async e => {
    e.preventDefault();

    const categoryData = { name: categoryName, outlet_id: outletId };

    try {
      setAlert("");
      enableLoading();
      await axios.post(`${API_URL}/api/v1/product-category`, categoryData);

      getProductCategory();

      handleRefresh();
      disableLoading();
      closeAddCategoryModal();
    } catch (err) {
      console.log(err);
      disableLoading();
      setAlertModal(err.response.data.message);
    }
  };

  const handleEditSave = async e => {
    e.preventDefault();

    const categoryData = {
      name: categoryName,
      outlet_id: outletId
    };

    try {
      setAlert("");
      enableLoading();
      await axios.put(
        `${API_URL}/api/v1/product-category/${categoryId}`,
        categoryData
      );

      const changeCategoryName = allCategories.map(item => {
        if (item.id === categoryId) {
          item.name = categoryName;
        }

        return item;
      });

      setAllCategories(changeCategoryName);
      handleRefresh();
      disableLoading();
      closeEditCategoryModal();
    } catch (err) {
      console.log(err);
      disableLoading();
      setAlertModal(err.response.data.message);
    }
  };

  const categoryData = (data, outletData) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        products: item.Products.length
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
      name: "Category Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Number of Products",
      selector: "products",
      sortable: true
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
              <Dropdown.Item
                as="button"
                onClick={() => showAddProductModal(rows)}
              >
                Add Product
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showEditCategoryModal(rows)}
              >
                Edit
              </Dropdown.Item>
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
    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product-category/${categoryId}`);
      setAllCategories(allCategories.filter(item => item.id !== categoryId));
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
        title="Delete Product Category"
        body="Are you sure want to delete?"
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />

      <ProductCategoryModal
        state={showAddCategory}
        closeModal={closeAddCategoryModal}
        loading={loading}
        alert={alertModal}
        handleClick={handleAddSave}
        categoryName={categoryName}
        handleChangeCategory={handleChangeCategory}
        title="Add"
        handleSelectOutlet={handleSelectOutlet}
        allOutlets={allOutlets}
      />

      <ProductCategoryModal
        state={showEditCategory}
        closeModal={closeEditCategoryModal}
        loading={loading}
        alert={alertModal}
        handleClick={handleEditSave}
        categoryName={categoryName}
        handleChangeCategory={handleChangeCategory}
        title="Edit"
      />

      <Col md={12}>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <div className={classes.header}>
          <div className={classes.headerStart}>
            <h3>Product Category List</h3>
          </div>
          <div className={classes.headerEnd}>
            <Button variant="primary" onClick={showAddCategoryModal}>
              Add New Product Category
            </Button>
          </div>
        </div>

        <div className={`${classes.filter} ${classes.divider}`}>
          <InputGroup className="pb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Search..." />
          </InputGroup>
        </div>

        {allOutlets.length ? (
          <DataTable
            noHeader
            pagination
            columns={columns}
            data={categoryData(allCategories, allOutlets)}
            style={{ minHeight: "100%" }}
          />
        ) : (
          ""
        )}
      </Col>
    </Row>
  );
};

const ProductCategoryModal = ({
  handleClick,
  state,
  closeModal,
  loading,
  alert,
  categoryName,
  handleChangeCategory,
  title,
  handleSelectOutlet,
  allOutlets
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title} Product Category</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <Form onSubmit={handleClick}>
          {title === "Add" ? (
            <Form.Group>
              <Form.Label>Outlet</Form.Label>
              <Form.Control
                as="select"
                defaultValue={"Default"}
                onChange={handleSelectOutlet}
              >
                <option value={"Default"} disabled hidden>
                  Choose Outlet
                </option>
                {allOutlets
                  ? allOutlets.map(item => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })
                  : ""}
              </Form.Control>
            </Form.Group>
          ) : (
            ""
          )}

          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={handleChangeCategory}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button onClick={handleClick}>
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            "Save changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const AddProductModal = ({
  handleClick,
  state,
  closeModal,
  loading,
  alert,
  categoryName,
  handleChangeCategory,
  title,
  handleSelectOutlet,
  allOutlets
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          Add Product to <em>{categoryName}</em>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <Form onSubmit={handleClick}>
          <Form.Group>
            <Form.Label>Outlet</Form.Label>
            <Form.Control
              as="select"
              defaultValue={"Default"}
              onChange={handleSelectOutlet}
            >
              <option value={"Default"} disabled hidden>
                Choose Outlet
              </option>
              {allOutlets
                ? allOutlets.map(item => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })
                : ""}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={handleChangeCategory}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button onClick={handleClick}>
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            "Save changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductCategoryTab;
