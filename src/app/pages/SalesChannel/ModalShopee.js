import React, {useState} from "react";
import { Modal, Button, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import styles from "./saleschannelpage.module.css";
import axios from 'axios'

const ModalShopee = ({ show, close, platform, t, handleSave,handleAccountName }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  console.log("modal shopee", show)
  return (
    <div>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {t('addAccount')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <small className="text-muted">*{t('clickHereToAuthorizationWithShopee')}</small>
          <div className="btn btn-primary btn-block mt-2">
            {t('authorizationShopee')}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalShopee;
