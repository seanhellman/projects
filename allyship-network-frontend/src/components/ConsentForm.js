import React from "react";
import { connect } from "react-redux";
import { QUALTRICS_CONSENT_SURVEY } from "../constants";

const style = { minHeight: "700px" };

const mapStateToProps = state => {
  const { participantId } = state.participant;
  return { participantId };
}

const ConsentForm = (props) => {
  return (
    <div className="iframe-container" style={style}>
      <iframe
        title="consent form"
        src={QUALTRICS_CONSENT_SURVEY + `?PID=${props.participantId}`}
      ></iframe>
    </div>
  );
};

export default connect(mapStateToProps)(ConsentForm);
