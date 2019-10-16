import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap"
import { connect } from "react-redux";
import ChatOption from "./ChatOption";
import firebase from "../data/fbConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";

const mapStateToProps = state => {
  const userFullName = state.user.firstName + " " + state.user.lastName;
  const chatrooms = state.user.chatrooms;
  return { userFullName, chatrooms };
};

class ChatRooms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatroomUsers: []
    };

    this.getUsers = this.getUsers.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.chatrooms.map(chatroom => {
      this.getUsers(chatroom);
    });
  }

  getUsers(chatroom) {
    const database = firebase.firestore();
    database
      .collection("chatrooms")
      .doc(chatroom)
      .get()
      .then(doc => {
        if (doc.exists) {
          let users = doc.data().users;
          if (users[0] !== this.props.userFullName) {
            this.setState({
              chatroomUsers: [...this.state.chatroomUsers, users[0]]
            });
          } else {
            this.setState({
              chatroomUsers: [...this.state.chatroomUsers, users[1]]
            });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleClick() {
    this.props.setView(VIEWS.NEW_MESSAGE);
  }

  render() {
    const newMsgIcon = <FontAwesomeIcon icon={faEdit} />;
    return (
        <div className="msg-ated all of our product icons to be uniform in style, color, and size. We went through various iterations and the community was helpful in providing feedback through every step of the process.

        Note: This does not cover our use of Octiconlist fade-in">
          <Row>
            <Col xs="9" s="10">
            <h3>Chats</h3>
            </Col>
            <Col>
              <Button outline onClick={this.handleClick}>{newMsgIcon}</Button>
            </Col>
          </Row>
          
          {this.props.chatrooms.map((chatroom, index) => (
            <ChatOption
              chatroomName={chatroom}
              userName={this.state.chatroomUsers[index]}
              key={index}
            />
          ))}
        </div>
    );
  }
}

export default connect(mapStateToProps, { setView })(ChatRooms);
