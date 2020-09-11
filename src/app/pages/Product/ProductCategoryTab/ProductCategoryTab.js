import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Row,
  Col,
  Button,
  Alert,
  Dropdown,
  InputGroup,
  Form
} from "react-bootstrap";
import { Paper } from "@material-ui/core";

import DataTable from "react-data-table-component";
import { Search, MoreHoriz } from "@material-ui/icons";

import ConfirmModal from "../../../components/ConfirmModal";
import ProductCategoryModal from "./ProductCategoryModal";

import "../../style.css";

const ProductCategoryTab = ({ refresh, handleRefresh }) => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertModal, setAlertModal] = React.useState("");

  const [allCategories, setAllCategories] = React.useState([]);

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const [showEditCategory, setShowEditCategory] = React.useState(false);

  const inputRef = React.useRef();

  const initialCategory = {
    id: "",
    name: ""
  };

  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters")
      .max(50, "Maximum 50 characters")
      .required("Please input a category")
  });

  const formikAddCategory = useFormik({
    initialValues: initialCategory,
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        setAlert("");
        enableLoading();
        await axios.post(`${API_URL}/api/v1/product-category`, values);

        getProductCategory();

        handleRefresh();
        disableLoading();
        closeAddCategoryModal();
      } catch (err) {
        disableLoading();
        setAlertModal(err.response.data.message);
      }
    }
  });

  const formikEditCategory = useFormik({
    enableReinitialize: true,
    initialValues: initialCategory,
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        setAlert("");
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/product-category/${values.id}`,
          values
        );

        getProductCategory();

        handleRefresh();
        disableLoading();
        closeEditCategoryModal();
      } catch (err) {
        disableLoading();
        setAlertModal(err.response.data.message);
      }
    }
  });

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showAddCategoryModal = () => {
    setShowAddCategory(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };
  const closeAddCategoryModal = () => {
    setAlertModal("");
    formikAddCategory.setFieldValue("name", "");
    setShowAddCategory(false);
  };

  const showEditCategoryModal = (data) => {
    setAlertModal("");
    formikEditCategory.setFieldValue("id", data.id);
    formikEditCategory.setFieldValue("name", data.name);
    setShowEditCategory(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };
  const closeEditCategoryModal = () => setShowEditCategory(false);

  const showConfirmModal = (data) => {
    formikEditCategory.setFieldValue("id", data.id);
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const getProductCategory = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
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

  const categoryData = (data) => {
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
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
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
    const categoryId = formikEditCategory.getFieldProps("id").value;
    const API_URL = process.env.REACT_APP_API_URL;

    enableLoading();
    await axios.delete(`${API_URL}/api/v1/product-category/${categoryId}`);

    setAllCategories(allCategories.filter((item) => item.id !== categoryId));
    handleRefresh();

    disableLoading();
    closeConfirmModal();
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
        title="Add Product Category"
        formikCategory={formikAddCategory}
        inputRef={inputRef}
      />

      <ProductCategoryModal
        state={showEditCategory}
        closeModal={closeEditCategoryModal}
        loading={loading}
        alert={alertModal}
        title="Edit Product Category"
        formikCategory={formikEditCategory}
        inputRef={inputRef}
      />

      <Col md={12} style={{ minHeight: "100%" }}>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <Paper elevation={2} style={{ padding: "1rem" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Product Category List</h3>
            </div>
            <div className="headerEnd">
              <Button variant="primary" onClick={showAddCategoryModal}>
                Add New Product Category
              </Button>
            </div>
          </div>

          <div className="filterSection lineBottom">
            <InputGroup className="pb-3">
              <InputGroup.Prepend>
                <InputGroup.Text style={{ background: "transparent" }}>
                  <Search />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control placeholder="Search..." />
            </InputGroup>
          </div>

          <DataTable
            noHeader
            pagination
            columns={columns}
            data={categoryData(allCategories)}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};

export default ProductCategoryTab;
