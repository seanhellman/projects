import React from "react";
import { connect } from "react-redux";
import MdCloseCircle from "react-ionicons/lib/MdCloseCircle";
import MdCheckmarkCircle from "react-ionicons/lib/MdCheckmarkCircle";

const mapStateToProps = (state) => {
  const { waitingRoomStatus } = state.participant;
  return { waitingRoomStatus };
};

const WaitingRoomStatus = (props) => {
  const icon = props.waitingRoomStatus ? (
    <MdCheckmarkCircle className="mr-1" />
  ) : (
    <MdCloseCircle className="mr-1" />
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
      <p>not confirmed</p>
    </div>
  );
};

export default connect(mapStateToProps)(WaitingRoomStatus);
