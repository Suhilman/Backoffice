import React from "react";
import { Button, Modal } from "react-bootstrap";
import { DateRangePicker } from "react-date-range";

const CustomDateRange = ({
  show,
  handleClose,
  handleSave,
  startRange,
  endRange,
  handleStartRange
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <DateRangePicker
        ranges={[
          {
            startDate: startRange,
            endDate: endRange,
            key: "selection"
          }
        ]}
        onChange={handleStartRange}
      />
      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleClose} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomDateRange;
