import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";

const mapStateToProps = state => {
  const { loggedToday } = state.food;
  return { loggedToday };
};

const FoodSummary = props => {
  return (
    <div className="bg-light p-3 mb-3">
      <h2 className="pb-1 border-bottom">food</h2>
      {props.loggedToday.map((el, i) => {
        const entry = el.ingredients[0].parsed[0];
        return (
          <Row key={i}>
            <Col xs="10">
              <p>
                <b>{entry.food.toLowerCase()}</b>{" "}
                <span className="serving">
                  ({entry.measure}, {entry.quantity})
                </span>
              </p>
            </Col>
            <Col xs="2">
              <p>{el.calories}</p>
            </Col>
          </Row>
        );
      })}
      <Button variant="success" onClick={() => props.setView(VIEWS.FOOD_INPUT)}>
        add food
      </Button>
    </div>
  );
};

export default connect(
  mapStateToProps,
  { setView }
)(FoodSummary);
