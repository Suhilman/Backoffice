import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Paper } from "@material-ui/core";
import {
  Button,
  InputGroup,
  Form,
  Row,
  Col,
  Dropdown,
  Spinner
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import ConfirmModal from "../../../components/ConfirmModal";

const PurchaseOrderPage = ({ refresh, handleRefresh, t }) => {
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [alert, setAlert] = React.useState(0);

  const debouncedSearch = useDebounce(search, 1000);

  // const [filter, setFilter] = React.useState({
  //   time: "newest"
  // });

  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [statePdfModal, setStatePdfModal] = React.useState(false);
  const [currOrder, setCurrOrder] = React.useState({
    id: "",
    code: ""
  });
  const [urlPdf, setUrlPdf] = React.useState("");

  const [salesOrder, setSalesOrder] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]);
  const [allCustomers, setAllCustomers] = React.useState([]);

  const getPurchaseOrder = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterStock = `?code=${search}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/sales-order`
      );
      console.log("getPurchaseOrder", data.data)
      setSalesOrder(data.data);
    } catch (err) {
      console.log("error getPurchaseOrder", err)
      setSalesOrder([]);
    }
  };

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProducts = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product`);
      setAllProducts(data.data);
    } catch (err) {
      setAllProducts([]);
    }
  };

  const getCustomer = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/customer`);
      setAllCustomers(data.data);
    } catch (err) {
      setAllCustomers([]);
    }
  };

  React.useEffect(() => {
    getPurchaseOrder(debouncedSearch);
  }, [refresh, debouncedSearch]);

  React.useEffect(() => {
    getCustomer();
  }, [refresh]);

  React.useEffect(() => {
    getOutlets();
    getProducts();
  }, []);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSearch = (e) => setSearch(e.target.value);
  // const handleFilter = (e) => {
  //   const { name, value } = e.target;
  //   const filterData = { ...filter };
  //   filterData[name] = value;
  //   setFilter(filterData);
  // };

  const handleDeleteOrder = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    setAlert("");

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/sales-order/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const handleGetPDF = async (id) => {
    showPdfModal();
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      enableLoading();
      const { data } = await axios.get(
        `${API_URL}/api/v1/purchase-order/get-pdf/${id}`
      );
      disableLoading();
      setUrlPdf(`${API_URL}${data.data}`);
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const showDeleteModal = (data) => {
    setCurrOrder({
      id: data.id,
      code: data.code
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const showPdfModal = () => setStatePdfModal(true);
  const closePdfModal = () => setStatePdfModal(false);

  const columns = [
    {
      name: "No.",
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: "S.O ID",
      selector: "code",
      sortable: true
    },
    {
      name: `${t("customerName")}`,
      selector: "customer_name",
      sortable: true
    },
    {
      name: `${t("soNumber")}`,
      selector: "so_number",
      sortable: true
    },
    {
      name: `${t("date")}`,
      selector: "date",
      sortable: true
    },
    {
      name: `${t("status")}`,
      selector: "status",
      sortable: true
    },
    {
      name: `${t("actions")}`,
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link
                to={{
                  pathname: `/inventory/sales-order/${rows.id}`,
                  state: {
                    allOutlets,
                    allProducts,
                    allCustomers
                  }
                }}
              >
                <Dropdown.Item as="button">Detail</Dropdown.Item>
              </Link>
              {rows.status === 'pending' ? (
                <Link
                  to={{
                    pathname: `/inventory/edit-sales-order/${rows.id}`,
                    state: {
                      allOutlets,
                      allProducts,
                      allCustomers
                    }
                  }}
                >
                  <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
                </Link>
              ) : null}
              {/* <Dropdown.Item as="button" onClick={() => handleGetPDF(rows.id)}>
                Save to PDF
              </Dropdown.Item> */}
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataOrder = salesOrder.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      code: item.code,
      customer_name: item.Customer.name,
      so_number: item.so_number,
      date: dayjs(item.date).format("DD/MM/YYYY"),
      status: item.status
    };
  });

  return (
    <>
      <ConfirmModal
        title={`${t("deletePurchaseOrder")} - ${currOrder.code}`}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={() => handleDeleteOrder(currOrder.id)}
        loading={loading}
        alert={alert}
      />

      <ConfirmModal
        title={t("savePdf")}
        buttonColor="danger"
        state={statePdfModal}
        closeModal={closePdfModal}
        alert={alert}
      >
        <div style={{ textAlign: "center" }}>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <a href={urlPdf} target="_blank" rel="noopener noreferrer">
              {t("clickhere")}
            </a>
          )}
        </div>
      </ConfirmModal>

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("salesOrder")}</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/inventory/sales-order/add",
                    state: { allOutlets, allProducts, allCustomers }
                  }}
                >
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                    {t("addNewPurchaseOrder")}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup className="pb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ background: "transparent" }}>
                        <Search />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      placeholder={t("search")}
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>

                {/* <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Time:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="time"
                        value={filter.time}
                        onChange={handleFilter}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col> */}
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataOrder}
              style={{ minHeight: "100%" }}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default PurchaseOrderPage;