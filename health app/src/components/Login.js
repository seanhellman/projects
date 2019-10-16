import React, { Component } from "react";
import { connect } from "react-redux";
import {
  FormGroup,
  Row,
  Col,
  Alert,
  Form,
  Button,
  Container,
  Spinner
} from "react-bootstrap";
import { attemptLogin, resetInvalidMsg } from "../redux/actions/loginActions";

const mapStateToProps = state => {
  const failedLogin = state.login.failedLogin;
  return { failedLogin };
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      activateSpinner: false
    };

    this.onFieldChange = this.onFieldChange.bind(this);
    this.login = this.login.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  onFieldChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
    this.props.resetInvalidMsg();
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.login();
    }
  }

  login() {
    this.setState({ activateSpinner: true }, () => {
      this.props.attemptLogin(this.state.username, this.state.password, () => {
        this.setState({ activateSpinner: false });
      });
    });
  }

  render() {
    return (
      <Container>
        <Container id="login-container">
          <div id="login-title-container">
            <h1 id="login-title">Health App</h1>
          </div>
          {this.props.failedLogin ? (
            <Alert color="danger" id="invalid-login-alert">
              Invalid username or password... Please try again
            </Alert>
          ) : (
            ""
          )}
          <FormGroup>
            <Col>
              <Form.Label htmlFor="username">Email/Username</Form.Label>
              <Form.Control
                type="email"
                id="username"
                placeholder="Email/Username"
                value={this.state.username}
                onChange={this.onFieldChange}
                onKeyPress={this.handleKeyPress}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                value={this.state.password}
                onChange={this.onFieldChange}
                placeholder="Password"
                onKeyPress={this.handleKeyPress}
              />
            </Col>
          </FormGroup>
          <Row>
            <Col className="text-right">
              {this.state.activateSpinner ? (
                <Spinner animation="border" role="status" />
              ) : (
                <Button onClick={this.login}>Submit</Button>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  { attemptLogin, resetInvalidMsg }
)(Login);