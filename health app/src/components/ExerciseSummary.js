import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";

const mapStateToProps = state => {
  const { loggedToday } = state.exercise;
  return { loggedToday }
}

const ExerciseSummary = props => {
  return (
    <div className="bg-light p-3 mb-3">
      <h2 className="pb-1 border-bottom">exercise</h2>
      {Object.keys(props.loggedToday).map((key, i) => {
        return (
          <Row key={i}>
          <Col xs="10">
            <p>
              <b>{key}</b>
            </p>
          </Col>
          <Col xs="2">
            <p>{props.loggedToday[key]}</p>
          </Col>
        </Row>
        )
        })}
      <Button variant="success" onClick={() => props.setView(VIEWS.EXERCISE_INPUT)}>
        add exercise
      </Button>
    </div>
  );
};

export default connect(mapStateToProps, { setView })(ExerciseSummary);
