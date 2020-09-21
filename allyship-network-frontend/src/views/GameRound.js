import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import NavBarAllyship from "../components/NavBarAllyship";
import PlayerStats from "../components/PlayerStats";
import GameCanvas from "../components/GameCanvas";
import PlayerTable from "../components/PlayerTable";

const mapStateToProps = (state) => {
  const { relativeRoundNum } = state.game;
  return { relativeRoundNum };
};

const GameRound = (props) => {
  return (
    <Fragment>
      <NavBarAllyship />
      <Row className="pl-3 pr-3">
        <Col sm={8}>
          <h2 className="border-bottom mb-4">Round {props.relativeRoundNum}</h2>
          <PlayerStats />
          <GameCanvas />
          <Row noGutters>
            <PlayerTable />
          </Row>
        </Col>
        {/* CHAT */}
        <Col sm={4} className="debug-2"></Col>
      </Row>
    </Fragment>
  );
};

export default connect(mapStateToProps)(GameRound);
