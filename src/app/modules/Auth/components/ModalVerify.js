import React from "react";
import { Modal, Button } from "react-bootstrap";
import IconEdit from '../../../../images/icons8-edit-50.png'
import './style.css'

const ModalVerify = ({
  showVerifyModal,
  alertModal,
  phonenumber,
  handleVerifyModal,
  code,
  checkCode,
  handleSendWhatsapp,
  changePhoneNumber,
  // loading,
  second,
  handleResendCode,
  verification_code,
  statusWhatsapp,
  messageNotSent
}) => {
  const [showVerifyCode, setShowVerifyCode] = React.useState(false)
  const [editPhoneNumber, setEditPhoneNumber] = React.useState(false)

  const openVerifyCode = () => setShowVerifyCode(true)

  const hanldeHide = () => {
    console.log("Handle Hide")
  }

  const editStateTempPhoneNumber = () => {
    setEditPhoneNumber(!editPhoneNumber)
  }

  const submitChangePhoneNumber = () => {
    handleSendWhatsapp(phonenumber, verification_code)
    setEditPhoneNumber(!editPhoneNumber)
  }

  const handleChangePhoneNumber = (phone) => {
    changePhoneNumber(phone)
  }

  return (
    <Modal show={showVerifyModal} onHide={hanldeHide}>
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
          <div className="d-flex align-items-center">
            <div className="mr-2">
              {editPhoneNumber ? (
                <input 
                  type="text" 
                  defaultValue={phonenumber}
                  onChange={(e) => handleChangePhoneNumber(e.target.value)}
                />
              ) : phonenumber }
            </div>
            <div className="d-flex">
              {!editPhoneNumber ? (
                <div className=" text-primary edit mr-2" onClick={editStateTempPhoneNumber}>edit</div>
              ) : (
                <div className="text-primary submit" onClick={submitChangePhoneNumber}>submit</div>
              ) }
            </div>
            {/* <div className="submit">Submit</div> */}
            {/* <img src={IconEdit} alt="Edit"/> */}
          </div>
        </p>
        {statusWhatsapp ? (
          <div>
            <div>
              Please check whatsapp for verify code
            </div>
            {messageNotSent ? (
              <div className="mb-3">
                <div className="text-muted">
                  didn't receive the message? <span className="text-primary" style={{cursor: "pointer"}} onClick={openVerifyCode}>show here</span> 
                </div>
                <div>
                  {showVerifyCode ? verification_code : ""}
                </div>
              </div>
            ) : null }
          </div>
        )
        : (<p>Verif Code: {verification_code || ""}</p>) }
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
            onClick={() => handleResendCode(phonenumber, verification_code)}
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
          {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalVerify;
