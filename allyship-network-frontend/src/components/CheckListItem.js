import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { TASKS, PRE_WINDOW } from "../constants";
import { isWithinPreWindow } from "../utils/funcs";

const style = {border: "1px solid #d4d4d4", background: "#e0e0e0"};

const COMPLETE_EXPERIMENT = "completeExperiment";

const mapStateToProps = (state) => {
  const {
    completePreSurvey,
    completeConsentForm,
    completePostSurvey,
    completeExperiment,
    timeSlot,
  } = state.participant;
  return {
    completePreSurvey,
    completeConsentForm,
    completePostSurvey,
    completeExperiment,
    timeSlot,
  };
};

const CheckListItem = (props) => {
  // is the previous task complete? (this is important since completion of
  // tasks must go in order)
  let prevTaskComplete = true;
  if (props.taskIndex > 0) {
    prevTaskComplete = props[TASKS[props.taskIndex - 1].var];
  }

  // is the current task complete? (this helps us decide which icon to show)
  const taskComplete = props[props.taskObj.var];

  const icon = taskComplete ? (
    <FaCheckCircle color="green" size="2em" />
  ) : (
    <FaTimesCircle color="red" size="2em" />
  );

  // should we enable a link to complete the task? there is an extra check for
  // completeExperiment (the previous tasks need to be complete AND the current
  // time needs to be within the pre-window)
  let showLink = prevTaskComplete;
  if (props.taskObj.var === COMPLETE_EXPERIMENT) {
    showLink = prevTaskComplete && isWithinPreWindow(props.timeSlot, PRE_WINDOW); 
  }

  return (
    <Row noGutters className="p-2 mb-2" style={style}>
      <Col sm={3}>{icon}</Col>
      <Col>
        {showLink ? (
          <Link to={`/participant-dashboard/${props.taskObj.path}`}>
            {props.taskObj.text}
          </Link>
        ) : (
          <p>{props.taskObj.text}</p>
        )}
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps)(CheckListItem);
