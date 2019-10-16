import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";
import { addNewChatroom } from "../redux/actions/userActions"
import firebase from "../data/fbConfig";

const mapStateToProps = state => {
  const currentUser = state.user.username;
  const currentUserDoc = state.user.userId;
  const userFullName = state.user.firstName + " " + state.user.lastName;
  const socket = state.user.socket;
  return { currentUser, currentUserDoc, userFullName, socket };
};

class NewMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      message: "",
      validUsername: true,
      chatID: "",
      recipientName: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addDoc = this.addDoc.bind(this);
    this.addChatrooms = this.addChatrooms.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleClick(event) {
    if (event.target.value === "cancel") {
      this.props.setView(VIEWS.SOCIAL_PAGE);
    } else {
      if (this.state.username === this.props.currentUser) {
        this.setState({ validUsername: false });
      } else {
        const database = firebase.firestore();
        database
          .collection("users")
          .where("username", "==", this.state.username)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size === 1) {
              const doc = querySnapshot.docs[0];
              const recipient =
                doc.data().firstName + " " + doc.data().lastName;
              this.setState({ validUsername: true, recipientName: recipient });
              this.addDoc(doc.id);
            } else {
              this.setState({ validUsername: false });
            }
          });
      }
    }
  }

  addDoc(recipientId) {
    const database = firebase.firestore();
    database
      .collection("chatrooms")
      .add({
        messages: [
          {
            message: this.state.message,
            user: { name: this.props.userFullName }
          }
        ],
        users: [this.props.userFullName, this.state.recipientName]
      })
      .then(docRef => {
        this.addChatrooms(this.props.currentUserDoc, docRef.id)
        this.addChatrooms(recipientId, docRef.id)
        this.props.socket.newChatroom(docRef.id, this.props.userFullName, this.state.message, (error) => {
          console.log(error)
        });
        this.props.addNewChatroom(docRef.id);
      });
  }

  addChatrooms(docId, chatId) {
    const database = firebase.firestore();
    database
      .collection("users")
      .doc(docId)
      .update({
        chatrooms: firebase.firestore.FieldValue.arrayUnion(chatId)
      })
    
  }

  render() {
    return (
      <React.Fragment>
        {this.state.validUsername ? (
          ""
        ) : (
          <Alert color="danger">The user does not exist.</Alert>
        )}
        <Form>
          <FormGroup row>
            <Label for="user" xs="1">updateChatroom
              To:
            </Label>
            <Col>
              <Input
                type="text"
                name="username"
                id="username"
                value={this.state.user}
                onChange={this.handleChange}
                placeholder="username"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="message">Message</Label>
            <Input
              type="textarea"
              name="message"
              id="message"
              value={this.state.message}
              onChange={this.handleChange}
            />
          </FormGroup>
        </Form>
        <Row>
          <Col>
            <Button color="link" value="cancel" onClick={this.handleClick}>
              Cancel
            </Button>
            <Button color="success" onClick={this.handleClick}>
              Message
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  { setView, addNewChatroom }
)(NewMessage);
