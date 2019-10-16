import React from "react";
import { connect } from "react-redux";
import { setView } from "../redux/actions/viewActions";
import { Button, Tooltip } from "reactstrap";

const NavigationBtn = props => (
  <span>
    <Button
      outline
      color="link"
      style={{ color: "#ffffff" }}
      value={props.view}
      onClick={props.handleClick}
      id={props.id}
    >
      {props.icon}
    </Button>
    <Tooltip
      placement={"top"}
      isOpen={props.tooltipOpen}
      target={props.id}
      toggle={props.toggle}
    >
      {props.tooltipInfo}
    </Tooltip>
  </span>
);

export default connect(
  null,
  { setView }
)(NavigationBtn);
