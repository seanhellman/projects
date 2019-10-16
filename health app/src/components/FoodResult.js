import React from "react";
import { connect } from "react-redux";
import { renderFoodResultDetail } from "../redux/actions/foodActions";

const mapStateToProps = state => {
  const { searchResults } = state.food;
  return { searchResults };
};

const handleClick = props => {
  const index = props.searchResultIndex;
  const food = props.searchResults[index];
  props.renderFoodResultDetail(food);
};

const FoodResult = props => {
  const index = props.searchResultIndex;
  const food = props.searchResults[index].food.label.toLowerCase();
  const brand =
    "brand" in props.searchResults[index].food
      ? props.searchResults[index].food.brand.toLowerCase()
      : "generic";

  return (
    <div onClick={() => handleClick(props)}>
      <p>
        <b>{food}</b>
        <br />
        {brand}
      </p>
    </div>
  );
};

export default connect(
  mapStateToProps,
  { renderFoodResultDetail }
)(FoodResult);
