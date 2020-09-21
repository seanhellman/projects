import React from "react";
import { connect } from "react-redux";
import { Alert, Row, Col, Button } from "react-bootstrap";
import { formatAsLocalDateTime, isWithinPreWindow } from "../utils/funcs";
import { PRE_WINDOW, NOT_SIGNED_UP_TEXT, TIME_SLOT_JOIN_TEXT } from "../constants";

const mapStateToProps = (state) => {
  const { timeSlot } = state.participant;
  return { timeSlot };
};

const TimeSlotAlert = (props) => {
  const withinPreWindow = isWithinPreWindow(props.timeSlot, PRE_WINDOW);
  const variant = withinPreWindow ? "primary" : "secondary";
  const timeSlot =
    props.timeSlot === null
      ? NOT_SIGNED_UP_TEXT
      : formatAsLocalDateTime(props.timeSlot.timeslot_desc);
  return (
    <Alert variant={variant}>
      <Row noGutters className="align-items-center">
        <Col xs={10}>
          <strong>Time slot:</strong> {timeSlot}
          <br />
          <em>{TIME_SLOT_JOIN_TEXT}</em>
        </Col>
        <Col xs={2} className="text-right">
          <Button disabled={!withinPreWindow} variant={variant}>
            Start
          </Button>
        </Col>
      </Row>
    </Alert>
  );
};

export default connect(mapStateToProps)(TimeSlotAlert);
