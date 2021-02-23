import React from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col, Form, Alert, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { OutlinedInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { CalendarToday } from "@material-ui/icons";
import Select from "react-select";

import "../../style.css";

const useStyles = makeStyles({
  input: {
    padding: "1rem"
  }
});

const FormTemplate = ({
  formikPromo,
  validationPromo,
  allOutlets,
  weekdays,
  photo,
  photoPreview,
  alertPhoto,
  startDate,
  endDate,
  startHour,
  endHour,
  handlePreviewPhoto,
  handlePromoStartDate,
  handlePromoEndDate,
  handlePromoDays,
  handlePromoHour,
  handleSelectOutlet,
  mode
}) => {
  const classes = useStyles();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const CustomInputDate = ({ value, onClick }) => {
    return (
      <Form.Control
        type="text"
        defaultValue={value}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      />
    );
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  return (
    <>
      <Row className="lineBottom" style={{ padding: "2rem" }}>
        <Col>
          <Row style={{ marginBottom: "1rem" }}>
            <h5>Promo Time</h5>
          </Row>

          <Row>
            <Col sm={4}>
              <Form.Group>
                <Form.Label>Promo Date - Start:</Form.Label>
                <InputGroup>
                  <DatePicker
                    name="promo_date_start"
                    selected={startDate}
                    onChange={handlePromoStartDate}
                    customInput={<CustomInputDate />}
                    required
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                {formikPromo.touched.promo_date_start &&
                formikPromo.errors.promo_date_start ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_date_start}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>Promo Date - End:</Form.Label>
                <InputGroup>
                  <DatePicker
                    name="promo_date_end"
                    selected={endDate}
                    onChange={handlePromoEndDate}
                    customInput={<CustomInputDate />}
                    required
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                {formikPromo.touched.promo_date_end &&
                formikPromo.errors.promo_date_end ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_date_end}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label>Promo Days:</Form.Label>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="monday"
                      label="Monday"
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.monday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="tuesday"
                      label="Tuesday"
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.tuesday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="wednesday"
                      label="Wednesday"
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.wednesday.checked}
                      onChange={handlePromoDays}
                    />
                  </Col>

                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="thursday"
                      label="Thursday"
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.thursday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="friday"
                      label="Friday"
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.friday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="saturday"
                      label="Saturday"
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.saturday.checked}
                      onChange={handlePromoDays}
                    />
                  </Col>

                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="sunday"
                      label="Sunday"
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.sunday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="everyday"
                      label="Everyday"
                      checked={weekdays.everyday.checked}
                      onChange={handlePromoDays}
                    />
                  </Col>
                </Row>
                {formikPromo.touched.promo_days &&
                formikPromo.errors.promo_days ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_days}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>Promo Hour - Start:</Form.Label>
                <div>
                  <OutlinedInput
                    type="time"
                    name="promo_hour_start"
                    value={startHour}
                    fullWidth
                    variant="outlined"
                    classes={{ input: classes.input }}
                    onChange={handlePromoHour}
                  />
                </div>
                {formikPromo.touched.promo_hour_start &&
                formikPromo.errors.promo_hour_start ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_hour_start}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>Promo Hour - End</Form.Label>
                <div>
                  <OutlinedInput
                    type="time"
                    name="promo_hour_end"
                    value={endHour}
                    fullWidth
                    variant="outlined"
                    classes={{ input: classes.input }}
                    onChange={handlePromoHour}
                  />
                </div>
                {formikPromo.touched.promo_hour_end &&
                formikPromo.errors.promo_hour_end ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_hour_end}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ padding: "2rem" }}>
        <Col>
          <Row style={{ marginBottom: "1rem" }}>
            <h5>Promo Location & Banner</h5>
          </Row>

          <Row>
            <Col sm={4}>
              {mode === "edit" ? (
                <Form.Group>
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_id"
                    {...formikPromo.getFieldProps("outlet_id")}
                    className={validationPromo("outlet_id")}
                    required
                  >
                    <option value="" disabled hidden>
                      Choose an Outlet
                    </option>
                    {allOutlets.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
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
              ) : (
                <Form.Group>
                  <Form.Label>Location:</Form.Label>
                  <Select
                    options={optionsOutlet}
                    isMulti
                    name="outlet_id"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(value) => handleSelectOutlet(value, formikPromo)}
                  />
                  {formikPromo.touched.outlet_id &&
                  formikPromo.errors.outlet_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikPromo.errors.outlet_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              )}
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>Promo Banner:</Form.Label>
                {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}
                <div
                  {...getRootProps({
                    className: "boxDashed dropzone"
                  })}
                >
                  <input {...getInputProps()} />
                  {!photoPreview ? (
                    <>
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                      <p style={{ color: "gray" }}>File Size Limit: 2 MB</p>
                    </>
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
                        {photo?.name
                          ? `${photo.name} - ${photo.size} bytes`
                          : ""}
                      </small>
                    </>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>Description Type:</Form.Label>
                <Form.Control
                  as="select"
                  name="description_type"
                  {...formikPromo.getFieldProps("description_type")}
                  className={validationPromo("description_type")}
                  required
                >
                  <option value="regulation">Regulation</option>
                  <option value="how_to_use">How to Use</option>
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
                <Form.Label>Description:</Form.Label>
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
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default FormTemplate;
