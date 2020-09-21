import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, ProgressBar } from "react-bootstrap";
import { SIGNED_UP, AT_CAPACITY } from "../constants";

const mapStateToProps = (state) => {
  const { timeSlot: currentTimeSlot } = state.participant;
  return { currentTimeSlot };
}

const TimeSlotItem = (props) => {

  const handleSelect = (event) => {
    props.setTimeSlotSelected(props.timeSlot);
    props.setOptionSelected(event.target.value);
  }
  
  const selected = props.timeSlot === props.currentTimeSlot ? SIGNED_UP : (props.relativeCapacity === 100 ? AT_CAPACITY : "");
  const disabled = selected === SIGNED_UP || selected === AT_CAPACITY;
  return (
    <Row noGutters className="align-items-center mb-3">
      <Col xs={5}>
        <Form.Check
          type="radio"
          name="time-slots"
          label={props.label}
          value={props.option}
          onChange={handleSelect}
          disabled={disabled}
          checked={props.optionSelected === props.option}
        />
      </Col>
      <Col xs={4}>
        <ProgressBar now={props.relativeCapacity} label={`${props.relativeCapacity}%`} />
      </Col>
      <Col>
        <p className="ml-3 font-weight-lighter font-italic">{selected}</p>
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps)(TimeSlotItem);
