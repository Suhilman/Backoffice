import React from 'react'
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import axios from 'axios'
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
import rupiahFormat from "rupiah-format";
import { useTranslation } from "react-i18next";
const ExportModal = ({state, closeModal, optionsOutlet, handleExports, loading, dataProduct, showFeature}) => {
  const { t } = useTranslation();

  const [fileName, setFileName] = React.useState("")
  const [currency, setCurrency] = React.useState("")

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    setCurrency(data.data.Currency.name)
  }

  const handleFilename = () => {
    const uniqueArray = [];
    dataProduct.map(value => {
      if(uniqueArray.indexOf(value.Outlet.name) === -1) {
        uniqueArray.push(value.Outlet.name);
      }
    })

    const dt = new Date();
    const dateTime = `${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')}-${
      dt.getFullYear().toString().padStart(4, '0')}_${
      dt.getHours().toString().padStart(2, '0')}-${
      dt.getMinutes().toString().padStart(2, '0')}-${
      dt.getSeconds().toString().padStart(2, '0')}`

    const FileName = () => {
      if(dataProduct.length) {
        console.log("dataProduct", dataProduct)
        return `List-Product_${dataProduct[0]?.Business.name}_${uniqueArray.join("_")}_${dateTime}`
      }
    }
    setFileName(FileName)
  }

  React.useEffect(() => {
    handleCurrency()
  }, [])

  React.useEffect(() => {
    handleFilename()
  }, [dataProduct])

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
                  placeholder={t('select')}
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
                  table="table-to-xlsx"
                  filename={fileName}
                  sheet="tablexlsx"
                  buttonText={t("export")}
                />
                <div style={{ display: "none" }}>
                  <table id="table-to-xlsx">
                    <tr>
                      <th>{t("exportProductResult")}</th>
                    </tr>
                    <tr >
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("productName")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("description")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("barcode")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("sku")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("price")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("capitalPrice")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("favorite")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("category")}</th>
                      {showFeature.recipe ? (
                        <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("withRecipe")}</th>
                      ) : null}
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("stock")}</th>
                      <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("unit")}</th>
                      {showFeature.expired ? (
                        <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("expiredDate")}</th>
                      ) : null}
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('nameOfProductBeingSold')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('explanationOfTheProductBeingSold')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('canBeNumbersLetters&Symbols')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('canBeNumbersLetters&SymbolsIfYouWantToAutoGenerateYouCanLeaveItBlankOrEnter')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('nameOfProductBeingSold')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('mustBeAnumber(WithoutSymbolsLike)')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('1IfYouWantToAddToFavoriteMenu')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('groupNameOfAProduct')}</th>
                      {showFeature.recipe ? (
                        <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('1IfProductHasRecipe(ForRawMaterial)')}</th>
                      ) : null}
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('mustBeAnumber(WithoutSymbolsLike)')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterTheUnitNameAccordingToTheUnitNameInTheSystem')}</th>
                      {showFeature.expired ? (
                        <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterTheDateInDD/MM/YYYYFormatTextFormat')}</th>
                      ) : null}
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('willAppearInTheBeetPOSListMenu')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}> </th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('noProductsCanHaveTheSameBarcode')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('noProductsCanHaveTheSameSku')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('productSalesPrice')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('productPurchasePrice(HPP)')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('0IfYouDontWantToAddToFavoriteMenu')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('ifYouAlreadyHaveACategoryWriteItAccordingToTheNameOfTheCategory (IfItDoesntMatchANewCategoryWillBeCreated)')}</th>
                      {showFeature.recipe ? (
                        <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('0IfTheProductDoesNotHaveARecipe(SoldSingly)')}</th>
                      ) : null}
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterIfEmpty')}</th>
                      <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('ifItDoesntMatchANewUnitWillBeCreatedCapitalLettersMatter')}</th>
                      {showFeature.expired ? (
                        <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterIfEmpty')}</th>
                      ) : null}
                    </tr>
                    {dataProduct.map((value, index) =>
                      <tr key={index}>
                        <td>{value.name ? value.name : "-"}</td>
                        <td>{value.description ? value.description : "-"}</td>
                        <td>{value.barcode ? value.barcode : "-"}</td>
                        <td>{value.sku ? value.sku : "-"}</td>
                        <td>{value.price ? <NumberFormat value={value.price} displayType={'text'} thousandSeparator={true} prefix={currency} /> : "-"}</td>
                        <td>{value.price_purchase ? <NumberFormat value={value.price_purchase} displayType={'text'} thousandSeparator={true} prefix={currency} /> : "-"}</td>
                        <td>{value.is_favorite ? 1 : 0}</td>
                        <td>{value.Product_Category === null ? "-" : value.Product_Category.name}</td>
                        {showFeature.recipe ? (
                          <td>{value.recipe_id ? 1 : 0}</td>
                        ) : null}
                        <td>{value.stock ? value.stock : "-"}</td>
                        <td>{value.Unit === null ? "-" : value.Unit.name}</td>
                        {showFeature.expired ? (
                          <td>{value.Stocks.length > 0 ? <Moment format="YYYY/MM/DD" date={value.Stocks[0].expired_date} /> : "-"}</td>
                        ) : null}
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
