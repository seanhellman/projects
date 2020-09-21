import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Col, Row } from "react-bootstrap";
import ModeratorGroupWidget from "../components/ModeratorGroupWidget";
import ModeratorActiveGroup from "../components/ModeratorActiveGroup";
import NavBarAllyship from "../components/NavBarAllyship";
export const URL_PATH = process.env.PUBLIC_URL;
export const IMAGE_PATH = process.env.PUBLIC_URL + "/img/";

const mapStateToProps = (state) => {
  const { assigned, active } = state.moderator;
  return { assigned, active };
};

const Moderate = (props) => {
  return (
    <Fragment>
      <NavBarAllyship />
      <Row noGutters>
        <Col sm={8}>
          <ModeratorActiveGroup />
          <Row>
            {props.assigned.map((element, index) => (
              <ModeratorGroupWidget
                key={"moderator-widget-" + element}
                groupName={element}
              />
            ))}
          </Row>
        </Col>
        {/* CHAT */}
        <Col sm={4} className="debug-2"></Col>
      </Row>
    </Fragment>
  );
};

export default connect(mapStateToProps)(Moderate);
