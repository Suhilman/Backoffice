import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import rupiahFormat from "rupiah-format";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "../style.css";
import NumberFormat from 'react-number-format'
import {
  Paper
} from "@material-ui/core";
import { FeatureReport } from './components/FeatureReport'
import {
  Row,
  Col
} from "react-bootstrap";

export const SalesTypeTab = () => {
  const [refresh, setRefresh] = React.useState(0)
  const handleRefresh = () => setRefresh((state) => state + 1)

  const [selectedOutlet, setSelectedOutlet] = React.useState({
    id: "",
    name: "All Outlet"
  })
  const [startDate, setStartDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [endDateFilename, setEndDateFilename] = React.useState("");
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [tabData, setTabData] = React.useState({
    no: 3,
    table: "table-sales",
    filename: `sales-type_${startDate}-${endDateFilename}`
  })
  const [status, setStatus] = React.useState("");

  const [allSalesTypes, setAllSalesTypes] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);
  const [currency, setCurrency] = React.useState("")
  
  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    // console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])

  const { t } = useTranslation();
  const getTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/sales-type`);
      const types = data.data.map((item) => item.name);
      setAllTypes(types);
    } catch (err) {
      if (err.response.status === 404) {
        setAllTypes([]);
      }
      console.log(err);
    }
  };

  const getSalesType = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    if (start_range === end_range) {
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    if (new Date(start_range) > new Date(end_range)) {
      start_range = dayjs(start_range)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    try {
      // const { data } = await axios.get(
      //   `${API_URL}/api/v1/transaction/sales-type${outlet_id}date_start=${start_range}&date_end=${end_range}`
      // );
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/sales-type/mdr${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );

      setAllSalesTypes(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllSalesTypes([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTypes();
  }, []);

  React.useEffect(() => {
    getSalesType(selectedOutlet.id, startDate, endDate);
    setTabData({
      ...tabData,
      filename: `sales-type_${startDate}-${endDateFilename}`
    })
  }, [selectedOutlet, startDate, endDate, refresh, endDateFilename]);

  const salesTypeData = () => {
    const data = [];

    const allTransactions = allSalesTypes.filter(
      (item) => item.Payment?.status === "done"
    );
    const types = allTransactions.map((item) =>
      [
        ...new Set(
          item.Transaction_Items.map((val) => {
            return val.Sales_Type.name;
          })
        )
      ].join(" + ")
    );
    const newTypes = types.map((item, index) => {
      return { type: item, transaction: allTransactions[index] };
    });
    const numberTransactions = newTypes.reduce((map, val) => {
      map[val.type] = (map[val.type] || 0) + 1;
      return map;
    }, {});
    const joinedTransactions = newTypes.reduce((init, curr, index, self) => {
      init[curr.type] = self
        .filter((item) => item.type === curr.type)
        .map((item) => item.transaction);
      return init;
    }, {});

    const newAllTypes = [...new Set([...types, ...allTypes])];
    const haveTransactions = Object.keys(numberTransactions);
    newAllTypes.forEach((type) => {
      if (haveTransactions.includes(type)) {
        const totalCollected = joinedTransactions[type].reduce(
          (init, curr) => (init += curr.Payment.payment_total),
          0
        );

        data.push({
          type,
          transaction: numberTransactions[type],
          total: totalCollected
        });
      } else {
        data.push({
          type,
          transaction: 0,
          total: 0
        });
      }
    });

    data.sort((a, b) => b.transaction - a.transaction);

    const totalTransactions = data.reduce(
      (init, curr) => (init += curr.transaction),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    data.push({
      type: "",
      transaction: totalTransactions,
      total: totalAmount
    });

    return data;
  };

  const handleStartDate = (date) => setStartDate(date)
  const handleEndDate = (date) => setEndDate(date)
  const handleEndDateFilename = (date) => setEndDateFilename(date)
  const handleSelectedOutlet = (outlet) => setSelectedOutlet(outlet)
  const handleSelectStatus = (status) => setStatus(status.target.value)
  const handleTimeStart = (time) => setStartTime(time)
  const handleTimeEnd = (time) => setEndTime(time)

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <FeatureReport
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              tabData={tabData}
              handleEndDateFilename={handleEndDateFilename}
              handleSelectedOutlet={handleSelectedOutlet}
              titleReport="reportSalesType"
              handleSelectStatus={handleSelectStatus}
              handleTimeStart={handleTimeStart}
              handleTimeEnd={handleTimeEnd}
            />
            <Table id="table-sales" striped>
              <thead>
                <tr>
                  <th></th>
                  <th>{t("type")}</th>
                  <th>{t("numberOfTransaction")}</th>
                  <th>{t("totalCollected")}</th>
                </tr>
              </thead>
              <tbody>
                {salesTypeData().map((item, index) => {
                  return (
                    <tr key={index}>
                      <td></td>
                      <td>{item.type}</td>
                      <td>{item.transaction}</td>
                      <td><NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </>
  );
};
