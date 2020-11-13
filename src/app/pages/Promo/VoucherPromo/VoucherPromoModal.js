import React from "react";

import {
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  Alert,
  InputGroup
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { CalendarToday } from "@material-ui/icons";
import DatePicker from "react-datepicker";

import "../../style.css";

const VoucherPromoModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikPromo,
  validationPromo,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto,
  allOutlets,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikPromo.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Outlet:</Form.Label>
                <Form.Control
                  as="select"
                  name="outlet_id"
                  {...formikPromo.getFieldProps("outlet_id")}
                  className={validationPromo("outlet_id")}
                  required
                >
                  <option value="" disabled hidden>
                    Choose Outlet
                  </option>
                  {allOutlets.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Control>
                {formikPromo.touched.outlet_id &&
                formikPromo.errors.outlet_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.outlet_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Promo Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Promo Name"
                  {...formikPromo.getFieldProps("name")}
                  className={validationPromo("name")}
                  required
                />
                {formikPromo.touched.name && formikPromo.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Promo Code:</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  placeholder="Enter Promo Code"
                  {...formikPromo.getFieldProps("code")}
                  className={validationPromo("code")}
                  required
                />
                {formikPromo.touched.code && formikPromo.errors.code ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.code}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Promo Quota:</Form.Label>
                <Form.Control
                  type="number"
                  name="quota"
                  placeholder="Enter Promo Quota"
                  {...formikPromo.getFieldProps("quota")}
                  className={validationPromo("quota")}
                  required
                />
                {formikPromo.touched.quota && formikPromo.errors.quota ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.quota}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Promo Start Date:</Form.Label>

                <InputGroup>
                  <DateTimePicker
                    startDate={startDate}
                    setStartDate={setStartDate}
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Promo End Date:</Form.Label>

                <InputGroup>
                  <DateTimePicker
                    startDate={endDate}
                    setStartDate={setEndDate}
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Promo Description Type:</Form.Label>
            <Form.Control
              as="select"
              name="description_type"
              value={""}
              {...formikPromo.getFieldProps("description_type")}
              className={validationPromo("description_type")}
              required
            >
              <option value="" disabled hidden>
                Choose Type
              </option>
              <option value="regulation">Regulation</option>
              <option value="how_to_use">How To Use</option>
            </Form.Control>
            {formikPromo.touched.description_type &&
            formikPromo.errors.description_type ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikPromo.errors.description_type}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Promo Description:</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              {...formikPromo.getFieldProps("description")}
              className={validationPromo("description")}
            />
            {formikPromo.touched.description &&
            formikPromo.errors.description ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikPromo.errors.description}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Promo Rate Type:</Form.Label>
            <Form.Control
              as="select"
              name="type"
              {...formikPromo.getFieldProps("type")}
              className={validationPromo("type")}
              required
            >
              <option value="" disabled hidden>
                Choose Type
              </option>
              <option value="percentage">Percentage</option>
              <option value="currency">Rupiah</option>
            </Form.Control>
            {formikPromo.touched.type && formikPromo.errors.type ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formikPromo.errors.type}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column md={2}>
              Promo Rate:
            </Form.Label>
            <Col>
              <Form.Control
                type="number"
                name="value"
                {...formikPromo.getFieldProps("value")}
                className={validationPromo("value")}
                required
              />
              {formikPromo.touched.value && formikPromo.errors.value ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikPromo.errors.value}
                  </div>
                </div>
              ) : null}
            </Col>
          </Form.Group>

          <Form.Group>
            <Form.Label>Promo Banner</Form.Label>
            {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}
            <div
              {...getRootProps({
                className: "boxDashed dropzone"
              })}
            >
              <input {...getInputProps()} />
              {!photoPreview ? (
                <p>Drag 'n' drop some files here, or click to select files</p>
              ) : (
                <>
                  <div
                    style={{
                      margin: "auto",
                      width: "120px",
                      height: "120px",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${photoPreview || photo})`
                    }}
                  />
                  <small>
                    {photo?.name ? `${photo.name} - ${photo.size} bytes` : ""}
                  </small>
                </>
              )}
            </div>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModal}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const DateTimePicker = ({ startDate, setStartDate }) => {
  const CustomInput = ({ value, onClick }) => {
    return <Form.Control type="text" defaultValue={value} onClick={onClick} />;
  };
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      dateFormat="dd/MM/yyyy HH:mm"
      showTimeInput
      timeInputLabel="Time:"
      customInput={<CustomInput />}
    />
  );
};

export default VoucherPromoModal;
