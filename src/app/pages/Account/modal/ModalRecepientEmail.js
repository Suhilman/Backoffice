import React from 'react';
import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";
import axios from 'axios'
import './style.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalRecepientEmail = ({
  t,
  cancelModal,
  stateModal,
  title,
  loading
}) => {
  toast.configure()
  const [businessEmail, setBusinessEmail] = React.useState([])
  const [addEmail, setAddEmail] = React.useState("")

  const API_URL = process.env.REACT_APP_API_URL;

  const getBusinessEmail = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/business-email`)
      setBusinessEmail(data.data)
      // console.log("getBusinessEmail", data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const toastSuccess = () => {
    return toast.success('Add Email Recepient Success', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const toastInfo = () => {
    return toast.info('Something went wrong', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const handleAddBusinessEmail = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/business-email`, {email: addEmail})
      toastSuccess()
      getBusinessEmail()
      setAddEmail(" ")
      // console.log("addEmail", addEmail)
    } catch (error) {
      setAddEmail("")
      console.log(error)
      toastInfo()
    }
  }

  const handleDeleteBusinessEmail = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/business-email/${id}`)
      toastSuccess()
      getBusinessEmail()
    } catch (error) {
      console.log(error)
      console.log(error)
      toastInfo()
    }
  }

  React.useEffect(() => {
    getBusinessEmail()
  },[])

  return (
    <Modal show={stateModal} onHide={cancelModal} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form >
        <Modal.Body>
          <div className="wrapper-form-add-recepient-email">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Group className="width-form-group">
                <Form.Label>{t("addRecepientEmail")}:</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  placeholder={t("addNewEmail")}
                  required
                  onChange={(e) => {
                    setAddEmail(e.target.value)
                  }}
                />
              </Form.Group>
              <div className="btn btn-primary btn-email-recepient" onClick={handleAddBusinessEmail}>{t("save")}</div>
            </div>
          </div>
          {businessEmail.map(value => 
            <div className="list-business-email-modal-recepient">
              <div className="business-email-recepient">
                {value.email}
              </div>
              <div className="badge badge-danger" onClick={() => handleDeleteBusinessEmail(value.id)}>{t("delete")}</div>
            </div>
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={cancelModal}>
            {t("cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              `${t("saveChanges")}`
            )}
          </Button>
        </Modal.Footer> */}
      </Form>
    </Modal>
  );
}

export default ModalRecepientEmail;
