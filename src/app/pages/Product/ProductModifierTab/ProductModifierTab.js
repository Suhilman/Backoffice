import React from "react";
import { Link } from "react-router-dom";

import {
  Row,
  Col,
  Button,
  Dropdown,
  InputGroup,
  FormControl,
  Alert
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Search, MoreHoriz } from "@material-ui/icons";

import { useStyles } from "../ProductPage";

import ConfirmModal from "../../../components/ConfirmModal";

const ProductModifierTab = ({
  allOutlets,
  allProductModifiers,
  refresh,
  handleRefresh
}) => {
  const classes = useStyles();

  const [categoryId, setCategoryId] = React.useState(false);
  const [outletId, setOutletId] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [showConfirm, setShowConfirm] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showConfirmModal = (id) => {
    setCategoryId(id);
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const modifierData = (data) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
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
              <Link
                to={{
                  pathname: `/product/edit-product-modifier/${rows.id}`,
                  state: { allOutlets }
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
    enableLoading();
    console.log("deleted");
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
                state: { allOutlets }
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
          data={modifierData(allProductModifiers)}
          style={{ minHeight: "100%" }}
        />
      </Col>
    </Row>
  );
};

export default ProductModifierTab;
