import React from "react";
import DataTable from "react-data-table-component";
import { Button, Modal, Spinner } from "react-bootstrap";

const AddProductModal = ({
  title,
  handleClick,
  state,
  closeModal,
  loading,
  clearRowsAdd,
  selectedDataAdd,
  handleSelectedAdd,
  allProducts
}) => {
  const columns = [
    // {
    //   name: "No.",
    //   selector: "no",
    //   sortable: true,
    //   width: "50px"
    // },
    {
      name: "Product Name",
      selector: "name"
    },
    {
      name: "Outlet",
      selector: "outlet"
    }
  ];

  const productData = (data) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      return {
        no: index + 1,
        id: item.id,
        name: item.name,
        outlet: item.Outlet.name
      };
    });
  };

  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h3>{selectedDataAdd.length} items selected</h3>

        <DataTable
          noHeader
          columns={columns}
          data={productData(allProducts)}
          style={{ minHeight: "100%" }}
          selectableRows
          onSelectedRowsChange={handleSelectedAdd}
          clearSelectedRows={clearRowsAdd}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClick}>
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

export default AddProductModal;
