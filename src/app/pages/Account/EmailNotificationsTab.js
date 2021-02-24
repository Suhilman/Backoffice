import React from "react";
import axios from "axios";
import { KeyboardTimePicker } from "@material-ui/pickers";

import { Row, Col, Button, Spinner } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";

import "../style.css";

export const EmailNotifications = () => {
  const [switchState, setSwitchState] = React.useState({
    cashRecap: false,
    dailySales: false,
    weeklySales: false,
    lowStock: false
  });
  const [initialSwitchState, setInitialSwitchState] = React.useState({
    cashRecap: false,
    dailySales: false,
    weeklySales: false,
    lowStock: false
  });
  const [stateComponent, setStateComponent] = React.useState("show");
  const [loading, setLoading] = React.useState(false);

  const getEmailNotifications = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

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

      setInitialSwitchState({
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
      name: "dailySales",
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="daily-sales"
          label="Select Time"
          disabled={stateComponent === "show" ? true : false}
          // value={selectedDate}
          // onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: "You can choose time for sending email Daily Sales Report"
    },
    {
      field: "Weekly Sales Report",
      description: "Get a sales report notification email once a week",
      value: switchState.weeklySales,
      name: "weeklySales",
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="weekly-sales"
          label="Select Date"
          disabled={stateComponent === "show" ? true : false}
          // value={selectedDate}
          // onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: "You can choose date for sending email Weekly Sales Report"
    },
    {
      field: "Low Stock Alert",
      description:
        "Get a daily notification when a product stock is nearly empty / empty",
      value: switchState.lowStock,
      name: "lowStock",
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="low-stock"
          label="Select Time"
          disabled={stateComponent === "show" ? true : false}
          // value={selectedDate}
          // onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: "You can select time for sending email Low Stock Alert"
    }
  ];

  const sendData = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const emailData = {
      rekap_kas: switchState.cashRecap,
      stok_habis_harian: switchState.lowStock,
      penjualan_produk_harian: switchState.dailySales,
      penjualan_produk_mingguan: switchState.weeklySales
    };

    try {
      enableLoading();
      await axios.put(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`,
        emailData
      );
      disableLoading();

      setInitialSwitchState({
        cashRecap: switchState.cashRecap,
        dailySales: switchState.dailySales,
        weeklySales: switchState.weeklySales,
        lowStock: switchState.lowStock
      });

      setStateComponent("show");
    } catch (err) {
      console.log(err);
      disableLoading();
    }
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSwitch = (e) => {
    setSwitchState({
      ...switchState,
      [e.target.name]: e.target.checked
    });
  };

  const handleStateComponent = () => {
    if (stateComponent === "show") {
      setStateComponent("edit");
    } else {
      setSwitchState(initialSwitchState);
      setStateComponent("show");
    }
  };

  return (
    <Row>
      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>Email Notifications</h3>
            </div>

            <div className="headerEnd">
              {stateComponent === "show" ? (
                <Button variant="primary" onClick={handleStateComponent}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleStateComponent}
                    style={{ marginRight: "1rem" }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={sendData}>
                    {loading ? (
                      <Spinner animation="border" variant="light" size="sm" />
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {allFields.map((item, index) => {
            return (
              <>
                <Row key={index} style={{ padding: "1rem" }}>
                  <Col md={6}>
                    {item.field} <br /> {item.description}
                  </Col>
                  <Col md={3}>
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
                              disabled={
                                stateComponent === "show" ? true : false
                              }
                            />
                          }
                          label={item.value ? "Active" : "Inactive"}
                          labelPlacement="start"
                        />
                      </FormGroup>
                    </FormControl>
                  </Col>
                  <Col md={3} style={{ marginTop: "-30px" }}>
                    {item.component ? item.component : ""}
                    {item.text ? item.text : ""}
                  </Col>
                </Row>
                {index === allFields.length - 1 ? "" : <hr />}
              </>
            );
          })}
        </Paper>
      </Col>
    </Row>
  );
};
