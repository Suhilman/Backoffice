import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Row,
  Col,
  Form,
  Dropdown,
  ListGroup,
  DropdownButton
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
// import { Search, MoreHoriz } from "@material-ui/icons";
import ExportExcel from "react-html-table-to-excel";

import "../style.css";

export const TransactionHistoryTab = ({ allOutlets, ranges }) => {
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const [rangeId, setRangeId] = React.useState(1);
  const [rangeName, setRangeName] = React.useState("Today");

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

  const [allTransactions, setAllTransactions] = React.useState([]);

  const [status, setStatus] = React.useState("");

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

  const getTransactions = async (
    id,
    status,
    range_id,
    start_range,
    end_range
  ) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { date_start, date_end } = ranges(start_range, end_range).find(
      (item) => item.id === range_id
    );

    const outlet_id = id ? `&outlet_id=${id}` : "";
    const filter = status ? `&status=${status}` : "";

    let allSales;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction?order=newest&per_page=999${outlet_id}&date_start=${date_start}&date_end=${date_end}${filter}`
      );
      setAllTransactions(data.data);
      allSales = data.data;
    } catch (err) {
      if (err.response.status === 404) {
        setAllTransactions([]);
      }
      allSales = [];
      console.log(err);
    }

    const compileReports = allSales.map((item) => {
      const allItems = item.Transaction_Items.map((val) => {
        return {
          date: dayjs(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
          receipt_id: item.receipt_id,
          status: item.Payment?.status || "",
          outlet_name: item.Outlet.name,
          sales_type: val.Sales_Type.name,
          user: item.User.User_Profile.name,
          customer_phone_number: item.Customer_Profile?.phone_number || "",
          customer_name: item.Customer_Profile?.name || "",
          sku: val.sku || "",
          product_name: val.Product.name,
          category_name: val.Product.Product_Category.name,
          quantity: val.quantity,
          price_product: val.price_product
        };
      });

      return allItems;
    });

    setReports(compileReports.flat(1));
  };

  React.useEffect(() => {
    getTransactions(outletId, status, rangeId, startRange, endRange);
  }, [outletId, status, rangeId, startRange, endRange]);

  const handleSelectOutlet = (data) => {
    if (data) {
      setOutletId(data.id);
      setOutletName(data.name);
    } else {
      setOutletId("");
      setOutletName("All Outlets");
    }
  };

  const handleSelectRange = (data) => {
    setRangeId(data.id);
    setRangeName(data.value);

    if (data.id === 9) {
      setStartRange(new Date());
      setEndRange(new Date());
    }
  };

  const handleSelectStatus = (e) => setStatus(e.target.value);

  const filename = () => {
    const value = ranges(startRange, endRange).find(
      (item) => item.id === rangeId
    ).valueId;
    const date = ranges(startRange, endRange).find(
      (item) => item.id === rangeId
    ).displayDate;

    const processValue = value
      .split(" ")
      .join("-")
      .toLowerCase();
    return `riwayat-transaksi-${processValue}_${date}`;
  };

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
      name: "Created At",
      selector: "created_at",
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
        payment_total: item.Payment?.payment_total || 0,
        outlet_name: item.Outlet.name,
        created_at: dayjs(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
        status: item.status,
        items: item.Transaction_Items
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    const head = ["Sales Type", "Product", "Addons", "Quantity", "Price"];
    const body = data.items.map((item) => {
      const addons = item.Transaction_Item_Addons.map((val) => val.Addon.name);

      return [
        item.Sales_Type.name,
        item.Product.name,
        addons.join(","),
        item.quantity,
        item.price_product
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
                {
                  ranges(startRange, endRange).find(
                    (item) => item.id === rangeId
                  ).displayDate
                }
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

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Transaction History</h3>
              </div>
              <div className="headerEnd">
                <Row>
                  <DropdownButton title={rangeName} variant="outline-secondary">
                    {ranges(startRange, endRange).map((item) => {
                      if (item.id === 9) return "";

                      return (
                        <Dropdown.Item
                          key={item.id}
                          onClick={() => handleSelectRange(item)}
                        >
                          {item.value}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>

                  <DropdownButton
                    title={outletName}
                    style={{ margin: "0 1rem" }}
                    variant="outline-secondary"
                  >
                    <Dropdown.Item onClick={() => handleSelectOutlet()}>
                      All Outlets
                    </Dropdown.Item>
                    {allOutlets.map((item, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleSelectOutlet(item)}
                        >
                          {item.name}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>

                  <ExportExcel
                    className="btn btn-outline-primary"
                    table="table-history-transaction"
                    filename={filename()}
                    sheet="transaction-history"
                    buttonText="Export"
                  />
                </Row>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                {/* <Col>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      <Search />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col> */}
                <Col md={6}>
                  <Row>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label
                          style={{ alignSelf: "center", marginBottom: "0" }}
                        >
                          Status:
                        </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            name="status"
                            value={status}
                            onChange={handleSelectStatus}
                            onBlur={handleSelectStatus}
                          >
                            <option value={""}>All Status</option>
                            {["New", "Done", "Refund", "Closed"].map(
                              (item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item.toLowerCase()}
                                  >
                                    {item}
                                  </option>
                                );
                              }
                            )}
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            <div
              style={{
                paddingRight: "1rem",
                paddingTop: "1rem",
                textAlign: "right"
              }}
            >
              <p>
                <b>Date:</b>{" "}
                {
                  ranges(startRange, endRange).find(
                    (item) => item.id === rangeId
                  ).displayDate
                }
              </p>
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
          </Paper>
        </Col>
      </Row>
    </>
  );
};
