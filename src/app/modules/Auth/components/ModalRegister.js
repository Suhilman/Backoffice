import React from "react";
import { Modal, Form, Alert, Spinner, Button } from "react-bootstrap";

const ModalRegister = ({
  showBusinessModal,
  closeBusinessModal,
  alertModal,
  loading,
  handleBusiness,
  handleProvince,
  handleCity,
  handleLocation,
  handleOutletLocation,
  allBusinessCategories,
  allProvinces,
  allCities,
  allLocations,
  updateBusiness
}) => {
  return (
    <Modal show={showBusinessModal} onHide={closeBusinessModal}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome to BeetPOS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertModal ? <Alert variant="danger">{alertModal}</Alert> : ""}

        <Form style={{ padding: "1rem" }}>
          <Form.Group>
            <Form.Label>Select Business Category</Form.Label>
            <Form.Control
              as="select"
              defaultValue={"Default"}
              onChange={handleBusiness}
            >
              <option value="Default" disabled hidden>
                Choose Business Category...
              </option>

              {allBusinessCategories.map(item => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Province</Form.Label>
            <Form.Control
              as="select"
              defaultValue={"Default"}
              onChange={handleProvince}
            >
              <option value="Default" disabled hidden>
                Choose Province...
              </option>

              {allProvinces.map(item => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Select City</Form.Label>
            <Form.Control
              as="select"
              defaultValue={"Default"}
              onChange={handleCity}
            >
              <option value="Default" disabled hidden>
                Choose City...
              </option>

              {allCities.map(item => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Location</Form.Label>
            <Form.Control
              as="select"
              defaultValue={"Default"}
              onChange={handleLocation}
            >
              <option value="Default" disabled hidden>
                Choose Location...
              </option>

              {allLocations.map(item => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Outlet Location</Form.Label>
            <Form.Control
              as="select"
              defaultValue={"Default"}
              onChange={handleOutletLocation}
            >
              <option value="Default" disabled hidden>
                Choose Outlet Location...
              </option>

              {allLocations.map(item => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="px-9 py-4 mx-2"
          variant="primary"
          onClick={updateBusiness}
        >
          Next
          {loading && <Spinner animation="border" variant="light" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegister;
