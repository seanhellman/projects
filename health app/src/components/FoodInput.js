import React, { Component, Fragment } from "react";
import { Form, FormGroup, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { fetchFood, clearFoodSearchResults } from "../redux/actions/foodActions";
import FoodSearchResults from "./FoodSearchResults";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";

class FoodInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      food: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleBack() {
    this.props.setView(VIEWS.FOOD_EXERCISE_INPUT);
    this.props.clearFoodSearchResults();
  }

  handleSearch(e) {
    e.preventDefault();
    if (this.state.food !== "") {
      this.props.fetchFood(this.state.food);
    }
  }

  render() {
    const leftArrowIcon = <FontAwesomeIcon icon={faArrowLeft} />;
    const searchIcon = <FontAwesomeIcon icon={faSearch} />;
    return (
      <Fragment>
        <Button
          variant="outline-success"
          size="sm"
          className="mt-3"
          onClick={this.handleBack}
        >
          {leftArrowIcon} today
        </Button>
        <Form className="mt-3" onSubmit={e => this.handleSearch(e)}>
          <FormGroup>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  {searchIcon}
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="input"
                name="food"
                id="searchForAFood"
                placeholder="search for a food"
                aria-label="search for a food"
                value={this.state.food}
                onChange={this.handleInputChange}
              />
            </InputGroup>
          </FormGroup>
          <Button type="submit" block variant="success" className="mb-3">
            search
          </Button>
        </Form>
        <FoodSearchResults />
      </Fragment>
    );
  }
}

export default connect(
  null,
  { fetchFood, clearFoodSearchResults, setView }
)(FoodInput);
