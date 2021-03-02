import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import rupiahFormat from "rupiah-format";
import { Row, Col, ListGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";

import "../style.css";

export const TransactionHistoryTab = ({
  selectedOutlet,
  startDate,
  endDate,
  status
}) => {
  const [allTransactions, setAllTransactions] = React.useState([]);
  const [reports, setReports] = React.useState([
    {
      date: "",
      receipt_id: "",
      status: "",
      outlet_name: "",
      sales_type: "",
      user: "",
      customer_phone_number: "",
      customer_name: "",
      sku: "",
      product_name: "",
      category_name: "",
      quantity: "",
      price_product: ""
    }
  ]);

  const getTransactions = async (id, status, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `&outlet_id=${id}` : "";
    const filter = status ? `&status=${status}` : "";

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
        `${API_URL}/api/v1/transaction?order=newest&per_page=999${outlet_id}&date_start=${start_range}&date_end=${end_range}${filter}`
      );
      setAllTransactions(data.data);

      const compileReports = data.data.map((item) => {
        const allItems = item.Transaction_Items.map((val) => {
          return {
            date: dayjs(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
            receipt_id: item.receipt_id,
            status: item.status,
            outlet_name: item.Outlet?.name,
            sales_type: val.Sales_Type.name,
            user: item.User?.User_Profile.name || "Guest",
            customer_phone_number: item.Customer_Profile?.phone_number || "-",
            customer_name: item.Customer_Profile?.name || "-",
            sku: val.sku || "-",
            product_name: val.Product?.name || "-",
            category_name: val.Product?.Product_Category?.name || "-",
            quantity: val.quantity,
            price_product: val.price_product
          };
        });

        return allItems;
      });

      setReports(compileReports.flat(1));
    } catch (err) {
      setAllTransactions([]);
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTransactions(selectedOutlet.id, status, startDate, endDate);
  }, [selectedOutlet, status, startDate, endDate]);

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "Receipt ID",
      selector: "receipt_id",
      sortable: true
    },
    {
      name: "Staff On Charge",
      selector: "staff_charge",
      sortable: true
    },
    {
      name: "Outlet Name",
      selector: "outlet_name",
      sortable: true
    },
    {
      name: "Payment Total",
      selector: "payment_total",
      sortable: true
    },
    {
      name: "Total Discount",
      selector: "total_discount",
      sortable: true
    },
    {
      name: "Status",
      selector: "status",
      sortable: true
    }
  ];

  const dataTransactions = () => {
    return allTransactions.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        receipt_id: item.receipt_id,
        staff_charge: item.User.User_Profile.name,
        payment_total: rupiahFormat.convert(item.Payment?.payment_total || 0),
        total_discount: rupiahFormat.convert(
          item.Payment?.payment_discount || 0
        ),
        outlet_name: item.Outlet?.name || "-",
        // created_at: dayjs(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
        status: item.status,
        items: item.Transaction_Items
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    const head = ["Sales Type", "Product", "Addons", "Quantity", "Price"];
    const body = data.items.map((item, index) => {
      const addons = item.Transaction_Item_Addons.map((val) => val.Addon.name);
      return [
        item.Sales_Type.name,
        item.Product?.name || "-",
        addons.join(","),
        item.quantity,
        rupiahFormat.convert(item.price_product)
      ];
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              {head.map((item, index) => {
                return (
                  <Col key={index} style={{ fontWeight: "700" }}>
                    {item}
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
          {body.map((item, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  {item.map((val, valIndex) => {
                    return <Col key={valIndex}>{val}</Col>;
                  })}
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-history-transaction">
          <thead>
            <tr>
              <th>Laporan Transaksi Penjualan</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Tanggal</th>
              <td>
                {startDate} - {endDate}
              </td>
            </tr>
            <tr>
              <th>Status Transaksi</th>
              <td>{status ? status : "Semua Transaksi"}</td>
            </tr>
            <tr>
              <th>Produk/Pelanggan</th>
              <td>Semua Pelanggan</td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Tanggal & Waktu</th>
              <th>ID Struk</th>
              <th>Status Pembayaran</th>
              <th>Outlet</th>
              <th>Tipe Penjualan</th>
              <th>User</th>
              <th>No. HP Pelanggan</th>
              <th>Nama Pelanggan</th>
              <th>SKU</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Jumlah Produk</th>
              <th>Harga Produk</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.receipt_id}</td>
                  <td>{item.status}</td>
                  <td>{item.outlet_name}</td>
                  <td>{item.sales_type}</td>
                  <td>{item.user}</td>
                  <td>{item.customer_phone_number}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.sku}</td>
                  <td>{item.product_name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price_product}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DataTable
        noHeader
        pagination
        columns={columns}
        data={dataTransactions()}
        expandableRows
        expandableRowsComponent={<ExpandableComponent />}
        style={{ minHeight: "100%" }}
      />
    </>
  );
};
