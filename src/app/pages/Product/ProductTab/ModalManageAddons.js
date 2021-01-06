import React from "react";
import Select from "react-select";

import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Delete } from "@material-ui/icons";
import { FormikProvider, FieldArray } from "formik";

const ModalManageVariant = ({
  title,
  showManageAddons,
  cancelModalAddons,
  saveChangesAddons,
  formikProduct,
  optionsMaterial,
  optionsUnit,
  defaultValueUnit,
  defaultValueMaterial
}) => {
  return (
    <Modal show={showManageAddons} onHide={cancelModalAddons} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={saveChangesAddons}>
        <Modal.Body>
          <FormikProvider value={formikProduct}>
            <FieldArray
              name="groupAddons"
              render={(arrayHelpers) => {
                return (
                  <div>
                    {formikProduct.values.groupAddons.map((item, index) => {
                      return (
                        <Row
                          style={{
                            padding: "0 1rem",
                            marginBottom: "1rem",
                            borderBottom: "1px solid #ebedf2"
                          }}
                          key={index}
                        >
                          <Col>
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Group Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name={`groupAddons[${index}].group_name`}
                                    {...formikProduct.getFieldProps(
                                      `groupAddons[${index}].group_name`
                                    )}
                                    placeholder="Ex. : Ukuran"
                                    required
                                  />
                                  {formikProduct.touched.groupAddons &&
                                  formikProduct.errors.groupAddons ? (
                                    <div className="fv-plugins-message-container">
                                      <div className="fv-help-block">
                                        {
                                          formikProduct.errors.groupAddons[
                                            index
                                          ]?.group_name
                                        }
                                      </div>
                                    </div>
                                  ) : null}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label>Group Type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name={`groupAddons[${index}].group_type`}
                                    {...formikProduct.getFieldProps(
                                      `groupAddons[${index}].group_type`
                                    )}
                                    required
                                  >
                                    <option value="" disabled hidden>
                                      Select a Type
                                    </option>
                                    <option value="single">Single</option>
                                    <option value="multi">Multi</option>
                                  </Form.Control>
                                  {formikProduct.touched.groupAddons &&
                                  formikProduct.errors.groupAddons ? (
                                    <div className="fv-plugins-message-container">
                                      <div className="fv-help-block">
                                        {
                                          formikProduct.errors.groupAddons[
                                            index
                                          ]?.group_type
                                        }
                                      </div>
                                    </div>
                                  ) : null}
                                </Form.Group>
                              </Col>

                              <Col>
                                <FieldArray
                                  name={`groupAddons[${index}].addons`}
                                  render={(addonsHelpers) => {
                                    return (
                                      <div>
                                        {item.addons.map((val, valIndex) => {
                                          return (
                                            <Form.Row key={valIndex}>
                                              <Col>
                                                <Form.Group>
                                                  {val.has_raw_material ? (
                                                    <>
                                                      <Form.Label>
                                                        Raw Material
                                                      </Form.Label>
                                                      <Select
                                                        options={
                                                          optionsMaterial
                                                        }
                                                        defaultValue={defaultValueMaterial(
                                                          formikProduct.values
                                                            .groupAddons[index]
                                                            .addons[valIndex]
                                                            .raw_material_id
                                                        )}
                                                        name={`groupAddons[${index}].addons[${valIndex}].raw_material_id`}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        onChange={(value) =>
                                                          formikProduct.setFieldValue(
                                                            `groupAddons[${index}].addons[${valIndex}].raw_material_id`,
                                                            value.value
                                                          )
                                                        }
                                                      />
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Form.Label>
                                                        Addons Name
                                                      </Form.Label>
                                                      <Form.Control
                                                        type="text"
                                                        name={`groupAddons[${index}].addons[${valIndex}].name`}
                                                        {...formikProduct.getFieldProps(
                                                          `groupAddons[${index}].addons[${valIndex}].name`
                                                        )}
                                                        placeholder="Ex. : S / M / L"
                                                        required
                                                      />
                                                    </>
                                                  )}
                                                  <Form.Check
                                                    type="checkbox"
                                                    label="Using Raw Material"
                                                    style={{
                                                      marginTop: "0.5rem"
                                                    }}
                                                    name={`groupAddons[${index}].addons[${valIndex}].has_raw_material`}
                                                    value={val.has_raw_material}
                                                    checked={
                                                      val.has_raw_material
                                                    }
                                                    onChange={(e) => {
                                                      const {
                                                        value
                                                      } = e.target;
                                                      if (value === "true") {
                                                        formikProduct.setFieldValue(
                                                          `groupAddons[${index}].addons[${valIndex}].has_raw_material`,
                                                          false
                                                        );
                                                      } else {
                                                        formikProduct.setFieldValue(
                                                          `groupAddons[${index}].addons[${valIndex}].has_raw_material`,
                                                          true
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </Form.Group>
                                              </Col>

                                              {val.has_raw_material ? (
                                                <>
                                                  <Col>
                                                    <Form.Label>
                                                      Quantity
                                                    </Form.Label>
                                                    <Form.Control
                                                      type="number"
                                                      name={`groupAddons[${index}].addons[${valIndex}].quantity`}
                                                      {...formikProduct.getFieldProps(
                                                        `groupAddons[${index}].addons[${valIndex}].quantity`
                                                      )}
                                                      required
                                                    />
                                                  </Col>

                                                  <Col>
                                                    <Form.Label>
                                                      Unit
                                                    </Form.Label>
                                                    <Select
                                                      options={optionsUnit}
                                                      defaultValue={defaultValueUnit(
                                                        formikProduct.values
                                                          .groupAddons[index]
                                                          .addons[valIndex]
                                                          .unit_id
                                                      )}
                                                      name={`groupAddons[${index}].addons[${valIndex}].unit_id`}
                                                      className="basic-single"
                                                      classNamePrefix="select"
                                                      onChange={(value) =>
                                                        formikProduct.setFieldValue(
                                                          `groupAddons[${index}].addons[${valIndex}].unit_id`,
                                                          value.value
                                                        )
                                                      }
                                                    />
                                                  </Col>
                                                </>
                                              ) : (
                                                ""
                                              )}

                                              <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                  type="number"
                                                  name={`groupAddons[${index}].addons[${valIndex}].price`}
                                                  {...formikProduct.getFieldProps(
                                                    `groupAddons[${index}].addons[${valIndex}].price`
                                                  )}
                                                  required
                                                />
                                              </Col>

                                              {formikProduct.values.groupAddons
                                                .length > 1 ||
                                              item.addons.length > 0 ? (
                                                <Col
                                                  md={1}
                                                  style={{
                                                    marginTop: "1.9rem"
                                                  }}
                                                >
                                                  <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                      addonsHelpers.remove(
                                                        valIndex
                                                      );
                                                      if (
                                                        item.addons.length === 1
                                                      ) {
                                                        arrayHelpers.remove(
                                                          index
                                                        );
                                                      }
                                                    }}
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
                                            <Button
                                              onClick={() =>
                                                addonsHelpers.push({
                                                  id: "",
                                                  name: "",
                                                  price: 0,
                                                  has_raw_material: false,
                                                  raw_material_id: "",
                                                  quantity: 0,
                                                  unit_id: "",
                                                  status: "active"
                                                })
                                              }
                                            >
                                              + Add Addons
                                            </Button>
                                          </Col>
                                        </Row>
                                      </div>
                                    );
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      );
                    })}

                    <Row
                      style={{
                        paddingLeft: "1rem"
                      }}
                    >
                      <Col>
                        <Button
                          onClick={() =>
                            arrayHelpers.push({
                              id: "",
                              group_name: "",
                              group_type: "",
                              addons: [
                                {
                                  id: "",
                                  name: "",
                                  price: 0,
                                  has_raw_material: false,
                                  raw_material_id: "",
                                  quantity: 0,
                                  unit_id: "",
                                  status: "active"
                                }
                              ]
                            })
                          }
                          style={{ marginRight: "1rem" }}
                        >
                          + Add Group
                        </Button>
                      </Col>
                    </Row>
                  </div>
                );
              }}
            />
          </FormikProvider>
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
