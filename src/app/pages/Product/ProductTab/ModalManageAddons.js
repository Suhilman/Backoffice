import React from "react";

import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Delete } from "@material-ui/icons";

const ModalManageVariant = ({
  title,
  validatedModal,
  showManageAddons,
  cancelModalAddons,
  saveChangesAddons,
  productAddons,
  handleAddGroupAddons,
  handleAddAddons,
  handleRemoveAddons,
  handleChangeAddons
}) => {
  return (
    <Modal show={showManageAddons} onHide={cancelModalAddons} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validatedModal} onSubmit={saveChangesAddons}>
        <Modal.Body>
          {productAddons.map((item, index) => {
            return (
              <div key={index}>
                <Row
                  style={{
                    padding: "0 1rem",
                    marginBottom: "1rem",
                    borderBottom: "1px solid #ebedf2"
                  }}
                >
                  <Col>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Group Name</Form.Label>
                          <Form.Control
                            type="text"
                            name={`group_name-${index}`}
                            value={item.group_name}
                            placeholder="Ex. : Ukuran"
                            onChange={handleChangeAddons}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please input a group name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Group Type</Form.Label>
                          <Form.Control
                            as="select"
                            name={`group_type-${index}`}
                            value={item.group_type}
                            onChange={handleChangeAddons}
                          >
                            <option value="" disabled hidden>
                              Select a Type
                            </option>
                            <option value="single">Single</option>
                            <option value="multi">Multi</option>
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            Please select a type.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col>
                        {item.addons.map((val, valIndex) => {
                          return (
                            <Form.Row key={valIndex}>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Addons Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name={`addons-${index}-name-${valIndex}`}
                                    value={val.name}
                                    placeholder="Ex. : S / M / L"
                                    onChange={handleChangeAddons}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please input a name.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>

                              <Col>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                  type="number"
                                  name={`addons-${index}-price-${valIndex}`}
                                  value={val.price}
                                  onChange={handleChangeAddons}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please input a price.
                                </Form.Control.Feedback>
                              </Col>

                              {productAddons.length > 1 ||
                              item.addons.length > 1 ? (
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
                                    onClick={() =>
                                      handleRemoveAddons(index, valIndex)
                                    }
                                  >
                                    <Delete />
                                  </Button>
                                </Col>
                              ) : (
                                ""
                              )}
                            </Form.Row>
                          );
                        })}

                        <Row style={{ paddingBottom: "1rem" }}>
                          <Col>
                            <Button onClick={() => handleAddAddons(index)}>
                              + Add Addons
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Row
            style={{
              paddingLeft: "1rem"
            }}
          >
            <Col>
              <Button
                onClick={handleAddGroupAddons}
                style={{ marginRight: "1rem" }}
              >
                + Add Group
              </Button>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModalAddons}>
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
