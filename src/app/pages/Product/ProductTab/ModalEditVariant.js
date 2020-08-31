import React from "react";

import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";

const ModalEditVariant = ({
  showEditVariant,
  closeEditModalVariant,
  loading,
  editProductVariant,
  handleEditSave,
  handleEditChangeVariant
}) => {
  return (
    <Modal show={showEditVariant} onHide={closeEditModalVariant} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Product Variant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editProductVariant.map((item, index) => {
          return (
            <div key={index}>
              <div
                style={{
                  borderBottom: "1px solid #ebedf2",
                  marginBottom: "1rem"
                }}
              >
                <h5>Variant {index + 1}</h5>
              </div>

              <Form>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Variant Name</Form.Label>
                      <Form.Control
                        type="text"
                        name={`name-${index}`}
                        defaultValue={item.name}
                        onChange={handleEditChangeVariant}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control
                        type="text"
                        name={`barcode-${index}`}
                        defaultValue={item.barcode}
                        onChange={handleEditChangeVariant}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control
                        type="text"
                        name={`sku-${index}`}
                        defaultValue={item.sku}
                        onChange={handleEditChangeVariant}
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>

                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        name={`price-${index}`}
                        defaultValue={item.price}
                        onChange={handleEditChangeVariant}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Size</Form.Label>
                      <Form.Control
                        type="text"
                        name={`size-${index}`}
                        defaultValue={item.size}
                        onChange={handleEditChangeVariant}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        name={`type-${index}`}
                        defaultValue={item.type}
                        onChange={handleEditChangeVariant}
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Form>
            </div>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeEditModalVariant}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditSave}>
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditVariant;
