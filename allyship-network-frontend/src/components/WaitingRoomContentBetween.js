import React, { Fragment } from "react";
import { connect } from "react-redux";
import { MdTimer } from "react-icons/md";
import { Button } from "react-bootstrap";
import WaitingRoomStatus from "./WaitingRoomStatus";
import { toggleWaitingRoomStatus } from "../redux/actions";

const mapStateToProps = (state) => {
  const { waitingRoomStatus } = state.participant;
  return { waitingRoomStatus };
};

const WaitingRoomContentBetween = (props) => {
  return (
    <Fragment>
      <MdTimer size="5em" />
      <p>
        Next game starting in{" "}
        <span className="text-primary font-weight-bold">02:49</span>
      </p>
      <p className="mt-5">
        You must confirm your presence to be eligible for the next game.
        <br />
        Let us know that you're still here by clicking this button:
      </p>
      <Button
        disabled={props.waitingRoomStatus}
        className="mt-3 mb-2"
        onClick={() => props.toggleWaitingRoomStatus()}
      >
        I'm still here!
      </Button>
      <WaitingRoomStatus />
    </Fragment>
  );
};

export default connect(mapStateToProps, { toggleWaitingRoomStatus })(
  WaitingRoomContentBetween
);
