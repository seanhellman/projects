import React, { Fragment } from "react";
import { connect } from "react-redux";
import { MdEmail } from "react-icons/md";
import { Button } from "react-bootstrap";
import { formatAsCurrency } from "../utils/funcs";

const mapStateToProps = (state) => {
  const {
    userId,
    displayName,
    gender,
    age,
    timeZone,
    totalClicks,
    totalRegularBonus,
    preSurveyBonus,
  } = state.participant;
  return {
    userId,
    displayName,
    gender,
    age,
    timeZone,
    totalClicks,
    totalRegularBonus,
    preSurveyBonus,
  };
};

const AccountParticipant = (props) => {

  const preSurveyBonus = formatAsCurrency(props.preSurveyBonus);
  const regularBonus = formatAsCurrency(props.totalRegularBonus);
  const totalBonus = formatAsCurrency(
    props.preSurveyBonus + props.totalRegularBonus
  );
  return (
    <Fragment>
      <h2>Account</h2>
      <p>
        <strong>Username:</strong> {props.userId.username}
      </p>
      <p>
        <strong>Display name:</strong> {props.displayName}
      </p>
      <p>
        <strong>Gender:</strong> {props.gender}
      </p>
      <p>
        <strong>Age:</strong> {props.age}
      </p>
      <p>
        <strong>Time zone:</strong> {props.timeZone}
      </p>
      <Button variant="primary">Change password</Button>
      <h2 className="mt-4">Stats and Earnings</h2>
      <p>
        <strong>Times volunteered:</strong> {props.totalClicks}
      </p>
      <p className="mt-2" style={{ textDecoration: "underline" }}>
        Bonuses Earned
      </p>
      <p>
        <strong>Pre-survey bonus:</strong> ${preSurveyBonus}
      </p>
      <p>
        <strong>Participant bonus:</strong> ${regularBonus}
      </p>
      <p>
        <strong>Total bonus:</strong> ${totalBonus}
      </p>
      <div className="mt-2">
        <a href="mailto:someone@example.com">
          <MdEmail size="1.25em" /> Email study admin
        </a>
      </div>
    </Fragment>
  );
};

export default connect(mapStateToProps)(AccountParticipant);
