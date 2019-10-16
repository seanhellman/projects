import React from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { updateChatroom } from "../redux/actions/chatRoomActions";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";

const handleClick = props => {
  props.updateChatroom(props.chatroomName);
  props.setView(VIEWS.CHAT_ROOM);
};

const ChatOption = props => {
  return (
    <div
      className="chat-option fade-in"
      onClick={() => handleClick(props)}
    >
      <Container>
        <Row>
          <Col>
            <b>{props.userName}</b>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default connect(
  null,
  { updateChatroom, setView }
)(ChatOption);
