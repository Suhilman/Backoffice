import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import { useStyles } from "../ProductPage";

export const AddProductModifierPage = ({ location }) => {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory();
  const { allOutlets, allCategories } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [outletId, setOutletId] = React.useState("");
  const [typeId, setTypeId] = React.useState("");
  const [productCategory, setProductCategory] = React.useState("");
  const [productModifier, setProductModifier] = React.useState([
    {
      name: "",
      price: ""
    }
  ]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const addMoreModifier = () => {
    setProductModifier([
      ...productModifier,
      {
        name: "",
        price: ""
      }
    ]);
  };

  const removeOneModifier = id => {
    const filterModifier = [...productModifier];
    filterModifier.splice(id, 1);
    setProductModifier(filterModifier);
  };

  const handleSelectOutlet = e => setOutletId(e.target.value);
  const handleSelectCategory = e => setProductCategory(e.target.value);
  const handleSelectType = e => setTypeId(e.target.value);

  const handleChangeModifier = async (e, index) => {
    const { name, value } = e.target;
    const list = [...productModifier];
    list[index][name] = value;
    setProductModifier(list);
  };

  const handleSave = async () => {
    const productModifierData = {
      product_category_id: productCategory,
      outlet_id: outletId,
      type_id: typeId,
      modifier: productModifier
    };

    try {
      enableLoading();
      await axios.post(
        `${API_URL}/api/v1/product-modifier`,
        productModifierData
      );
      disableLoading();
      history.push("/product");
    } catch (err) {
      disableLoading();
      setAlert(err.response.data.message);
    }
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem" }}>
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
                onClick={handleSave}
              >
                {loading ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>

          <Row>
            <Col>
              {alert ? <Alert variant="danger">{alert}</Alert> : ""}

              <Form.Group>
                <Form.Label>Outlet</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={"Default"}
                  onChange={handleSelectOutlet}
                >
                  <option value={"Default"} disabled hidden>
                    Choose Outlet
                  </option>
                  {allOutlets
                    ? allOutlets.map(item => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })
                    : ""}
                </Form.Control>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      defaultValue={"Default"}
                      onChange={handleSelectCategory}
                    >
                      <option value={"Default"} disabled hidden>
                        Choose Category
                      </option>
                      {allCategories
                        ? allCategories.map(item => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })
                        : ""}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      as="select"
                      defaultValue={"Default"}
                      // onChange={handleSelectCategory}
                    >
                      <option value={"Default"} disabled hidden>
                        Choose Type
                      </option>
                      {/*{allCategories
                    ? allCategories.map(item => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })
                    : ""}*/}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {productModifier.map((item, index) => {
                return (
                  <Row key={index}>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Modifier Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={item.name}
                          onChange={e => handleChangeModifier(e, index)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Modifier Price</Form.Label>
                        <Form.Control
                          type="text"
                          name="price"
                          value={item.price}
                          onChange={e => handleChangeModifier(e, index)}
                        />
                      </Form.Group>
                    </Col>

                    {productModifier.length > 1 ? (
                      <Col md={2}>
                        <Button onClick={() => removeOneModifier(index)}>
                          -
                        </Button>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                );
              })}

              <Button onClick={addMoreModifier}>+ Add Other Modifier</Button>
            </Col>
          </Row>
        </Paper>
      </Col>
    </Row>
  );
};
