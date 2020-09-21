import React, { useState, useEffect } from "react";
import { formatAsLocalDateTime } from "../utils/funcs";
import TimeSlotItem from "./TimeSlotItem";
import { Form, Alert } from "react-bootstrap";
import { getAllTimeSlots } from "../utils/fetch";
import { useSelector } from "react-redux";
import { TOKEN_REMOVE_DEPLOY } from "../constants";

const TimeSlotGroup = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState(null);
  let token = useSelector(state=>state.auth.token);
  if (!token) {
    token = TOKEN_REMOVE_DEPLOY;
  }

  useEffect(() => {
    if (!data) {
      getAllTimeSlots(token).then((data) => {
        if (!data) {
          setShowAlert(true);
        } else {
          return setData(data);
        }
      });
    }
  }, [token, data]);

  const getAlert = (
    showAlert &&
    <Alert variant="danger" className="alert-font">
      The username and password doesn't match or exist.
    </Alert>
  );

  const timeSlotItems = data && data.map((timeSlot, index) => {
    const label = formatAsLocalDateTime(timeSlot.timeslot_desc);
    const relativeCapacity =
      (timeSlot.current_capacity /
      timeSlot.max_capacity) *
      100;
    return (
      <TimeSlotItem
        key={`time-slot-${timeSlot.timeslot_desc}`}
        option={`option-${index}`}
        label={label}
        setTimeSlotSelected={props.setTimeSlotSelected}
        setOptionSelected={props.setOptionSelected}
        optionSelected={props.optionSelected}
        relativeCapacity={relativeCapacity}
        timeSlot={timeSlot}
      />
    );
  });

  return (
    <>
      {getAlert}
      <Form>
        {Object.prototype.toString.call(timeSlotItems) === "[object Promise]" ? "" : timeSlotItems}
      </Form>
    </>
  );
};

export default TimeSlotGroup;