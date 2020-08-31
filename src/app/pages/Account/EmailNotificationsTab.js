import React from "react";
import axios from "axios";

import { Row, Col, Button, Form } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";

import { useStyles } from "./AccountPage";

export const EmailNotifications = () => {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const [switchState, setSwitchState] = React.useState({
    cashRecap: false,
    dailySales: false,
    weeklySales: false,
    lowStock: false
  });
  const [stateComponent, setStateComponent] = React.useState("show");

  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  const getEmailNotifications = async () => {
    try {
      const emailNotifications = await axios.get(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`
      );

      setSwitchState({
        cashRecap: emailNotifications.data.data.rekap_kas || false,
        dailySales:
          emailNotifications.data.data.penjualan_produk_harian || false,
        weeklySales:
          emailNotifications.data.data.penjualan_produk_mingguan || false,
        lowStock: emailNotifications.data.data.stok_habis_harian || false
      });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getEmailNotifications();
  }, []);

  const allFields = [
    {
      field: "Cash Recap",
      description:
        "Get a notification email when a cash recap activity happened",
      value: switchState.cashRecap,
      name: "cashRecap"
    },
    {
      field: "Daily Sales Report",
      description: "Get a sales report notification email once a day",
      value: switchState.dailySales,
      name: "dailySales"
    },
    {
      field: "Weekly Sales Report",
      description: "Get a sales report notification email once a week",
      value: switchState.weeklySales,
      name: "weeklySales"
    },
    {
      field: "Low Stock Alert",
      description:
        "Get a daily notification when a product stock is nearly empty / empty",
      value: switchState.lowStock,
      name: "lowStock"
    }
  ];

  const sendData = async () => {
    const emailData = {
      rekap_kas: switchState.cashRecap,
      stok_habis_harian: switchState.lowStock,
      penjualan_produk_harian: switchState.dailySales,
      penjualan_produk_mingguan: switchState.weeklySales
    };

    try {
      await axios.put(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`,
        emailData
      );

      setStateComponent("show");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSwitch = e => {
    setSwitchState({
      ...switchState,
      [e.target.name]: e.target.checked
    });
  };

  const handleStateComponent = () => {
    if (stateComponent === "show") {
      setStateComponent("edit");
    }
  };

  return (
    <Row>
      <Col md={12}>
        <div className={classes.header}>
          <div className={classes.headerStart}>
            <h3>Email Notifications</h3>
          </div>

          <div className={classes.headerEnd}>
            {stateComponent === "show" ? (
              <Button variant="outline-primary" onClick={handleStateComponent}>
                Edit
              </Button>
            ) : (
              <Button variant="outline-primary" onClick={sendData}>
                Save
              </Button>
            )}
          </div>
        </div>

        {allFields.map((item, index) => {
          return (
            <Row key={index} className={classes.padding}>
              <Col md={8}>
                {item.field} <br /> {item.description}
              </Col>
              <Col md={4}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value={item.value}
                      control={
                        <Switch
                          color="primary"
                          checked={item.value}
                          onChange={handleSwitch}
                          name={item.name}
                          disabled={stateComponent === "show" ? true : false}
                        />
                      }
                      label={item.value ? "Active" : "Inactive"}
                      labelPlacement="start"
                    />
                  </FormGroup>
                </FormControl>
              </Col>
            </Row>
          );
        })}
      </Col>
    </Row>
  );
};
