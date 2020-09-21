import React from "react";
import { connect } from "react-redux";
import { Card } from "react-bootstrap";

const mapStateToProps = (state) => {
  const { active } = state.moderator;
  return { active };
};

const ModeratorActiveGroup = (props) => {
  return (
    <Card className="text-center">
      <Card.Header>Status</Card.Header>
      <Card.Body>Currently Watching: {props.active}</Card.Body>
    </Card>
  );
};

export default connect(mapStateToProps)(ModeratorActiveGroup);
