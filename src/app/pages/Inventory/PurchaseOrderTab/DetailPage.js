import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { jsPDF } from "jspdf"
import Pdf from "react-to-pdf";
import beetposLogo from '../../../../images/396 PPI-06 1.png'

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailPurchaseOrderPage = ({ match }) => {
  const { orderId } = match.params;

  const ref = React.createRef()

  const [purchaseOrder, setPurchaseOrder] = React.useState("");
  const [dataToPdf, setDataToPdf] = React.useState({})

  const getPurchaseOrder = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const data = await axios.get(
        `${API_URL}/api/v1/purchase-order/${id}`
      );
      if (data.request.status === 200) {
        const resultSupplier = await axios.get(
          `${API_URL}/api/v1/supplier/${data.data.data.supplier_id}`
        )
        const resultBusiness = await axios.get(
          `${API_URL}/api/v1/business/${data.data.data.business_id}`
        )
        if (resultBusiness.request.status === 200) {
          const resultOwner = await axios.get(
            `${API_URL}/api/v1/owner/${resultBusiness.data.data.owner_id}`
          )
          const totalTagihan = []
          data.data.data.Purchase_Order_Products.map(value => {
            totalTagihan.push(value.total_price)
          })
          const reducer = (accumulator, currentValue) => accumulator + currentValue;
          const allData = {
            dataPembelian: data.data.data.date,
            tagihan: totalTagihan.reduce(reducer),
            // orderPurchase: data.data.data.Purchase_Order_Products,
            // hargaUnit: data.data.data.Purchase_Order_Products[0].price,
            // kuantitas: data.data.data.Purchase_Order_Products[0].quantity,
            // produk: data.data.data.Purchase_Order_Products[0].Product.name,
            namaSupplier: resultSupplier.data.data.name,
            alamatSupplier: resultSupplier.data.data.address,
            nomorTeleponSupplier: resultSupplier.data.data.phone_number,
            emailSupplier: resultSupplier.data.data.email,
            namaBusiness: resultBusiness.data.data.name,
            alamatBusiness: `${resultBusiness.data.data.Location.name}, ${resultBusiness.data.data.Location.City.name} ${resultBusiness.data.data.Location.City.Province.name}`,
            emailBusiness: resultOwner.data.data.email
          }
          setDataToPdf(allData)
          setPurchaseOrder(data.data.data)
        }
      } else {
        console.log('something went wrong')
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log('ini semua data', purchaseOrder.Purchase_Order_Products)

  React.useEffect(() => {
    getPurchaseOrder(orderId);
  }, [orderId]);

  const columns = [
    {
      name: "Product Name",
      selector: "product_name",
      sortable: true
    },
    {
      name: "Quantity",
      selector: "quantity",
      sortable: true
    },
    {
      name: "Price",
      selector: "price",
      sortable: true
    },
    {
      name: "Total Price",
      selector: "total_price",
      sortable: true
    }
  ];

  const handleExportPdf = () => {
    console.log('hello pdf')
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
    });
    
    doc.text("Purchase Order", 1, 1);
    doc.text("lagi lagi", 1, 1.2);
    doc.text("lagi lagi lagi", 1, 1.4);    
    doc.save("two-by-four.pdf");
  }

  const options = {
    orientation: 'landscape'
  };

  const dataOrder = purchaseOrder
    ? purchaseOrder.Purchase_Order_Products.map((item, index) => {
        return {
          product_name: item.Product.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price
        };
      })
    : [];
  return (
    <>
      <div className="style-pdf" ref={ref}>
          <div className="container">
            <div className="row justify-content-between mb-5">
              <div className="col-md-6">
                <h1>Purchase Order</h1>
                <div className="d-flex justify-content-between">
                  <h4>Tanggal Pembelian</h4>
                  <p className="text-mute">{dataToPdf.dataPembelian}</p>
                </div>
                <h4>Nominal Total</h4>
                <h2>Rp. {dataToPdf.tagihan}</h2>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-end">
                <div className="logo-wrapper">
                  <img src={beetposLogo} alt="Logo BeetPOS"/>
                </div>
                <h5 className="text-mute">PT Lifetech Tanpa Batas</h5>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-4">
                <h4 className="font-weight-bold">Kepada</h4>
                <h6>{dataToPdf.namaSupplier}</h6>
                <h6>{dataToPdf.alamatSupplier}</h6>
                <h6>{dataToPdf.nomorTelephoneSupplier}</h6>
                <h6>{dataToPdf.emailSupplier}</h6>
              </div>
              <div className="col-md-8">
                <h4 className="font-weight-bold">Pembeli</h4>
                <h6>{dataToPdf.namaBusiness}</h6>
                <h6>{dataToPdf.alamatBusiness}</h6>
                <h6>{dataToPdf.emailBusiness}</h6>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-12">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Produk</th>
                      <th scope="col">Kuantitas</th>
                      <th scope="col">Harga Unit (Rp)</th>
                      <th scope="col">Harga Total (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrder ? 
                      purchaseOrder.Purchase_Order_Products.map((item) => 
                        <tr>
                          <td>{item.Product.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                          <td>{item.total_price}</td>
                        </tr> 
                        )
                    : ""}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row align-items-end flex-column mr-3">
              <div className="d-flex">
                <p className="text-mute mr-5">Subtotal Harga</p>
                <p className="text-mute ml-5">{dataToPdf.tagihan}</p>
              </div>
              <div className="d-flex">
                <h4 className="mr-5">Total Tagihan</h4>
                <h4 className="text-mute ml-5">{dataToPdf.tagihan}</h4>
              </div>
            </div>
          </div>
        </div>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Purchase Order Detail Summary</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/inventory"
                  }}
                >
                  <Pdf targetRef={ref} filename="purchase-order.pdf" options={options}>
                    {({ toPdf }) => <Button variant="btn btn-outline-primary mr-2" onClick={toPdf}>Export to PDF</Button>}
                  </Pdf>
                  {/* <Button variant="btn btn-outline-primary mr-2" onClick={handleExportPdf}>Export</Button> */}
                  <Button variant="outline-secondary">Back</Button>
                </Link>

                {/* <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  Download
                </Button> */}
              </div>
            </div>

            <Row
              style={{ padding: "1rem", marginBottom: "1rem" }}
              className="lineBottom"
            >
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>P.O ID:</Form.Label>
                  <Form.Control
                    type="text"
                    value={purchaseOrder ? purchaseOrder.code : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>P.O Number:</Form.Label>
                  <Form.Control
                    type="text"
                    value={purchaseOrder ? purchaseOrder.po_number : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    value={purchaseOrder ? purchaseOrder.Outlet?.name : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Date:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      purchaseOrder
                        ? dayjs(purchaseOrder.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Supplier:</Form.Label>
                  <Form.Control
                    type="text"
                    value={purchaseOrder ? purchaseOrder.Supplier.name : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Notes:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={purchaseOrder?.notes || "-"}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

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
