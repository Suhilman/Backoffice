import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "react-bootstrap";

import PaymentModulePersonal from "./Cashlez/PaymentModulePersonal";
import PaymentModulePT from "./Cashlez/PaymentModulePT";
import StatusRegistration from "./StatusRegistration";
import CashlezTab from "./Cashlez/CashlezTab";

import {
  Row,
  Col,
  Form
} from "react-bootstrap";

import {
  Paper
} from "@material-ui/core";
import dayjs from 'dayjs'

import { saveAs } from 'file-saver'
import fileDownload from 'js-file-download'

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'

export const PaymentModulPage = () => {
  const [tabs, setTabs] = React.useState("status");
  const API_URL = process.env.REACT_APP_API_URL;
  const user_info = JSON.parse(localStorage.getItem('user_info'))

  const { t } = useTranslation();
  console.log("modal form cashlez")
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [baseSignature, setBaseSignature] = useState("")
  const [ownerName, setOwnerName] = useState("")

  const [previewKtp, setPreviewKtp] = React.useState("");
  const [imageKtp, setImageKtp] = React.useState("")
  const [previewNpwp, setPreviewNpwp] = React.useState("");
  const [imageNpwp, setImageNpwp] = React.useState("")
  const [previewProduct, setPreviewProduct] = React.useState("");
  const [imageProduct, setImageProduct] = React.useState("")
  const [previewSignpost, setPreviewSignpost] = React.useState("");
  const [imageSignpost, setImageSignpost] = React.useState("")
  const [previewLocation, setPreviewLocation] = React.useState("");
  const [imageLocation, setImageLocation] = React.useState("")

  const [business, setBusiness] = React.useState([])

  const openSignaturePad = () => setShowSignaturePad(true)
  const closeSignaturePad = () => setShowSignaturePad(false)
  const handleResultSignature = (data) => {
    setBaseSignature(data)
    console.log("setBaseSignature", data)
  }

  const handleOwnerName = (value) => {
    console.log("handleOwnerName", value)
    setOwnerName(value)
  }

  const handlePreviewKtp = async (e) => {
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
            setPreviewKtp(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      const formData = new FormData();
      formData.append("ktp_picture", img);
      await axios.patch(`${API_URL}/api/v1/business/update-photo/${user_info.business_id}`,formData);
      setImageKtp(img)
    } else {
      preview = "";
    }
  };

  const handlePreviewNpwp = async (e) => {
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setPreviewNpwp(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      const formData = new FormData();
      formData.append("npwp_picture", img);
      await axios.patch(`${API_URL}/api/v1/business/update-photo/${user_info.business_id}`,formData);
      setImageNpwp(img)
    } else {
      preview = "";
    }
  };

  const handlePreviewProduct = async (e) => {
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setPreviewProduct(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      const formData = new FormData();
      formData.append("product_photo", img);
      await axios.post(`${API_URL}/api/v1/business-form-data/first-photo`, formData)
      setImageProduct(img)
    } else {
      preview = "";
    }
  };
  
  const handlePreviewSignpost = async (e) => {
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setPreviewSignpost(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      const formData = new FormData();
      formData.append("business_signpost_photo", img);
      await axios.post(`${API_URL}/api/v1/business-form-data/first-photo`, formData)
      setImageSignpost(img)
    } else {
      preview = "";
    }
  };

  const handlePreviewLocation = async (e) => {
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setPreviewLocation(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      const formData = new FormData();
      formData.append("business_location_photo", img);
      await axios.post(`${API_URL}/api/v1/business-form-data/first-photo`, formData)
      setImageLocation(img)
    } else {
      preview = "";
    }
  };
  
  const InitialFormCz = {
    register_type_cz: "",
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
      const dataSendPdf = {
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

      const dataSendSave = {
        status: "sudah diajukan di backoffice",
        tracking_process: 1,
        payment_gateway_name: "",
        register_type_cz: values.register_type_cz,
        owner_name: values.nama_pemilik,
        place_and_date_of_birth: values.tempat_tanggal_lahir,
        merchant_owner_address: values.alamat_pemilik_merchant,
        city: values.kota,
        province: values.provinsi,
        postal_code: values.kode_pos,
        merchant_mobile_number: values.nomor_hp_merchant,
        merchant_owner_email_address: values.alamat_email_pemilik_merchant,
        ktp_paspor_kitas: values.ktp,
        kk_npwp: values.kk,
        merchant_name: values.nama_merchant,
        merchant_business_address: values.alamat_usaha_merchant,
        merchant_city: values.kota_merchant,
        merchant_province: values.provinsi_merchant,
        merchant_postal_code: values.kode_pos_merchant,
        merchant_business_type: values.tipe_usaha_merchant,
        business_status: values.status_usaha,
        merchant_phone_number: values.nomor_telp_merchant,
        merchant_email_address: values.alamat_email_merchant,
        form_of_business: values.bentuk_bidang_usaha,
        product_description: values.deskripsi_produk,
        bank_name: values.nama_bank,
        account_number: values.nomor_rekening,
        account_owner_name: values.nama_pemilik_rekening,
      }
      if(baseSignature) dataSendPdf.signature = baseSignature
      console.log("data form cz", dataSendPdf)
      try {
        await axios.post(`${API_URL}/api/v1/business-form-data`, dataSendSave)
        const date = new Date()
        const formatDate = dayjs(date).format('DD-MM-YYYY')
        const fileName = `FORMULIR APLIKASI MERCHANT - ${formatDate}.pdf`
        const {data} = await axios.post(`${API_URL}/api/v1/modify-pdf`, dataSendPdf, {
          responseType: "blob"
        });
        const blob = new Blob([data], { type: 'application/pdf' })
        console.log("blob pdf", blob)
        saveAs(blob, fileName)
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

  const getBusinessInfo = async () => {
    const user_info = JSON.parse(localStorage.getItem("user_info"));

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/business/${user_info.business_id}`
      );

      console.log("data.data", data.data)

      setBusiness({
        name: data.data.name,
        province_name: data.data.Location.City.Province.name,
        city_name: data.data.Location.City.name,
        business_location: data.data.Location.name,
        business_type: data.data.Business_Type.name,
        business_address: data.data.address || "",
        business_phone_number: data.data.phone_number,
        name_on_ktp: data.data.name_on_ktp,
        ktp_number: data.data.ktp_owner || "",
        npwp_number: data.data.npwp_business || "",
        payment_method: "",
        sales_type: "",
        business_type_id: data.data.business_type_id,
        province_id: data.data.Location.City.Province.id,
        city_id: data.data.Location.City.id,
        location_id: data.data.location_id,
        currency_id: data.data.currency_id,
      });

      setImageKtp(
        `${data.data.ktp_picture ? `${API_URL}/${data.data.ktp_picture}` : ""}`
      );

      setImageNpwp(
        `${
          data.data.npwp_picture ? `${API_URL}/${data.data.npwp_picture}` : ""
        }`
      );

      formikFormCz.setFieldValue("ktp", data.data.ktp_owner || "")
      formikFormCz.setFieldValue("kk", data.data.npwp_business || "")
      formikFormCz.setFieldValue("nama_merchant", data.data.name || "")
      formikFormCz.setFieldValue("kota_merchant", data.data.Location.City.name || "")
      formikFormCz.setFieldValue("provinsi_merchant", data.data.Location.City.Province.name || "")
      formikFormCz.setFieldValue("nomor_telp_merchant", data.data.phone_number || "")

      setBusiness(data.data)
    } catch (err) {
      console.log(err);
    }
  };

  const handleKtp = () => formikFormCz.setFieldValue("ktp", business.ktp_owner || "")
  const handleKK = () => formikFormCz.setFieldValue("kk", business.npwp_business || "")
  const handleNamaMerchant = () => formikFormCz.setFieldValue("nama_merchant", business.name || "")
  const handleKotaMerchant = () => formikFormCz.setFieldValue("kota_merchant", business.Location.City.name || "")
  const handleProvinsiMerchant = () => formikFormCz.setFieldValue("provinsi_merchant", business.Location.City.Province.name || "")
  const handleNomorTelpMerchant = () => formikFormCz.setFieldValue("nomor_telp_merchant", business.phone_number || "")
  

  const getBusinessFormData = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/business-form-data/my-id`)

      if(data.data.ktp_paspor_kitas) {
        formikFormCz.setFieldValue("ktp", data.data.ktp_paspor_kitas || "")
      } else {
        handleKtp()
      }
      if(data.data.kk_npwp) {
        formikFormCz.setFieldValue("kk", data.data.kk_npwp || "")
      } else {
        handleKK()
      }
      if(data.data.merchant_name) {
        formikFormCz.setFieldValue("nama_merchant", data.data.merchant_name || "")
      } else {
        handleNamaMerchant()
      }
      if(data.data.merchant_city) {
        formikFormCz.setFieldValue("kota_merchant", data.data.merchant_city || "")
      } else {
        handleKotaMerchant()
      }
      if(data.data.merchant_province) {
        formikFormCz.setFieldValue("provinsi_merchant", data.data.merchant_province || "")
      } else {
        handleProvinsiMerchant()
      }
      if(data.data.merchant_mobile_number) {
        formikFormCz.setFieldValue("nomor_telp_merchant", data.data.merchant_mobile_number || "")
      } else {
        handleNomorTelpMerchant()
      }
      formikFormCz.setFieldValue("nama_pemilik", data.data.owner_name || "")
      formikFormCz.setFieldValue("tempat_tanggal_lahir", data.data.place_and_date_of_birth || "")
      formikFormCz.setFieldValue("alamat_pemilik_merchant", data.data.merchant_owner_address || "")
      formikFormCz.setFieldValue("kota", data.data.city || "")
      formikFormCz.setFieldValue("provinsi", data.data.province || "")
      formikFormCz.setFieldValue("kode_pos", data.data.postal_code || "")
      formikFormCz.setFieldValue("nomor_hp_merchant", data.data.merchant_mobile_number || "")
      formikFormCz.setFieldValue("alamat_email_pemilik_merchant", data.data.merchant_owner_email_address || "")
      formikFormCz.setFieldValue("alamat_usaha_merchant", data.data.merchant_business_address || "")
      formikFormCz.setFieldValue("kode_pos_merchant", data.data.merchant_postal_code || "")
      formikFormCz.setFieldValue("tipe_usaha_merchant", data.data.merchant_business_type || "")
      formikFormCz.setFieldValue("status_usaha", data.data.business_status || "")
      formikFormCz.setFieldValue("alamat_email_merchant", data.data.merchant_email_address || "")
      formikFormCz.setFieldValue("bentuk_bidang_usaha", data.data.form_of_business || "")
      formikFormCz.setFieldValue("deskripsi_produk", data.data.product_description || "")
      formikFormCz.setFieldValue("nama_bank", data.data.bank_name || "")
      formikFormCz.setFieldValue("nomor_rekening", data.data.account_number || "")
      formikFormCz.setFieldValue("nama_pemilik_rekening", data.data.account_owner_name || "")
      
      setImageProduct(
        `${data.data.product_photo ? `${API_URL}/${data.data.product_photo}` : ""}`
      );

      setImageLocation(
        `${
          data.data.business_location_photo ? `${API_URL}/${data.data.business_location_photo}` : ""
        }`
      );

      setImageSignpost(
        `${
          data.data.business_signpost_photo ? `${API_URL}/${data.data.business_signpost_photo}` : ""
        }`
      );

    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getBusinessInfo();
    getBusinessFormData();
  }, []);

  return (
    <>
      <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
        <Tab eventKey="status" title={t("statusRegistration")}>
          <StatusRegistration 
            t={t}
          />
        </Tab>

        <Tab eventKey="cashlez" title={t("cashlez")}>
          <CashlezTab 
            t={t}
            formikFormCz={formikFormCz}
            validationFormCz={validationFormCz}
            ownerName={ownerName}
            handleResultSignature={handleResultSignature}
            showSignaturePad={showSignaturePad}
            closeSignaturePad={closeSignaturePad}
            handleSubmit={handleSubmit}
            handlePreviewLocation={handlePreviewLocation}
            handlePreviewSignpost={handlePreviewSignpost}
            handlePreviewProduct={handlePreviewProduct}
            handlePreviewNpwp={handlePreviewNpwp}
            handlePreviewKtp={handlePreviewKtp}
            handleOwnerName={handleOwnerName}
            handleResultSignature={handleResultSignature}
            openSignaturePad={openSignaturePad}
            business={business}
            imageLocation={imageLocation}
            previewLocation={previewLocation}
            imageSignpost={imageSignpost}
            previewSignpost={previewSignpost}
            imageProduct={imageProduct}
            previewProduct={previewProduct}
            imageNpwp={imageNpwp}
            previewNpwp={previewNpwp}
            imageKtp={imageKtp}
            previewKtp={previewKtp}
            ownerName={ownerName}
            baseSignature={baseSignature}
            showSignaturePad={showSignaturePad}
          />
        </Tab>

        {/* <Tab eventKey="payment" title={t("individualRegistration")}>
          <PaymentModulePersonal
            t={t}
            formikFormCz={formikFormCz}
            validationFormCz={validationFormCz}
            ownerName={ownerName}
            handleResultSignature={handleResultSignature}
            showSignaturePad={showSignaturePad}
            closeSignaturePad={closeSignaturePad}
            handleSubmit={handleSubmit}
            handlePreviewLocation={handlePreviewLocation}
            handlePreviewSignpost={handlePreviewSignpost}
            handlePreviewProduct={handlePreviewProduct}
            handlePreviewNpwp={handlePreviewNpwp}
            handlePreviewKtp={handlePreviewKtp}
            handleOwnerName={handleOwnerName}
            handleResultSignature={handleResultSignature}
            openSignaturePad={openSignaturePad}
            business={business}
            imageLocation={imageLocation}
            previewLocation={previewLocation}
            imageSignpost={imageSignpost}
            previewSignpost={previewSignpost}
            imageProduct={imageProduct}
            previewProduct={previewProduct}
            imageNpwp={imageNpwp}
            previewNpwp={previewNpwp}
            imageKtp={imageKtp}
            previewKtp={previewKtp}
            ownerName={ownerName}
            baseSignature={baseSignature}
            showSignaturePad={showSignaturePad}
          />
        </Tab>

        <Tab eventKey="payment2" title={t("PTRegistration")}>
          <PaymentModulePT
            t={t}
            formikFormCz={formikFormCz}
            validationFormCz={validationFormCz}
            ownerName={ownerName}
            handleResultSignature={handleResultSignature}
            showSignaturePad={showSignaturePad}
            closeSignaturePad={closeSignaturePad}
            handleSubmit={handleSubmit}
            handlePreviewLocation={handlePreviewLocation}
            handlePreviewSignpost={handlePreviewSignpost}
            handlePreviewProduct={handlePreviewProduct}
            handlePreviewNpwp={handlePreviewNpwp}
            handlePreviewKtp={handlePreviewKtp}
            handleOwnerName={handleOwnerName}
            handleResultSignature={handleResultSignature}
            openSignaturePad={openSignaturePad}
            business={business}
            imageLocation={imageLocation}
            previewLocation={previewLocation}
            imageSignpost={imageSignpost}
            previewSignpost={previewSignpost}
            imageProduct={imageProduct}
            previewProduct={previewProduct}
            imageNpwp={imageNpwp}
            previewNpwp={previewNpwp}
            imageKtp={imageKtp}
            previewKtp={previewKtp}
            ownerName={ownerName}
            baseSignature={baseSignature}
            showSignaturePad={showSignaturePad}
          />
        </Tab> */}
      </Tabs>
    </>
  );
};
