import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";

import "../style.css";

export const DiscountSalesTab = ({ selectedOutlet, startDate, endDate }) => {
  const [allPromoSales, setAllPromoSales] = React.useState([]);

  const getDiscountSales = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/promo-sales${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      console.log(data.data);
      setAllPromoSales(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllPromoSales([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getDiscountSales(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  const promoSalesData = () => {
    const data = [];

    const completedTransactions = allPromoSales.filter(
      (item) => item.Payment?.status === "done"
    );
    const paymentPromos = completedTransactions.filter(
      (item) => item.Payment?.Payment_Promos.length
    );

    const automaticPromos = paymentPromos
      .map((item) =>
        item.Payment?.Payment_Promos.filter((val) => val.Promo.Automatic_Promo)
      )
      .flat(1);
    const specialPromos = paymentPromos
      .map((item) =>
        item.Payment?.Payment_Promos.filter((val) => val.Promo.Special_Promo)
      )
      .flat(1);
    const voucherPromos = paymentPromos
      .map((item) =>
        item.Payment?.Payment_Promos.filter((val) => val.Promo.Voucher_Promo)
      )
      .flat(1);

    const countAutomaticPromo = automaticPromos.reduce((init, curr) => {
      init[curr.Promo.Automatic_Promo.name] =
        (init[curr.Promo.Automatic_Promo.name] || 0) + 1;

      let valuePromo = init["value_promo"] || 0;

      if (curr.type === "percentage") {
        const currTransaction = paymentPromos.find(
          (item) => item.Payment.id === curr.payment_id
        );
        const totalTrans = currTransaction.Transaction_Items.reduce(
          (initTrans, currTrans) => (initTrans += currTrans.price_total),
          0
        );
        valuePromo += (totalTrans * curr.value) / 100;
      } else {
        valuePromo += curr.value;
      }

      init["value_promo"] = valuePromo;
      return init;
    }, {});
    const countSpecialPromo = specialPromos.reduce((init, curr) => {
      init[curr.Promo.Special_Promo.name] =
        (init[curr.Promo.Special_Promo.name] || 0) + 1;

      let valuePromo = init["value_promo"] || 0;

      if (curr.type === "percentage") {
        const currTransaction = paymentPromos.find(
          (item) => item.Payment.id === curr.payment_id
        );
        const totalTrans = currTransaction.Transaction_Items.reduce(
          (initTrans, currTrans) => (initTrans += currTrans.price_total),
          0
        );
        valuePromo += (totalTrans * curr.value) / 100;
      } else {
        valuePromo += curr.value;
      }

      init["value_promo"] = valuePromo;
      return init;
    }, {});
    const countVoucherPromo = voucherPromos.reduce((init, curr) => {
      init[curr.Promo.Voucher_Promo.name] =
        (init[curr.Promo.Voucher_Promo.name] || 0) + 1;

      let valuePromo = init["value_promo"] || 0;

      if (curr.type === "percentage") {
        const currTransaction = paymentPromos.find(
          (item) => item.Payment.id === curr.payment_id
        );
        const totalTrans = currTransaction.Transaction_Items.reduce(
          (initTrans, currTrans) => (initTrans += currTrans.price_total),
          0
        );
        valuePromo += (totalTrans * curr.value) / 100;
      } else {
        valuePromo += curr.value;
      }

      init["value_promo"] = valuePromo;
      init["quota_voucher"] = curr.Promo.Voucher_Promo.quota;
      return init;
    }, {});

    if (Object.keys(countSpecialPromo).length) {
      const specialPromo = {};
      for (const key of Object.keys(countSpecialPromo)) {
        if (key === "value_promo") {
          specialPromo.total = countSpecialPromo[key];
        } else {
          specialPromo.name = key;
          specialPromo.usage = countSpecialPromo[key];
        }
      }
      data.push(specialPromo);
    }

    if (Object.keys(countAutomaticPromo).length) {
      const automaticPromo = {};
      for (const key of Object.keys(countAutomaticPromo)) {
        if (key === "value_promo") {
          automaticPromo.total = countAutomaticPromo[key];
        } else {
          automaticPromo.name = key;
          automaticPromo.usage = countAutomaticPromo[key];
        }
      }
      data.push(automaticPromo);
    }

    if (Object.keys(countVoucherPromo).length) {
      const automaticPromo = {};
      for (const key of Object.keys(countVoucherPromo)) {
        if (key === "value_promo") {
          automaticPromo.total = countVoucherPromo[key];
        } else if (key === "quota_voucher") {
          automaticPromo.quota = countVoucherPromo[key];
        } else {
          automaticPromo.name = key;
          automaticPromo.usage = countVoucherPromo[key];
        }
      }
      data.push(automaticPromo);
    }

    const totalUsage = data.reduce(
      (init, curr) => (init += curr.usage || 0),
      0
    );
    const totalAmount = data.reduce(
      (init, curr) => (init += curr.total || 0),
      0
    );

    data.push({
      name: "",
      usage: totalUsage,
      total: totalAmount
    });

    return data;
  };

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>Discount Name</th>
            <th>Total Usage</th>
            <th>Total Collected</th>
          </tr>
        </thead>
        <tbody>
          {promoSalesData().map((item, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{item.name}</td>
                <td>
                  {item.quota ? `${item.usage}/${item.quota}` : item.usage}
                </td>
                <td>{rupiahFormat.convert(item.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};