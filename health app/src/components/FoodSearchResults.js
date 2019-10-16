import React, { Fragment } from "react";
import { connect } from "react-redux";
import FoodResult from "./FoodResult";

const mapStateToProps = state => {
  const { searchResults } = state.food;
  return { searchResults };
};

const FoodSearchResults = props => {
  return (
    <Fragment>
      <h3>search results</h3>
      {props.searchResults.map((result, index) => (
        <FoodResult key={index} searchResultIndex={index} />
      ))}
    </Fragment>
  );
};

export default connect(mapStateToProps)(FoodSearchResults);
