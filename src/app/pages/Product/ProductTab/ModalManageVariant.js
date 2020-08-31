import React from "react";

import {
  Button,
  InputGroup,
  Badge,
  Modal,
  Spinner,
  Form,
  Row,
  Col
} from "react-bootstrap";

const ModalManageVariant = ({
  showManageVariant,
  closeModalVariant,
  loading,
  productVariant,
  optionVariant,
  handleAddGroupVariant,
  handleRemoveGroupVariant,
  handleSave,
  handleChangeVariant,
  handleOptionVariant,
  handleKeyPress,
  handleOnBlur,
  handleOptionVariantBlur,
  groupState,
  setGroupState,
}) => {
  return (
    <Modal show={showManageVariant} onHide={closeModalVariant} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Product Variant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Label>Group Variant Name</Form.Label>
            </Col>
            <Col md={7}>
              <Form.Label>Option Variant Name</Form.Label>
            </Col>
          </Row>

          {optionVariant.map((item, index) => {
            return (
              <Row key={index}>
                <Col md={4}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`group_name-${index}`}
                      value={item.group_name}
                      onChange={handleOptionVariant}
                      onBlur={handleOptionVariantBlur}
                      disabled={groupState[index] === true ? true : false}
                    />
                  </Form.Group>
                </Col>
                <Col md={7}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      {item.name.length ? (
                        <InputGroup.Text
                          style={{
                            backgroundColor: "transparent",
                            padding: "0 0.5rem",
                            border: "0"
                          }}
                        >
                          {item.name.map((val, ind) => {
                            return (
                              <Badge
                                pill
                                variant="primary"
                                style={{ margin: "0 0.1rem" }}
                              >
                                {val}
                              </Badge>
                            );
                          })}
                        </InputGroup.Text>
                      ) : (
                        ""
                      )}
                    </InputGroup.Prepend>

                    <Form.Control
                      type="text"
                      name={`name-${index}`}
                      value={item.variant_name}
                      onChange={handleOptionVariant}
                      onKeyPress={handleKeyPress}
                      onBlur={handleOnBlur}
                    />
                  </InputGroup>
                </Col>
                <Col md={1}>
                  {optionVariant.length > 1 ? (
                    <Button
                      variant="danger"
                      onClick={() => {
                        groupState.splice(index, 1);
                        setGroupState(groupState);
                        handleRemoveGroupVariant(index);
                      }}
                    >
                      x
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            );
          })}
          <Row
            style={{
              borderBottom: "1px solid #ebedf2",
              marginBottom: "1rem",
              paddingBottom: "2rem"
            }}
          >
            <Col>
              <Button onClick={handleAddGroupVariant}>
                + Add Group Variant
              </Button>
            </Col>
          </Row>

          {/*{productVariant.map((item, index) => {
            item.optionVariants.map((val, ind) => {
              return (
                <div key={index}>
                  <Row
                    style={{
                      padding: "1rem"
                    }}
                  >
                    <Col>
                      <Badge
                        key={ind}
                        pill
                        variant="primary"
                        style={{ margin: "0 0.1rem" }}
                      >
                        {val.name}
                      </Badge>
                    </Col>
                    <Col>
                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Barcode</Form.Label>
                            <Form.Control
                              type="text"
                              name={`barcode-${index}`}
                              defaultValue={item.barcode}
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
                              defaultValue={item.sku}
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
                              defaultValue={item.price}
                              onChange={handleChangeVariant}
                            />
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Row>
                </div>
              );
            });
          })}*/}
          <div>
            <Row
              style={{
                padding: "1rem"
              }}
            >
              <Col>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  S
                </Badge>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  Biasa
                </Badge>
              </Col>
              <Col>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" />
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
            </Row>

            <Row
              style={{
                padding: "1rem"
              }}
            >
              <Col>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  M
                </Badge>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  Biasa
                </Badge>
              </Col>
              <Col>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" />
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
            </Row>

            <Row
              style={{
                padding: "1rem"
              }}
            >
              <Col>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  L
                </Badge>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  Biasa
                </Badge>
              </Col>
              <Col>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" />
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
            </Row>

            <Row
              style={{
                padding: "1rem"
              }}
            >
              <Col>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  S
                </Badge>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  Pedas
                </Badge>
              </Col>
              <Col>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" />
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
            </Row>

            <Row
              style={{
                padding: "1rem"
              }}
            >
              <Col>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  M
                </Badge>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  Pedas
                </Badge>
              </Col>
              <Col>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" />
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
            </Row>

            <Row
              style={{
                padding: "1rem"
              }}
            >
              <Col>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  L
                </Badge>
                <Badge pill variant="primary" style={{ margin: "0 0.1rem" }}>
                  Pedas
                </Badge>
              </Col>
              <Col>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" />
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModalVariant}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
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

export default ModalManageVariant;
