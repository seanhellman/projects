import React from "react";
import { connect } from "react-redux";
import { formatAsCurrency } from "../utils/funcs";

const mapStateToProps = (state) => {
  const {
    basePayment,
    preSurveyBonus,
    totalRegularBonus,
    totalSeedBonus,
  } = state.participant;
  return {
    earnings: [basePayment, preSurveyBonus, totalRegularBonus, totalSeedBonus],
  };
};

const Earnings = (props) => {
  const earnings = formatAsCurrency(
    props.earnings.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    )
  );
  return <>{earnings}</>;
};

export default connect(mapStateToProps)(Earnings);
