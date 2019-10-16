import React, { Component, Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  fetchNutritionData,
  logFoodToDatabase
} from "../redux/actions/foodActions";
import { EDAMAM_MEASURE_URI_PREFIX } from "../constants/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";

const mapStateToProps = state => {
  const { activeFood, activeNutritionData } = state.food;
  const { userId } = state.user;
  return { activeFood, activeNutritionData, userId };
};

class FoodResultDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,
      measureLabel: this.props.activeFood.measures[0].label
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.round = this.round.bind(this);
    this.handleLog = this.handleLog.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleBack() {
    this.props.setView(VIEWS.FOOD_INPUT);
  }

  handleNutritionUpdate(e, props) {
    e.preventDefault();
    if (this.state.measureLabel !== "") {
      const foodId = this.props.activeFood.food.foodId;
      const measureURI =
        EDAMAM_MEASURE_URI_PREFIX + this.state.measureLabel.toLowerCase();
      const quantity = parseFloat(this.state.quantity);
      this.props.fetchNutritionData(foodId, measureURI, quantity);
    }
  }

  handleLog(props) {
    const userId = this.props.userId;
    const nutritionData = this.props.activeNutritionData;
    this.props.logFoodToDatabase(userId, nutritionData);
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }

  render() {
    const leftArrowIcon = <FontAwesomeIcon icon={faArrowLeft} />;
    const activeFood = this.props.activeFood;
    const label = activeFood.food.label;
    const nutrition = this.props.activeNutritionData;
    const calories = nutrition.calories;

    const carbs =
      "CHOCDF" in nutrition.totalNutrients
        ? nutrition.totalNutrients.CHOCDF.quantity
        : 0;
    const fat =
      "FAT" in nutrition.totalNutrients
        ? nutrition.totalNutrients.FAT.quantity
        : 0;
    const protein =
      "PROCNT" in nutrition.totalNutrients
        ? nutrition.totalNutrients.PROCNT.quantity
        : 0;

    return (
      <Fragment>
        <Button
          variant="outline-success"
          size="sm"
          className="mt-3"
          onClick={this.handleBack}
        >
          {leftArrowIcon} results
        </Button>
        <h1>{label}</h1>
        <Form onSubmit={(e, props) => this.handleNutritionUpdate(e, props)}>
          <Form.Group controlId="selectServingSize">
            <Form.Label>Serving Size</Form.Label>
            <Form.Control
              as="select"
              name="measureLabel"
              value={this.state.measureLabel}
              onChange={this.handleInputChange}
            >
              {activeFood.measures
                .filter(measure => "label" in measure)
                .map((measure, i) => {
                  return <option key={i}>{measure.label}</option>;
                })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="inputNumServings">
            <Form.Label>Number of Servings</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              step="0.5"
              value={this.state.quantity}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Button type="submit" block variant="success">
            update
          </Button>
        </Form>
        <p>calories: {calories}</p>
        <p>carbs: {this.round(carbs) + " g"}</p>
        <p>fat: {this.round(fat) + " g"}</p>
        <p>protein: {this.round(protein) + " g"}</p>
        <Button
          block
          variant="success"
          onClick={props => this.handleLog(props)}
        >
          log
        </Button>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  { fetchNutritionData, logFoodToDatabase, setView }
)(FoodResultDetail);
