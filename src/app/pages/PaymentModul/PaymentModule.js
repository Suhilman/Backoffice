import React from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
  ButtonGroup,
  ListGroup
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import dayjs from 'dayjs'

import { saveAs } from 'file-saver'
import fileDownload from 'js-file-download'

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'

const PaymentModule = () => {
  const { t } = useTranslation();
  console.log("modal form cashlez")

  const InitialFormCz = {
    nama_pemilik: "",
    tempat_tanggal_lahir: "",
    alamat_pemilik_merchant: "",
    kota: "",
    provinsi: "",
    kode_pos: "",
    nomor_hp_merchant: "",
    alamat_email_pemilik_merchant: "",
    ktp: "",
    kk: "",
    nama_merchant: "",
    alamat_usaha_merchant: "",
    kota_merchant: "",
    provinsi_merchant: "",
    kode_pos_merchant: "",
    tipe_usaha_merchant: "",
    status_usaha: "",
    nomor_telp_merchant: "",
    alamat_email_merchant: "",
    bentuk_bidang_usaha: "",
    deskripsi_produk: "",
    nama_bank: "",
    nomor_rekening: "",
    nama_pemilik_rekening: "",
    hari: "",
    tanggal: ""
  }

  const FormCzSchema = Yup.object().shape({
    nama_pemilik: Yup.string()
      .required(`${t("pleaseInputAMerchantOwnerName")}`),
    alamat_pemilik_merchant: Yup.string()
      .required(`${t("pleaseInputAMerchantOwnerAddress")}`),
    kota: Yup.string()
      .required(`${t("pleaseInputAMerchantOwnerCity")}`),
    nomor_hp_merchant: Yup.string()
      .required(`${t("pleaseInputAMerchantOwnerMobileNumber")}`),
    ktp: Yup.string()
      .required(`${t("pleaseInputANo.Identity(KTP/Pasport/KITAS)")}`),
    kk: Yup.string()
      .required(`${t("pleaseInputANo.NPWP/KK")}`),
    alamat_usaha_merchant: Yup.string()
      .required(`${t("pleaseInputAMerchantBusinessAddress")}`),
    kota_merchant: Yup.string()
      .required(`${t("pleaseInputAMerchantCity")}`),
    nomor_telp_merchant: Yup.string()
      .required(`${t("pleaseInputAMerchantPhoneNumber")}`),
    bentuk_bidang_usaha: Yup.string()
      .required(`${t("pleaseInputAForm/FieldOfBusiness")}`),
    deskripsi_produk: Yup.string()
      .required(`${t("pleaseInputAProductDescriptionForSale")}`),
    nama_bank: Yup.string()
      .required(`${t("pleaseInputABankName")}`),
    nomor_rekening: Yup.string()
      .required(`${t("pleaseInputABankaccountnumber")}`),
    nama_pemilik_rekening: Yup.string()
      .required(`${t("pleaseInputANameOfOwnerMerchantAccount")}`)
  });

  const formikFormCz = useFormik({
    enableReinitialize: true,
    initialValues: InitialFormCz,
    validationSchema: FormCzSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      console.log("userInfo", userInfo)
      const dataSend = {
        nama_pemilik: values.nama_pemilik,
        tempat_tanggal_lahir: values.tempat_tanggal_lahir,
        alamat_pemilik_merchant: values.alamat_pemilik_merchant,
        kota: values.kota,
        provinsi: values.provinsi,
        kode_pos: values.kode_pos,
        nomor_hp_merchant: values.nomor_hp_merchant,
        alamat_email_pemilik_merchant: values.alamat_email_pemilik_merchant,
        ktp: values.ktp,
        kk: values.kk,
        nama_merchant: values.nama_merchant,
        alamat_usaha_merchant: values.alamat_usaha_merchant,
        kota_merchant: values.kota_merchant,
        provinsi_merchant: values.provinsi_merchant,
        kode_pos_merchant: values.kode_pos_merchant,
        tipe_usaha_merchant: values.tipe_usaha_merchant,
        status_usaha: values.status_usaha,
        nomor_telp_merchant: values.nomor_telp_merchant,
        alamat_email_merchant: values.alamat_email_merchant,
        bentuk_bidang_usaha: values.bentuk_bidang_usaha,
        deskripsi_produk: values.deskripsi_produk,
        nama_bank: values.nama_bank,
        nomor_rekening: values.nomor_rekening,
        nama_pemilik_rekening: values.nama_pemilik_rekening,
        // hari: values.hari,
        // tanggal: values.tanggal
      }
      console.log("data form cz", dataSend)
      try {
        const date = new Date()
        const formatDate = dayjs(date).format('DD-MM-YYYY')
        const fileName = `FORMULIR APLIKASI MERCHANT - ${formatDate}.pdf`
        const {data} = await axios.post(`${API_URL}/api/v1/modify-pdf`, dataSend, {
          responseType: "blob"
        });
        console.log("result axios.post", data)
        console.log("fileName", fileName)
        // const blob = new Blob([data], { type: 'application/pdf' })
        // saveAs(blob, 'test.pdf')
        await fileDownload(data, fileName)

      } catch (err) {
        console.log("error apa", err)
      }
    }
  });

  const validationFormCz = (fieldname) => {
    if (formikFormCz.touched[fieldname] && formikFormCz.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikFormCz.touched[fieldname] && !formikFormCz.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const handleSubmit = async () => {
    try {
      formikFormCz.submitForm()
      console.log("handle submit", formikFormCz.values)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <div className="headerPage mb-5">
          <div className="headerStart">
            <h3>{t("payment")}</h3>
          </div>
        </div>
        <Row className="px-5">
          <Col>
            <div className="d-flex justify-content-center">
              <div>
                <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("merchantOwnerData")}</strong>
              </div>
            </div>
            <Form.Group>
              <Form.Label>{t("merchantOwnerName")} *</Form.Label>
              <Form.Control
                name="nama_pemilik"
                placeholder={t("enterMerchantOwnerName")}
                {...formikFormCz.getFieldProps("nama_pemilik")}
                className={validationFormCz("nama_pemilik")}
                required
              />
              {formikFormCz.touched.nama_pemilik && formikFormCz.errors.nama_pemilik ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.nama_pemilik}
                  </div>
                </div>
              ) : null}
              <small><em>({t("accordingToTheIdentityOfTheRegisteredMerchantOwner")})</em></small>
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("place&DateOfBirthOfMerchantOwner")}</Form.Label>
              <Form.Control
                name="tempat_tanggal_lahir"
                placeholder={t("enterPlace&DateOfBirthOfMerchantOwner")}
                {...formikFormCz.getFieldProps("tempat_tanggal_lahir")}
                className={validationFormCz("tempat_tanggal_lahir")}
                required
              />
              {formikFormCz.touched.tempat_tanggal_lahir && formikFormCz.errors.tempat_tanggal_lahir ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.tempat_tanggal_lahir}
                  </div>
                </div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("merchantOwner'sAddress")} *</Form.Label>
              <Form.Control
                name="alamat_pemilik_merchant"
                placeholder={t("enterMerchantOwner'sAddress")}
                {...formikFormCz.getFieldProps("alamat_pemilik_merchant")}
                className={validationFormCz("alamat_pemilik_merchant")}
                required
              />
              {formikFormCz.touched.alamat_pemilik_merchant && formikFormCz.errors.alamat_pemilik_merchant ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.alamat_pemilik_merchant}
                  </div>
                </div>
              ) : null}
              <small><em>({t("accordingToTheRegisteredMerchantOwner")})</em></small>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("city")} *</Form.Label>
                  <Form.Control
                    name="kota"
                    placeholder={t("enterCity")}
                    {...formikFormCz.getFieldProps("kota")}
                    className={validationFormCz("kota")}
                    required
                  />
                  {formikFormCz.touched.kota && formikFormCz.errors.kota ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.kota}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("province")}</Form.Label>
                  <Form.Control
                    name="provinsi"
                    placeholder={t("enterProvince")}
                    {...formikFormCz.getFieldProps("provinsi")}
                    className={validationFormCz("provinsi")}
                    required
                  />
                  {formikFormCz.touched.provinsi && formikFormCz.errors.provinsi ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.provinsi}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("postcode")}</Form.Label>
                  <Form.Control
                    name="kode_pos"
                    placeholder={t("enterPostcode")}
                    {...formikFormCz.getFieldProps("kode_pos")}
                    className={validationFormCz("kode_pos")}
                    required
                  />
                  {formikFormCz.touched.kode_pos && formikFormCz.errors.kode_pos ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.kode_pos}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("merchantOwner'sMobileNumber")} *</Form.Label>
                  <Form.Control
                    name="nomor_hp_merchant"
                    placeholder={t("enterMerchantOwner'sMobileNumber")}
                    {...formikFormCz.getFieldProps("nomor_hp_merchant")}
                    className={validationFormCz("nomor_hp_merchant")}
                    required
                  />
                  {formikFormCz.touched.nomor_hp_merchant && formikFormCz.errors.nomor_hp_merchant ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.nomor_hp_merchant}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("merchantOwnerEmailAddress")}</Form.Label>
                  <Form.Control
                    name="alamat_email_pemilik_merchant"
                    placeholder={t("enterMerchantOwnerEmailAddress")}
                    {...formikFormCz.getFieldProps("alamat_email_pemilik_merchant")}
                    className={validationFormCz("alamat_email_pemilik_merchant")}
                    required
                  />
                  {formikFormCz.touched.alamat_email_pemilik_merchant && formikFormCz.errors.alamat_email_pemilik_merchant ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.alamat_email_pemilik_merchant}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                <Form.Label>{t("no.Identity(KTP/Pasport/KITAS)")} *</Form.Label>
                <Form.Control
                  name="ktp"
                  placeholder={t("enterNo.Identity(KTP/Pasport/KITAS)")}
                  {...formikFormCz.getFieldProps("ktp")}
                  className={validationFormCz("ktp")}
                  required
                />
                {formikFormCz.touched.ktp && formikFormCz.errors.ktp ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikFormCz.errors.ktp}
                    </div>
                  </div>
                ) : null}
                <small><em>({t("originalPhotoRequired")})</em></small>
              </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("no.NPWP/KK")} *</Form.Label>
                  <Form.Control
                    name="kk"
                    placeholder={t("enterNo.NPWP/KK")}
                    {...formikFormCz.getFieldProps("kk")}
                    className={validationFormCz("kk")}
                    required
                  />
                  {formikFormCz.touched.kk && formikFormCz.errors.kk ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.kk}
                      </div>
                    </div>
                  ) : null}
                  <small><em>({t("originalPhotoRequired")})</em></small>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <div>
                <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("dataMerchant")}</strong>
              </div>
            </div>
            <Form.Group>
              <Form.Label>{t("merchantName")}</Form.Label>
              <Form.Control
                name="nama_merchant"
                placeholder={t("enterMerchantName")}
                {...formikFormCz.getFieldProps("nama_merchant")}
                className={validationFormCz("nama_merchant")}
                required
              />
              {formikFormCz.touched.nama_merchant && formikFormCz.errors.nama_merchant ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.nama_merchant}
                  </div>
                </div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("merchantBusinessAddress")} *</Form.Label>
              <Form.Control
                name="alamat_usaha_merchant"
                placeholder={t("enterMerchantBusinessAddress")}
                {...formikFormCz.getFieldProps("alamat_usaha_merchant")}
                className={validationFormCz("alamat_usaha_merchant")}
                required
              />
              {formikFormCz.touched.alamat_usaha_merchant && formikFormCz.errors.alamat_usaha_merchant ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.alamat_usaha_merchant}
                  </div>
                </div>
              ) : null}
              <small><em>({t("building/house/mall/apartment/shop")})   ({t("mandatoryPhotoOfBusinessLocation,MerchantNameSignboard/merchantResidence")})</em></small>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("city")} *</Form.Label>
                  <Form.Control
                    name="kota_merchant"
                    placeholder={t("enterCity")}
                    {...formikFormCz.getFieldProps("kota_merchant")}
                    className={validationFormCz("kota_merchant")}
                    required
                  />
                  {formikFormCz.touched.kota_merchant && formikFormCz.errors.kota_merchant ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.kota_merchant}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("province")}</Form.Label>
                  <Form.Control
                    name="provinsi_merchant"
                    placeholder={t("enterProvince")}
                    {...formikFormCz.getFieldProps("provinsi_merchant")}
                    className={validationFormCz("provinsi_merchant")}
                    required
                  />
                  {formikFormCz.touched.provinsi_merchant && formikFormCz.errors.provinsi_merchant ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.provinsi_merchant}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("postcode")}</Form.Label>
                  <Form.Control
                    name="kode_pos_merchant"
                    placeholder={t("enterPostcode")}
                    {...formikFormCz.getFieldProps("kode_pos_merchant")}
                    className={validationFormCz("kode_pos_merchant")}
                    required
                  />
                  {formikFormCz.touched.kode_pos_merchant && formikFormCz.errors.kode_pos_merchant ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.kode_pos_merchant}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>{t("merchantBusinessType")}</Form.Label>
              <Form.Control
                name="tipe_usaha_merchant"
                placeholder={t("enterMerchantBusinessType")}
                {...formikFormCz.getFieldProps("tipe_usaha_merchant")}
                className={validationFormCz("tipe_usaha_merchant")}
                required
              />
              {formikFormCz.touched.tipe_usaha_merchant && formikFormCz.errors.tipe_usaha_merchant ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.tipe_usaha_merchant}
                  </div>
                </div>
              ) : null}
              <small><em>({t("pt/individual/cooperative/firm/cv/foundation")})</em></small>
            </Form.Group>
            {/* <Form.Group>
              <Form.Label>status_usaha</Form.Label>
              <Form.Control
                name="status_usaha"
                placeholder="Enter place and date of birth"
                {...formikFormCz.getFieldProps("status_usaha")}
                className={validationFormCz("status_usaha")}
                required
              />
              {formikFormCz.touched.status_usaha && formikFormCz.errors.status_usaha ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.status_usaha}
                  </div>
                </div>
              ) : null}
            </Form.Group> */}
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("merchantPhoneNumber")} *</Form.Label>
                  <Form.Control
                    name="nomor_telp_merchant"
                    placeholder={t("enterMerchantPhoneNumber")}
                    {...formikFormCz.getFieldProps("nomor_telp_merchant")}
                    className={validationFormCz("nomor_telp_merchant")}
                    required
                  />
                  {formikFormCz.touched.nomor_telp_merchant && formikFormCz.errors.nomor_telp_merchant ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.nomor_telp_merchant}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("merchantEmailAddress")}</Form.Label>
                  <Form.Control
                    name="alamat_email_merchant"
                    placeholder={t("enterMerchantEmailAddress")}
                    {...formikFormCz.getFieldProps("alamat_email_merchant")}
                    className={validationFormCz("alamat_email_merchant")}
                    required
                  />
                  {formikFormCz.touched.alamat_email_merchant && formikFormCz.errors.alamat_email_merchant ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.alamat_email_merchant}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("form/FieldOfBusiness")} *</Form.Label>
                  <Form.Control
                    name="bentuk_bidang_usaha"
                    placeholder={t("enterForm/FieldOfBusiness")}
                    {...formikFormCz.getFieldProps("bentuk_bidang_usaha")}
                    className={validationFormCz("bentuk_bidang_usaha")}
                    required
                  />
                  {formikFormCz.touched.bentuk_bidang_usaha && formikFormCz.errors.bentuk_bidang_usaha ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.bentuk_bidang_usaha}
                      </div>
                    </div>
                  ) : null}
                  <small><em>({t("mandatoryPhotoOfBusinessLocation,NameSign/Merchant/MerchantResidence")})   ({t("mandatoryPhotosOfProductsSoldByMerchants")})</em></small>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("productDescriptionForSale")} *</Form.Label>
                  <Form.Control
                    name="deskripsi_produk"
                    placeholder={t("enterProductDescriptionForSale")}
                    {...formikFormCz.getFieldProps("deskripsi_produk")}
                    className={validationFormCz("deskripsi_produk")}
                    required
                  />
                  {formikFormCz.touched.deskripsi_produk && formikFormCz.errors.deskripsi_produk ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.deskripsi_produk}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex flex-column justify-content-center align-items-center mt-4">
              <div>
                <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("dataBank")}</strong>
              </div>
              <div>
                <small><em>({t("mustAttachAPhotoOfTheCoverOfTheSavingsBook")})</em></small>
              </div>
            </div>
            
            <Row className="mt-3">
              <Col>
                <Form.Group>
                  <Form.Label>{t("bankName")} *</Form.Label>
                  <Form.Control
                    name="nama_bank"
                    placeholder={t("enterBankName")}
                    {...formikFormCz.getFieldProps("nama_bank")}
                    className={validationFormCz("nama_bank")}
                    required
                  />
                  {formikFormCz.touched.nama_bank && formikFormCz.errors.nama_bank ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.nama_bank}
                      </div>
                    </div>
                  ) : null}
                  <small>({t("accordingToTheRegisteredMerchant/CompanyOwner")}</small>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("bankAccountNumber")} *</Form.Label>
                  <Form.Control
                    name="nomor_rekening"
                    placeholder={t("enterBankAccountNumber")}
                    {...formikFormCz.getFieldProps("nomor_rekening")}
                    className={validationFormCz("nomor_rekening")}
                    required
                  />
                  {formikFormCz.touched.nomor_rekening && formikFormCz.errors.nomor_rekening ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikFormCz.errors.nomor_rekening}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>{t("nameOfOwnerMerchantAccount")} *</Form.Label>
              <Form.Control
                name="nama_pemilik_rekening"
                placeholder={t("enterNameOfOwnerMerchantAccount")}
                {...formikFormCz.getFieldProps("nama_pemilik_rekening")}
                className={validationFormCz("nama_pemilik_rekening")}
                required
              />
              {formikFormCz.touched.nama_pemilik_rekening && formikFormCz.errors.nama_pemilik_rekening ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikFormCz.errors.nama_pemilik_rekening}
                  </div>
                </div>
              ) : null}
              <small><em>({t("accordingToTheRegisteredMerchant/CompanyOwner")}</em></small>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <div className="btn btn-primary" onClick={handleSubmit}>
                {t("export")} PDF
              </div>
            </div>
          </Col>
        </Row>
      </Paper>
    </div>
  );
}

export default PaymentModule;
