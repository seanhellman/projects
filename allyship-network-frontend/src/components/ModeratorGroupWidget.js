import React from "react";
import { connect } from "react-redux";
import { Card, Col, Button } from "react-bootstrap";
import { BrightnessHigh } from "react-bootstrap-icons";

const mapStateToProps = (state) => {
  const { active } = state.moderator;
  return { active };
};

const ModeratorGroupWidget = (props) => {
  return (
    <Col sm={4}>
      <Card
        className="mb-1"
        bg={props.groupName === props.active ? "info" : "light"}
      >
        <Card.Header
          className={
            "text-center " + (props.groupName === props.active ? "text-light" : "text-dark")
          }
        >
          {props.groupName === props.active ? (
            <BrightnessHigh className="font-size-2 margin-right-1" />
          ) : (
            ""
          )}
          {props.groupName}
        </Card.Header>
        <Card.Body>
          <Col>
            <Button
              variant={props.groupName === props.active ? "light" : "secondary"}
              block
            >
              Remove Participant
            </Button>
          </Col>
          <br />
          <Col>
            <Button
              variant={props.groupName === props.active ? "light" : "secondary"}
              block
            >
              Invalidate Group
            </Button>
          </Col>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default connect(mapStateToProps)(ModeratorGroupWidget);
