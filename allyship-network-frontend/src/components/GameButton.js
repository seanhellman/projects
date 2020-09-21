import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { putButtonClicked } from "../utils/post";

const mapStateToProps = (state) => {
  const { participantId, killStatus } = state.participant;
  const { relativeRoundNum, buttonDisabled } = state.game;
  return { participantId, killStatus, relativeRoundNum, buttonDisabled };
};

const handleClick = (props) => {
  // FIXME: replace 2 with actual team id
  putButtonClicked(props.participantId, 2, props.relativeRoundNum, props.killStatus);
};

const GameButton = (props) => {
  return (
    <Button
      variant="volunteer"
      className="mb-4"
      style={{ padding: "15px 25px" }}
      disabled={props.buttonDisabled}
      onClick={() => handleClick(props)}
    >
      <span className="">Click to Volunteer</span>
    </Button>
  );
};

export default connect(mapStateToProps)(GameButton);
