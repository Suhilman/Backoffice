import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";

import "../style.css";

export const PaymentMethodTab = ({ selectedOutlet, startDate, endDate }) => {
  const [allPaymentMethods, setAllPaymentMethods] = React.useState([]);

  const getPaymentMethod = async (id, start_range, end_range) => {
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
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/payment-method${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setAllPaymentMethods(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllPaymentMethods([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getPaymentMethod(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  const paymentMethodData = () => {
    const data = [];

    allPaymentMethods.forEach((item) => {
      const allPayments = item.Payments.filter(
        (item) => item.status === "done"
      );

      const totalCollected = allPayments.reduce(
        (init, curr) => (init += curr.payment_total),
        0
      );

      data.push({
        method: item.name,
        transaction: allPayments.length,
        total: totalCollected
      });
    });

    data.sort((a, b) => b.transaction - a.transaction);

    const totalTransactions = data.reduce(
      (init, curr) => (init += curr.transaction),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    data.push({
      method: "",
      transaction: totalTransactions,
      total: totalAmount
    });

    return data;
  };

  return (
    <>
      <Table id="table-payment" striped>
        <thead>
          <tr>
            <th></th>
            <th>Payment Method</th>
            <th>Number of Transaction</th>
            <th>Total Collected</th>
          </tr>
        </thead>
        <tbody>
          {paymentMethodData().map((item, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{item.method}</td>
                <td>{item.transaction}</td>
                <td>{rupiahFormat.convert(item.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
