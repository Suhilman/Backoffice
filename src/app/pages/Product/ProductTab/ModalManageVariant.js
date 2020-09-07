import React from "react";

import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Delete } from "@material-ui/icons";

const ModalManageVariant = ({
  title,
  validatedModal,
  showManageVariant,
  cancelModalVariant,
  saveChangesVariant,
  productVariant,
  handleAddVariant,
  handleRemoveVariant,
  handleChangeVariant
}) => {
  return (
    <Modal show={showManageVariant} onHide={cancelModalVariant} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validatedModal} onSubmit={saveChangesVariant}>
        <Modal.Body>
          {productVariant.map((item, index) => {
            return (
              <div key={index}>
                <Row
                  style={{
                    padding: "1rem"
                  }}
                >
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Variant Name</Form.Label>
                      <Form.Control
                        type="text"
                        name={`name-${index}`}
                        value={item.name}
                        placeholder="Ex. : Mie Ayam Bakso"
                        onChange={handleChangeVariant}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please input a name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Barcode</Form.Label>
                          <Form.Control
                            type="text"
                            name={`barcode-${index}`}
                            value={item.barcode}
                            onChange={handleChangeVariant}
                          />
                        </Form.Group>
                      </Col>

                      <Col>
                        <Form.Group>
                          <Form.Label>SKU</Form.Label>
                          <Form.Control
                            type="text"
                            name={`sku-${index}`}
                            placeholder="Ex. : MA-1"
                            value={item.sku}
                            onChange={handleChangeVariant}
                          />
                        </Form.Group>
                      </Col>

                      <Col>
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            name={`price-${index}`}
                            value={item.price}
                            onChange={handleChangeVariant}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please input a price.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {productVariant.length > 1 ? (
                        <Col
                          md={1}
                          style={
                            validatedModal
                              ? { marginTop: "1.9rem" }
                              : { alignSelf: "center" }
                          }
                        >
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <Delete />
                          </Button>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Form.Row>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Button onClick={handleAddVariant}>+ Add Variant</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModalVariant}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalManageVariant;
