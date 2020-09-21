import React, { Fragment } from "react";
import { connect } from "react-redux";
import NavBarAllyship from "../components/NavBarAllyship";
import { Row, Col } from "react-bootstrap";
import WaitingRoomContentBetween from "../components/WaitingRoomContentBetween";
import WaitingRoomContentPre from "../components/WaitingRoomContentPre";
import { putParticipantAttributes } from "../utils/post";
import { getTeam } from "../utils/fetch";


const mapStateToProps = state => {
  const { participantId, waitingRoomType, relativeShuffleNum } = state.game;
  return { participantId, waitingRoomType, relativeShuffleNum };
}

const WaitingRoom = (props) => {

  // setting whether the participant showed up for the study and is active (passed comphrenshion checks)
  putParticipantAttributes(props.participantId, { is_still_active: true });

  // getting the team info for a particular shuffle
  getTeam(props.participantId, props.relativeShuffleNum);

  const waitingRoom = props.waitingRoomType === "pre" ? <WaitingRoomContentPre /> : <WaitingRoomContentBetween />;
  return (
    <Fragment>
      <NavBarAllyship />
      <Row
        noGutters
        className="align-items-center debug-1"
        style={{ minHeight: "500px" }}
      >
        <Col className="text-center">
          {waitingRoom}
        </Col>
      </Row>
    </Fragment>
  );
};

export default connect(mapStateToProps)(WaitingRoom);
