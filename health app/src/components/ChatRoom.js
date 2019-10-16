import React, { Component } from "react";
import { Container, Card, CardBody, CardHeader, Button } from "reactstrap";
import { connect } from "react-redux";
import { updateMessages, clearMessages } from "../redux/actions/chatRoomActions";
import { setView } from "../redux/actions/viewActions"
import { VIEWS } from "../constants/views"

const mapStateToProps = state => {
  const messages = state.chat.messages;
  const fullName = state.user.firstName + ' ' + state.user.lastName;
  const active = state.chat.active;
  let socket = state.user.socket;
  return { messages, fullName, socket, active};
};

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ""
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.resetMessage = this.resetMessage.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this)
    this.register = this.register.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.updateChatHistory = this.updateChatHistory.bind(this)
    this.leaveChatroom = this.leaveChatroom.bind(this)
    this.joinChatroom = this.joinChatroom.bind(this)

    this.register();
    this.joinChatroom();
  }
  componentDidMount() {
    this.props.socket.registerHandler(this.onMessageReceived);
  }

  onMessageReceived(entry) {
    console.log('onMessageReceived: ', entry);
    this.updateChatHistory(entry);
  }

  updateChatHistory(entry) {
    this.props.updateMessages([entry])
  }

  register() {
    this.props.socket.register(this.props.fullName, (err, user) => {
      if (err) {
        console.log("Error, client may already be registered")
      }

      console.log("user successfully registered. Name: ", user)
    })
  }

  onTextChange(event) {
    this.setState({ msg: event.target.value });
  }

  sendMessage() {
    if (!this.state.msg) return
    this.props.socket.message(this.props.active, this.state.msg, (err) => {
      if(err) {
        return console.error(err)
      }
    })
    this.resetMessage();
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  resetMessage() {
    this.setState({msg: ""});
  }

  joinChatroom() {
    console.log(this.props.active)
    this.props.socket.join(this.props.active, (err, chatHistory) => {
      if (err) {
        console.log(err)
      }
      this.props.updateMessages(chatHistory)
      console.log(chatHistory)
    })
  }

  leaveChatroom() {
    this.props.socket.leave(this.props.active, (err) => {
      if (err) {
        console.log("There was an error leaving chatroom: " + this.props.active)
      }
    })
    this.props.socket.unregisterHandler();
    this.props.socket.disconnect();
    this.props.clearMessages();
    this.props.setView(VIEWS.SOCIAL_PAGE);
  }

  render() {
    return (
      <Container>
          <Card>
            <CardHeader><h3>Chat</h3></CardHeader>
            <CardBody className="fade-in">
              {this.props.messages.map((msg, index) => (
                <p key={index}>{msg.user.name}{': '}{msg.message}</p>
              ))}
              <p>
                <label htmlFor="input">Enter your message: </label>
                <input
                  id="input"
                  value={this.state.msg}
                  onChange={this.onTextChange}
                  onKeyPress={this.handleKeyPress}
                />
                <Button onClick={this.sendMessage}>Send Message</Button>
                <Button onClick={this.leaveChatroom}>Leave Chatroom</Button>
              </p>
            </CardBody>
          </Card> 
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  { updateMessages, clearMessages, setView }
)(ChatRoom);
