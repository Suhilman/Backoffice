import React, {useEffect, useState} from 'react';
import PaymentModulePersonal from './PaymentModulePersonal.js'
import PaymentModulePT from './PaymentModulePT.js'

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
  baseSignature
}) => {
  const [showModalPersonal, setShowModalPersonal] = useState(false)
  const [showModalPT, setShowModalPT] = useState(false)

  const openModalPersonal = () => setShowModalPersonal(true)
  const closeModalPersonal = () => setShowModalPersonal(false)

  const openModalPT = () => setShowModalPT(true)
  const closeModalPT = () => setShowModalPT(false)


  return (
    <div>
      <div className="btn btn-primary" onClick={openModalPersonal}>
        {t('registerPersonal')}
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
      />
    </div>
  );
}

export default CashlezTab;
