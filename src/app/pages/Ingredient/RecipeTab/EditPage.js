import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import Select from "react-select";

import { Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

import CustomModal from "./CustomModal";

export const EditRecipePage = ({ location, match }) => {
  const history = useHistory();
  const {
    allOutlets,
    allMaterials,
    allUnits,
    allCategories,
    currRecipe
  } = location.state;
  const { recipeId } = match.params;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [currTotalPrice, setCurrTotalPrice] = React.useState(0);
  const [currTotalCalorie, setCurrTotalCalorie] = React.useState(0);

  const [stateCustom, setStateCustom] = React.useState(false);

  const initialValueRecipe = {
    outlet_id: currRecipe.outlet_id,
    product_id: currRecipe.product_id,
    total_calorie: currRecipe.total_calorie,
    total_cogs: currRecipe.total_cogs,
    notes: currRecipe.notes,
    materials: currRecipe.materials
  };

  const materialValue = {
    id: "",
    raw_material_category_id: "",
    raw_material_id: "",
    quantity: 0,
    unit_id: "",
    calorie_per_unit: 0,
    ingredient_price: 0,
    is_custom_material: false
  };

  const RecipeSchema = Yup.object().shape({
    outlet_id: Yup.number().required("Please choose an outlet."),
    total_calorie: Yup.number(),
    total_cogs: Yup.number(),
    notes: Yup.string().nullable(),
    product_id: Yup.number().required("Please choose a product."),
    materials: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().nullable(),
        raw_material_category_id: Yup.number()
          .typeError("Please input a category")
          .required("Please input a category"),
        raw_material_id: Yup.number()
          .typeError("Please input a raw material")
          .required("Please input a raw material"),
        quantity: Yup.number()
          .min(0, "Minimum 0")
          .typeError("Please input a quantity")
          .required("Please input a quantity"),
        unit_id: Yup.number()
          .typeError("Please input a unit")
          .required("Please input a unit"),
        calorie_per_unit: Yup.number()
          .min(0, "Minimum 0")
          .typeError("Please input a calorie")
          .required("Please input a calorie"),
        ingredient_price: Yup.number()
          .min(0, "Minimum 0")
          .typeError("Please input a price")
          .required("Please input a price"),
        is_custom_material: Yup.boolean()
      })
    )
  });

  const formikRecipe = useFormik({
    initialValues: initialValueRecipe,
    validationSchema: RecipeSchema,
    onSubmit: async (values) => {
      const recipeData = {
        outlet_id: values.outlet_id,
        product_id: values.product_id,
        total_calorie: values.total_calorie,
        total_cogs: values.total_cogs,
        notes: values.notes || "",
        materials: values.materials
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/recipe/${recipeId}`, recipeData);
        disableLoading();
        history.push("/ingredient-inventory");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationRecipe = (fieldname) => {
    if (formikRecipe.touched[fieldname] && formikRecipe.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikRecipe.touched[fieldname] && !formikRecipe.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const initialValueCustom = {
    name: "",
    price: 0
  };

  const CustomSchema = Yup.object().shape({
    name: Yup.string().required("Please input name"),
    price: Yup.number().required("Please input price")
  });

  const formikCustom = useFormik({
    initialValues: initialValueCustom,
    validationSchema: CustomSchema,
    onSubmit: (values) => {
      const customData = {
        id: "",
        raw_material_category_id: 0,
        raw_material_id: 0,
        quantity: 0,
        unit_id: 0,
        calorie_per_unit: 0,
        ingredient_price: 0,
        is_custom_material: true,
        custom_material_name: values.name,
        custom_material_price: values.price
      };

      formikRecipe.values.materials.push(customData);
      closeCustomModal();
    }
  });

  const validationCustom = (fieldname) => {
    if (formikCustom.touched[fieldname] && formikCustom.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikCustom.touched[fieldname] && !formikCustom.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const showCustomModal = () => setStateCustom(true);
  const closeCustomModal = () => {
    formikCustom.resetForm();
    setStateCustom(false);
  };

  //
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueOutlet = optionsOutlet.find(
    (val) => val.value === formikRecipe.values.outlet_id
  );

  const optionsCategory = allCategories.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueCategory = (index) =>
    optionsCategory.find(
      (val) =>
        val.value ===
        formikRecipe.values.materials[index].raw_material_category_id
    );

  const optionsRaw = (index) =>
    allCategories
      .filter(
        (item) =>
          item.id ===
          formikRecipe.values.materials[index].raw_material_category_id
      )
      .map((item) => {
        return item.Raw_Materials.filter(
          (val) => val.outlet_id === formikRecipe.values.outlet_id
        ).map((val) => {
          return {
            value: val.id,
            label: val.name,
            calorie: val.calorie_per_unit,
            calorie_unit: val.calorie_unit
          };
        });
      })
      .flat(1);

  const defaultValueRaw = (index) =>
    optionsRaw(index).find(
      (val) =>
        val.value === formikRecipe.values.materials[index].raw_material_id
    );

  const optionsUnit = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnit = (index) =>
    optionsUnit.find(
      (val) => val.value === formikRecipe.values.materials[index].unit_id
    );

  return (
    <>
      <CustomModal
        stateModal={stateCustom}
        cancelModal={closeCustomModal}
        title="Add Custom Material"
        loading={loading}
        alert={alert}
        formikCustom={formikCustom}
        validationCustom={validationCustom}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <Form noValidate onSubmit={formikRecipe.handleSubmit}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>Edit Recipe</h3>
                </div>
                <div className="headerEnd">
                  <Link to="/ingredient-inventory">
                    <Button variant="secondary">Cancel</Button>
                  </Link>
                  <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                    type="submit"
                  >
                    {loading ? (
                      <Spinner animation="border" variant="light" size="sm" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>

              {alert ? <Alert variant="danger">{alert}</Alert> : ""}

              <Row style={{ padding: "1rem" }} className="lineBottom">
                <Col>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Location:</Form.Label>
                        <Select
                          options={optionsOutlet}
                          defaultValue={defaultValueOutlet}
                          name="outlet_id"
                          className="basic-single"
                          classNamePrefix="select"
                          // onChange={(value) => {
                          //   formikRecipe.setFieldValue(
                          //     "outlet_id",
                          //     value.value
                          //   );
                          //   formikRecipe.setFieldValue("materials", []);
                          // }}
                          isDisabled={true}
                        />
                        {formikRecipe.touched.outlet_id &&
                        formikRecipe.errors.outlet_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikRecipe.errors.outlet_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control
                          type="text"
                          value={currRecipe.currProduct.name}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Product Price:</Form.Label>
                        <Form.Control
                          type="text"
                          value={currRecipe.currProduct.price}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="notes"
                          {...formikRecipe.getFieldProps("notes")}
                          className={validationRecipe("notes")}
                        />
                        {formikRecipe.touched.notes &&
                        formikRecipe.errors.notes ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikRecipe.errors.notes}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ padding: "1rem" }} className="lineBottom">
                <Col>
                  <Row>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>Category</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>Raw Material</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>Quantity</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>Unit</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>Material Calorie</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>Ingredient Price</h6>
                    </Col>
                    <Col sm={1}></Col>
                  </Row>

                  <FormikProvider value={formikRecipe}>
                    <FieldArray
                      name="materials"
                      render={(arrayHelpers) => {
                        return (
                          <div>
                            {formikRecipe.values.materials.map(
                              (item, index) => {
                                if (!item.is_custom_material) {
                                  return (
                                    <Row key={index}>
                                      <Col>
                                        <Form.Group>
                                          <Select
                                            options={optionsCategory}
                                            defaultValue={defaultValueCategory(
                                              index
                                            )}
                                            name={`materials[${index}].raw_material_category_id`}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            onChange={(value) => {
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].raw_material_category_id`,
                                                value.value
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].raw_material_id`,
                                                null
                                              );
                                            }}
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.raw_material_category_id
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>

                                      <Col>
                                        <Form.Group>
                                          <Select
                                            options={optionsRaw(index)}
                                            defaultValue={defaultValueRaw(
                                              index
                                            )}
                                            name={`materials[${index}].raw_material_id`}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            onChange={(value) => {
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].raw_material_id`,
                                                value.value
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].quantity`,
                                                1
                                              );

                                              const rawMaterial = optionsRaw(
                                                index
                                              ).find(
                                                (val) =>
                                                  val.value === value.value
                                              );

                                              let calorie = 0;
                                              if (rawMaterial.calorie) {
                                                calorie = rawMaterial.calorie;
                                                if (
                                                  rawMaterial.calorie_unit ===
                                                  "kcal"
                                                ) {
                                                  calorie *= 1000;
                                                }
                                              }

                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie`,
                                                calorie
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie_per_unit`,
                                                calorie
                                              );
                                            }}
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.raw_material_id
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].quantity`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].quantity`
                                            )}
                                            onChange={(e) => {
                                              const { value } = e.target;
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].quantity`,
                                                value
                                              );

                                              const calorie =
                                                (formikRecipe.values.materials[
                                                  index
                                                ].calorie || 0) * value;

                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie_per_unit`,
                                                calorie
                                              );
                                            }}
                                            required
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.quantity
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Select
                                            options={optionsUnit}
                                            defaultValue={defaultValueUnit(
                                              index
                                            )}
                                            name={`materials[${index}].unit_id`}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            onChange={(value) =>
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].unit_id`,
                                                value.value
                                              )
                                            }
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.unit_id
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].calorie_per_unit`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].calorie_per_unit`
                                            )}
                                            onChange={(e) => {
                                              const { value } = e.target;
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie_per_unit`,
                                                value
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie`,
                                                value
                                              );
                                            }}
                                            required
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.calorie_per_unit
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].ingredient_price`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].ingredient_price`
                                            )}
                                            required
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.ingredient_price
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>

                                      <Col sm={1}>
                                        <Button
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          variant="danger"
                                        >
                                          <Delete />
                                        </Button>
                                      </Col>
                                    </Row>
                                  );
                                } else {
                                  return (
                                    <Row key={index}>
                                      <Col></Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            name={`materials[${index}].custom_material_name`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].custom_material_name`
                                            )}
                                            disabled
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.custom_material_name
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col></Col>
                                      <Col></Col>
                                      <Col></Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].custom_material_price`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].custom_material_price`
                                            )}
                                            disabled
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.custom_material_price
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>

                                      <Col sm={1}>
                                        <Button
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          variant="danger"
                                        >
                                          <Delete />
                                        </Button>
                                      </Col>
                                    </Row>
                                  );
                                }
                              }
                            )}

                            <Row style={{ padding: "1rem" }}>
                              <Button
                                onClick={() => arrayHelpers.push(materialValue)}
                                variant="primary"
                              >
                                + Add Raw Material
                              </Button>

                              <Button
                                onClick={showCustomModal}
                                variant="secondary"
                                style={{ marginLeft: "0.5rem" }}
                              >
                                + Add Custom Material
                              </Button>
                            </Row>
                          </div>
                        );
                      }}
                    />
                  </FormikProvider>
                </Col>
              </Row>

              <Row style={{ padding: "1rem" }}>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col style={{ textAlign: "right", alignSelf: "center" }}>
                  <h6>Total</h6>
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="total_calorie"
                    {...formikRecipe.getFieldProps("total_calorie")}
                    value={formikRecipe.values.materials.reduce(
                      (init, curr) => (init += curr.calorie_per_unit),
                      formikRecipe.values.total_calorie
                    )}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="total_cogs"
                    {...formikRecipe.getFieldProps("total_cogs")}
                  />
                </Col>
                <Col sm={1}></Col>
              </Row>
            </Form>
          </Paper>
        </Col>
      </Row>
    </>
  );
};
