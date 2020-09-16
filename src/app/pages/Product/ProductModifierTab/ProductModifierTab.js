import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Button, Dropdown, InputGroup, Form } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import DataTable from "react-data-table-component";
import { Search, MoreHoriz } from "@material-ui/icons";

import ConfirmModal from "../../../components/ConfirmModal";

import "../../style.css";

const ProductModifierTab = ({
  allOutlets,
  allProductModifiers,
  handleRefresh
}) => {
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [modifier, setModifier] = React.useState({
    id: "",
    group: ""
  });

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showConfirmModal = (data) => {
    setModifier({ id: data.id, group: data.group });
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

      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Product Modifier List</h3>
            </div>
            <div className="headerEnd">
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
            data={modifierData(allProductModifiers)}
            style={{ minHeight: "100%" }}
          />
        </Paper>
      </Col>
    </Row>
  );
};

export default ProductModifierTab;
