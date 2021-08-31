import React, {useEffect, useState} from 'react';
import PaymentModulePersonal from './PaymentModulePersonal.js'
import PaymentModulePT from './PaymentModulePT.js'
import {
  Paper
} from "@material-ui/core";

const CashlezTab = ({
  t,
  formikFormCz,
  validationFormCz,
  ownerName,
  handleResultSignature,
  showSignaturePad,
  closeSignaturePad,
  handleSubmit,
  handlePreviewLocation,
  handlePreviewSignpost,
  handlePreviewProduct,
  handlePreviewNpwp,
  handlePreviewKtp,
  handleOwnerName,
  openSignaturePad,
  business,
  imageLocation,
  previewLocation,
  imageSignpost,
  previewSignpost,
  imageProduct,
  previewProduct,
  imageNpwp,
  previewNpwp,
  imageKtp,
  previewKtp,
  baseSignature,
  handlePreviewNpwpPt,
  handlePreviewSiup,
  imageNpwpPt,
  previewNpwpPt,
  imageSiup,
  previewSiup
}) => {
  const [showModalPersonal, setShowModalPersonal] = useState(false)
  const [showModalPT, setShowModalPT] = useState(false)

  const openModalPersonal = () => {
    setShowModalPersonal(!showModalPersonal)
    setShowModalPT(false)
  }
  const closeModalPersonal = () => setShowModalPersonal(false)

  const openModalPT = () =>  {
    setShowModalPT(!showModalPT)
    setShowModalPersonal(false)
  }
  const closeModalPT = () => setShowModalPT(false)

  useEffect(() => {
    formikFormCz.setFieldValue("payment_gateway_name", "cashlez")
  }, [])

  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <div className="headerPage mb-5">
          <div className="headerStart">
            <h3>{t("statusRegistration")}</h3>
          </div>
        </div>
        <div className="btn btn-primary" onClick={openModalPersonal}>
          {t('registerPersonal')}
        </div>
        <div className="btn btn-primary ml-3" onClick={openModalPT}>
          {t('registerPT')}
        </div>
        <PaymentModulePersonal 
          stateModal={showModalPersonal}
          closeModal={closeModalPersonal}
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
          title={t('paymentPersonal')}
        />

        <PaymentModulePT 
          stateModal={showModalPT}
          closeModal={closeModalPT}
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
          title={t('paymentPT')}
          handlePreviewNpwpPt={handlePreviewNpwpPt}
          handlePreviewSiup={handlePreviewSiup}
          imageNpwpPt={imageNpwpPt}
          previewNpwpPt={previewNpwpPt}
          imageSiup={imageSiup}
          previewSiup={previewSiup}
        />
      </Paper>
    </div>
  );
}

export default CashlezTab;
