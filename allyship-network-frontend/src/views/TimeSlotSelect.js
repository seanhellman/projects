import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import TimeSlotGroup from "../components/TimeSlotGroup";
import { setTimeSlot, setParticipantInfo } from "../redux/actions";
import { putParticipantAttributes } from "../utils/post";
import { GENDERS } from "../constants";

const mapStateToProps = (state) => {
  const { participantId, timeSlot } = state.participant;
  return { participantId, timeSlot };
};

const TimeSlotSelect = (props) => {

  const dispatch = useDispatch();

  const handleSelect = (timeSlotSelected) => {
    console.log(timeSlotSelected)
    props.setTimeSlot(timeSlotSelected.timeslot_desc);
    setTimeSlotSelected(false);
    setOptionSelected(null);
    putParticipantAttributes(props.participantId, {
      time_slot_id: timeSlotSelected.id,
    }).then((data) => console.log(data));
  };

  useEffect(() => {
    if (window.location.hash === "#update") {
      const params = new URLSearchParams(window.location.search);
      const participantId = parseInt(params.get("participantId"));
      const name = params.get("name");
      const age = parseInt(params.get("age"));
      const genderIndex = parseInt(params.get("gender"));
      const timezone = params.get("timezone");
      const avatar = parseInt(params.get("avatar"));
      putParticipantAttributes(participantId, {
        display_name: name,
        age: age,
        gender: GENDERS[genderIndex],
        region_id: timezone,
        avatar_id: avatar,
        complete_pre_survey: true,
      }).then((data) => {
        dispatch(setParticipantInfo(data));
        props.history.push("/participant-dashboard/select-a-time-slot");
      })
    }
  });

  const [timeSlotSelected, setTimeSlotSelected] = useState(false);
  const [optionSelected, setOptionSelected] = useState(null);

  return (
    <div className="border-black p-5">
      <h2>Select a Time Slot</h2>
      <p className="mb-3">
        If a time slot does not reach minimum enrollment, it may be cancelled.
        Time slots with more participants will be more likely to run.
      </p>
      <TimeSlotGroup
        setTimeSlotSelected={setTimeSlotSelected}
        setOptionSelected={setOptionSelected}
        optionSelected={optionSelected}
      />
      <Button
        className="mt-3"
        disabled={!timeSlotSelected}
        onClick={() => handleSelect(timeSlotSelected)}
      >
        Confirm
      </Button>
    </div>
  );
};

export default connect(mapStateToProps, { setTimeSlot })(TimeSlotSelect);
