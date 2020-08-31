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

const ProductModifierTab = ({
  allOutlets,
  allCategories,
  allProductModifiers,
  setAllCategories,
  refresh,
  handleRefresh
}) => {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const [categoryId, setCategoryId] = React.useState(false);
  const [outletId, setOutletId] = React.useState("");

  const [categoryName, setCategoryName] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertModal, setAlertModal] = React.useState("");

  const [showConfirm, setShowConfirm] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showConfirmModal = id => {
    setCategoryId(id);
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const handleSelectOutlet = e => {
    setAlert("");
    setOutletId(e.target.value);
  };

  const modifierData = (data, dataCategory) => {
    if (!data.length || !dataCategory.length) {
      return;
    }

    return dataCategory.map((item, index) => {
      const modifiers = data
        .filter(
          val =>
            item.name ===
            (val.Product_Category ? val.Product_Category.name : "")
        )
        .map(val => val.name)
        .join(", ");

      return {
        id: item.id,
        no: index + 1,
        group: item.name,
        modifiers
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
      name: "Product Group",
      selector: "group",
      sortable: true
    },
    {
      name: "Modifiers",
      selector: "modifiers"
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
              <Link
                to={{
                  pathname: `/product/edit-product-modifier/${rows.id}`,
                  state: { allOutlets, allCategories }
                }}
              >
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

      <Col md={12}>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <div className={classes.header}>
          <div className={classes.headerStart}>
            <h3>Product Modifier List</h3>
          </div>
          <div className={classes.headerEnd}>
            <Link
              to={{
                pathname: "/product/add-product-modifier",
                state: { allOutlets, allCategories }
              }}
            >
              <Button variant="primary">Add New Product Modifier</Button>
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
            <FormControl placeholder="Search..." />
          </InputGroup>
        </div>

        <DataTable
          noHeader
          pagination
          columns={columns}
          data={modifierData(allProductModifiers, allCategories)}
          style={{ minHeight: "100%" }}
        />
      </Col>
    </Row>
  );
};

export default ProductModifierTab;
