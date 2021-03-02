import React from "react";
import axios from "axios";
import { KeyboardTimePicker } from "@material-ui/pickers";
import dayjs from "dayjs";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper,
  InputLabel,
  Select,
  TextField
} from "@material-ui/core";

import "../style.css";

export const EmailNotifications = () => {
  const [switchState, setSwitchState] = React.useState({
    cashRecap: false,
    dailySales: false,
    weeklySales: false,
    lowStock: false
  });
  const [timingState, setTimingState] = React.useState({
    daily_sales: new Date(),
    weekly_sales: new Date(),
    stock_alert: new Date()
  });
  const [minimum, setMinimum] = React.useState(5);
  const [day, setDay] = React.useState(0);
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
      const settingsNotification = await axios.get(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`
      );
      console.log(settingsNotification);
      setSwitchState({
        cashRecap:
          settingsNotification.data.data.emailNotification.rekap_kas || false,
        dailySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_harian || false,
        weeklySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_mingguan || false,
        lowStock:
          settingsNotification.data.data.emailNotification.stok_habis_harian ||
          false
      });

      setInitialSwitchState({
        cashRecap:
          settingsNotification.data.data.emailNotification.rekap_kas || false,
        dailySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_harian || false,
        weeklySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_mingguan || false,
        lowStock:
          settingsNotification.data.data.emailNotification.stok_habis_harian ||
          false
      });

      setTimingState({
        daily_sales: settingsNotification.data.data.timeState[0].time,
        weekly_sales: settingsNotification.data.data.timeState[1].time,
        stock_alert: settingsNotification.data.data.timeState[2].time
      });

      setMinimum(settingsNotification.data.data.minimum);
      setDay(settingsNotification.data.data.day);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMinimumChange = (e) => setMinimum(e.target.value);
  const handleDayChange = (e) => setDay(e.target.value);

  const handleDailyChange = (e) => {
    setTimingState({
      ...e,
      daily_sales: dayjs(e).format(),
      weekly_sales: timingState.weekly_sales,
      stock_alert: timingState.stock_alert
    });
  };
  const handleWeeklyChange = (e) => {
    setTimingState({
      ...e,
      daily_sales: timingState.daily_sales,
      weekly_sales: dayjs(e).format(),
      stock_alert: timingState.stock_alert
    });
  };
  const handleStockChange = (e) => {
    setTimingState({
      ...e,
      daily_sales: timingState.daily_sales,
      weekly_sales: timingState.weekly_sales,
      stock_alert: dayjs(e).format()
    });
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
      timeValue: timingState.daily_sales,
      name: "dailySales",
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="daily-sales"
          label="Select Time"
          ampm={false}
          name="daily_sales"
          disabled={stateComponent === "show" ? true : false}
          value={timingState.daily_sales}
          onChange={handleDailyChange}
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
      timeValue: timingState.weekly_sales,
      name: "weeklySales",
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="weekly-sales"
          name="weekly_sales"
          label="Select Time"
          ampm={false}
          disabled={stateComponent === "show" ? true : false}
          value={timingState.weekly_sales}
          onChange={handleWeeklyChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: "You can choose timing for sending email Weekly Sales Report",
      low: (
        <FormControl style={{ width: "100%" }}>
          <InputLabel htmlFor="hari">Day</InputLabel>
          <Select
            native
            value={day}
            onChange={handleDayChange}
            disabled={stateComponent === "show" ? true : false}
            inputProps={{
              name: "hari",
              id: "hari"
            }}
          >
            <option aria-label="None" value="" />
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
            <option value={0}>Sunday</option>
          </Select>
        </FormControl>
      ),
      text2: "You can change the day for set Weekly Reports"
    },
    {
      field: "Low Stock Alert",
      description:
        "Get a daily notification when a product stock is nearly empty / empty",
      value: switchState.lowStock,
      timeValue: timingState.stock_alert,
      name: "lowStock",
      low: (
        <TextField
          label="Minimum"
          type="number"
          disabled={stateComponent === "show" ? true : false}
          onChange={handleMinimumChange}
          value={minimum}
          min="0"
          id="standard-size-normal"
          defaultValue="Normal"
        />
      ),
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="low-stock"
          name="stock_alert"
          ampm={false}
          label="Select Time"
          disabled={stateComponent === "show" ? true : false}
          value={timingState.stock_alert}
          onChange={handleStockChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: "You can select time for sending email Low Stock Alert",
      text2: "You can set the minimum all stock for notifications"
    }
  ];

  const sendData = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const emailData = {
      rekap_kas: switchState.cashRecap,
      stok_habis_harian: switchState.lowStock,
      penjualan_produk_harian: switchState.dailySales,
      penjualan_produk_mingguan: switchState.weeklySales,
      daily_sales_time: timingState.daily_sales,
      weekly_sales_time: timingState.weekly_sales,
      stock_alert_time: timingState.stock_alert,
      minimum_stock: minimum,
      day: day
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
                  <Col md={4}>
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
                  <Col md={2}>
                    {item.low ? item.low : ""}
                    {item.text2 ? item.text2 : ""}
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
