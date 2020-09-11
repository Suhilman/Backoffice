import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalVerify = ({
  showVerifyModal,
  closeVerifyModal,
  alertModal,
  phonenumber,
  handleVerifyModal,
  code,
  checkCode,
  loading,
  second,
  handleResendCode,
  verification_code
}) => {
  return (
    <Modal show={showVerifyModal} onHide={closeVerifyModal}>
      <Modal.Header closeButton>
        <Modal.Title>Account Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertModal ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{alertModal}</div>
          </div>
        ) : (
          ""
        )}
        <p>
          Enter Verification Code We're Just Send to:
          <br />
          {phonenumber}
        </p>
        <p>Verif Code: {verification_code || ""}</p>
        <div className="row">
          <input
            type="text"
            className="form-control"
            onChange={handleVerifyModal}
            value={code}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {second ? (
          <Button className="px-9 py-4" variant="secondary" disabled>
            Resend Code ({second})
          </Button>
        ) : (
          <Button
            className="px-9 py-4"
            variant="secondary"
            onClick={handleResendCode}
          >
            Resend Code
          </Button>
        )}
        <Button
          className="px-9 py-4 mx-2"
          variant="primary"
          onClick={checkCode}
        >
          Verify
          {loading && <span className="ml-3 spinner spinner-white"></span>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalVerify;
