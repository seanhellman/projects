import React, { Component, Fragment } from "react";
import { Form, FormGroup, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { logExercise } from "../redux/actions/exerciseActions";

const mapStateToProps = state => {
  const { userId } = state.user;
  return { userId };
};

class ExerciseInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercise: "",
      minutes: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleLogExercise(e) {
    e.preventDefault();
    const userId = this.props.userId;
    const key = this.state.exercise;
    const val = parseInt(this.state.minutes);
    this.props.logExercise(userId, key, val);
  }

  render() {
    return (
      <Fragment>
        <Form
          className="mt-3 p-3 bg-light"
          onSubmit={e => this.handleLogExercise(e)}
        >
          <h1 className="mb-3">add exercise</h1>
          <FormGroup controlId="addExercise">
            <Form.Label>exercise:</Form.Label>
            <Form.Control
              type="input"
              name="exercise"
              placeholder="example: yoga"
              aria-label="add an exercise"
              value={this.state.exercise}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup controlId="specifyExerciseMinutes">
            <Form.Label>minutes:</Form.Label>
            <Form.Control
              type="number"
              step="1"
              name="minutes"
              placeholder="example: 60"
              aria-label="number of minutes"
              value={this.state.minutes}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <Button type="submit" block variant="success">
            log exercise
          </Button>
        </Form>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  { logExercise }
)(ExerciseInput);
