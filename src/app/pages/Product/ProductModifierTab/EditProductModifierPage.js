import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";

import { Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";

import { useStyles } from "../ProductPage";

export const EditProductModifierPage = ({ location, match }) => {
  const classes = useStyles();
  const history = useHistory();
  const { allOutlets } = location.state;
  const { groupId } = match.params;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [productModifier, setProductModifier] = React.useState({
    outlet_id: "",
    id: "",
    name: "",
    modifiers: [
      {
        id: "",
        name: "",
        price: ""
      }
    ]
  });

  const ProductModifierSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required("Please choose an outlet"),
    name: Yup.string()
      .min(3, "Minimum 3 characters")
      .max(50, "Maximum 50 characters")
      .required("Please input a group name"),
    modifiers: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
          .min(3, "Minimum 3 characters")
          .max(50, "Maximum 50 characters")
          .required("Please input a modifier name"),
        price: Yup.number()
          .min(1)
          .required("Please input a modifier price")
      })
    )
  });

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getProductModifier = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { data } = await axios.get(`${API_URL}/api/v1/group-modifier/${id}`);

    setProductModifier({
      outlet_id: data.data.outlet_id,
      id: data.data.id,
      name: data.data.name,
      modifiers: data.data.Modifiers
    });
  };

  React.useEffect(() => {
    getProductModifier(groupId);
  }, [groupId]);

  return (
    <Paper elevation={2} style={{ padding: "1rem" }}>
      <Formik
        enableReinitialize={true}
        initialValues={productModifier}
        validationSchema={ProductModifierSchema}
        onSubmit={async (values) => {
          const API_URL = process.env.REACT_APP_API_URL;
          const productModifierData = {
            outlet_id: values.outlet_id,
            groupModifier: {
              id: values.id,
              name: values.name,
              modifiers: values.modifiers
            }
          };

          try {
            enableLoading();
            await axios.put(
              `${API_URL}/api/v1/modifier/bulk-update`,
              productModifierData
            );
            disableLoading();
            history.push("/product");
          } catch (err) {
            disableLoading();
            setAlert(err.response.data.message);
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <FieldArray
              name="modifiers"
              render={(arrayHelpers) => (
                <>
                  <div className={classes.header}>
                    <div className={classes.headerStart}>
                      <h3>Add Product Modifier</h3>
                    </div>
                    <div className={classes.headerEnd}>
                      <Link to="/product">
                        <Button variant="outline-secondary">Cancel</Button>
                      </Link>
                      <Button
                        variant="primary"
                        style={{ marginLeft: "0.5rem" }}
                        type="submit"
                      >
                        {loading ? (
                          <Spinner
                            animation="border"
                            variant="light"
                            size="sm"
                          />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>
                  {alert ? <Alert variant="danger">{alert}</Alert> : ""}

                  <Row style={{ padding: "1rem" }}>
                    <Col>
                      <Form.Group>
                        <Form.Label>Outlet*</Form.Label>
                        <Form.Control
                          as="select"
                          name="outlet_id"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.outlet_id}
                          // className={validationProductModifier(
                          //   props,
                          //   "outlet_id"
                          // )}
                          required
                        >
                          <option value={""} disabled hidden>
                            Choose Outlet
                          </option>
                          {allOutlets.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </Form.Control>
                        {/* {props.touched.outlet_id && props.errors.outlet_id ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {props.errors.outlet_id}
                          </div>
                        </div>
                      ) : null} */}
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Modifier Group Name*</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Ex. : Topping"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.name}
                          // className={validationProductModifier(props, "name")}
                          required
                        />
                        {/* {props.touched.name && props.errors.name ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {props.errors.name}
                          </div>
                        </div>
                      ) : null} */}
                      </Form.Group>
                    </Col>
                  </Row>

                  {props.values.modifiers.map((item, index) => {
                    return (
                      <Row
                        style={{
                          padding: "1rem",
                          borderTop: "1px solid #ebedf2"
                        }}
                        key={index}
                      >
                        <Col>
                          <Form.Group>
                            <Form.Label>Modifier Name*</Form.Label>
                            <Form.Control
                              type="text"
                              name={`modifiers.${index}.name`}
                              placeholder="Ex. : Boba"
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.modifiers[index].name}
                              required
                            />
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Modifier Price*</Form.Label>
                            <Form.Control
                              type="number"
                              name={`modifiers.${index}.price`}
                              placeholder="Ex. : 2000"
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.modifiers[index].price}
                              required
                            />
                          </Form.Group>
                        </Col>

                        {props.values.modifiers.length > 1 ? (
                          <Col md={1} style={{ alignSelf: "center" }}>
                            <Button
                              onClick={() => arrayHelpers.remove(index)}
                              variant="danger"
                            >
                              <Delete />
                            </Button>
                          </Col>
                        ) : (
                          ""
                        )}
                      </Row>
                    );
                  })}

                  <div style={{ padding: "1rem" }}>
                    <Button
                      onClick={() =>
                        arrayHelpers.push({ id: "", name: "", price: "" })
                      }
                    >
                      + Add More Modifier
                    </Button>
                  </div>
                </>
              )}
            />
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
