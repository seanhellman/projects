import React, { Fragment } from "react";
import { connect } from "react-redux";
import { toggleWaitingRoomStatus } from "../redux/actions";

const mapStateToProps = (state) => {
  const { waitingRoomStatus } = state.participant;
  return { waitingRoomStatus };
};

const WaitingRoomContentPre = (props) => {
  return (
    <Fragment>
      <h2>Waiting room before game starts</h2>
      <p>placeholder content</p>
    </Fragment>
  );
};

export default connect(mapStateToProps, { toggleWaitingRoomStatus })(
  WaitingRoomContentPre
);
