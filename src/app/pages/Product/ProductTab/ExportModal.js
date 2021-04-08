import React from 'react'
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import axios from 'axios'
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from 'react-number-format';
import rupiahFormat from "rupiah-format";
import Moment from 'react-moment';
import { useTranslation } from "react-i18next";
const ExportModal = ({state, closeModal, optionsOutlet, handleExports, loading, dataProduct}) => {
  const { t } = useTranslation();
  const [currency, setCurrency] = React.useState("")
const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])

  return (
    <div>
      <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("exportProduct")}</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("locationOutlet")}:</Form.Label>
                <Select
                  options={optionsOutlet}
                  isMulti
                  name="outlet_id"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(value) => handleExports(value)}
                />
              </Form.Group>
            </Col>

          </Row>
          <div className="d-flex align-items-end flex-column">
            {dataProduct.length > 0 ? (
              <>
                <ExportExcel
                  id="test-table-xls-button"
                  className="btn btn-outline-primary mx-2"
                  table="table-to-xls"
                  filename="tablexls"
                  sheet="tablexls"
                  buttonText={t("export")}
                />
                <div style={{ display: "none" }}>
                  <table id="table-to-xls">
                    <tr>
                      <th>{t("exportProductResult")}</th>
                    </tr>
                    <tr style={{ backgroundColor: "yellow", fontWeight: "700"}}>
                      <th>{t("productName")}</th>
                      <th>{t("description")}</th>
                      <th>{t("barcode")}</th>
                      <th>{t("sku")}</th>
                      <th>{t("price")}</th>
                      <th>{t("purchasePrice")}</th>
                      <th>{t("favorite")}</th>
                      <th>{t("category")}</th>
                      <th>{t("withRecipe")}</th>
                      <th>{t("stock")}</th>
                      <th>{t("unit")}</th>
                      <th>{t("expiredDate")}</th>
                    </tr>
                    {dataProduct.map((value, index) =>
                      <tr key={index}>
                        <td>{value.name ? value.name : "-"}</td>
                        <td>{value.description ? value.description : "-"}</td>
                        <td>{value.barcode ? value.barcode : "-"}</td>
                        <td>{value.sku ? value.sku : "-"}</td>
                        {/* <td>{value.price ? <NumberFormat value={parseInt(value.price)} className="foo" displayType={'text'} thousandSeparator={true} prefix={'Rp.'} renderText={(value, props) => <div {...props}>{value},00</div>} /> : "-"}</td> */}
                        <td>{value.price ? <NumberFormat value={value.price} displayType={'text'} thousandSeparator={true} prefix={currency} /> : "-"}</td>
                        {/* <td>{value.price_purchase ? <NumberFormat value={parseInt(value.price_purchase)} className="foo" displayType={'text'} thousandSeparator={true} prefix={'Rp.'} renderText={(value, props) => <div {...props}>{value},00</div>} /> : "-"}</td> */}
                        <td>{value.price_purchase ? <NumberFormat value={value.price_purchase} displayType={'text'} thousandSeparator={true} prefix={currency} /> : "-"}</td>
                        <td>{value.is_favorite ? "Is Favorite" : "-"}</td>
                        <td>{value.Product_Category === null ? "-" : value.Product_Category.name}</td>
                        <td>{value.recipe_id ? "With Recipe" : "-"}</td>
                        <td>{value.stock ? value.stock : "-"}</td>
                        <td>{value.Unit === null ? "-" : value.Unit.name}</td>
                        <td>{value.Stocks.length > 0 ? <Moment format="YYYY/MM/DD" date={value.Stocks[0].expired_date} /> : "-"}</td>
                      </tr>
                    )}
                  </table>
                </div>
              </>
            ) : ""}
          </div>
        </Modal.Body>

        {/* <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Confirm"
            )}
          </Button>
        </Modal.Footer> */}
    </Modal>
    </div>
  );
}

export default ExportModal;
