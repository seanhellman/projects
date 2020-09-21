import React from "react";
import { connect } from "react-redux";
import { Row, Col, Popover, OverlayTrigger, Button } from "react-bootstrap";
import { formatAsCurrency } from "../utils/funcs";
import { RULES_TEXT } from "../constants";
import { IoIosInformationCircleOutline } from "react-icons/io"

const mapStateToProps = (state) => {
  const { totalRegularBonus, totalClicks } = state.participant;
  return { totalRegularBonus, totalClicks };
};

const style = {
  position: "relative",
  top: "-1px",
  left: "3px",
};

const PlayerStats = (props) => {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Game Rules</Popover.Title>
      <Popover.Content>{RULES_TEXT}</Popover.Content>
    </Popover>
  );

  return (
    <Row noGutters className="mb-4">
      <Col>
        <h6>MY STATS</h6>
        <p>Times volunteered: {props.totalClicks}</p>
        <p>Total bonuses: ${formatAsCurrency(props.totalRegularBonus)}</p>
        <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
          <Button variant="link" className="p-0 m-0">rules<IoIosInformationCircleOutline style={style} /></Button>
        </OverlayTrigger>
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps)(PlayerStats);
