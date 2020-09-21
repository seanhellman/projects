import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  initClient,
  getChannel,
  joinChannel,
  leaveChannel,
} from "../redux/actions";
import { Button } from "react-bootstrap";

const mapStateToProps = (state) => {
  const { chatClient, activeChannel } = state.participant;
  return { chatClient, activeChannel };
};

const ChatTest = (props) => {

  const initClient = () => {
    if (!props.chatClient) {
      props.initClient("sean");
      console.log("client initiated")
    } else {
      console.log("client already initiated.")
    }
  }

  const getGeneralChannel = () => {
    props.getChannel(props.chatClient, "general");
  }

  const joinGeneralChannel = () => {
    props.joinChannel(props.activeChannel);
  }

  return (
    <Fragment>
      <p>user = "sean"</p>
      <Button block onClick={() => initClient()}>
        Init client
      </Button>
      <Button block onClick={() => getGeneralChannel()} disabled={props.activeChannel !== null}>
        Get general channel
      </Button>
      <Button block onClick={() => joinGeneralChannel()} disabled={props.activeChannel === null}>
        Join general channel
      </Button>
      <Button block onClick={() => props.leaveChannel(props.activeChannel)}>
        Leave general channel
      </Button>
    </Fragment>
  );
};

export default connect(mapStateToProps, {
  initClient,
  getChannel,
  joinChannel,
  leaveChannel,
})(ChatTest);
