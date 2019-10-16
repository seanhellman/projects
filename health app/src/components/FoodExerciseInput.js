import React, { Fragment } from "react";
import { connect } from "react-redux";
import { setView } from "../redux/actions/viewActions";
import CalNav from "./CalNav";
import ExerciseSummary from "./ExerciseSummary";
import FoodSummary from "./FoodSummary";

const FoodExerciseInput = props => {
  return (
    <div className="fade-in food-exercise-view">
      <CalNav />
      <FoodSummary />
      <ExerciseSummary />
    </div>
  );
};

export default connect(
  null,
  { setView }
)(FoodExerciseInput);
