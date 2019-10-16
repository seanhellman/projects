import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { logOut } from "../redux/actions/loginActions";
import { VIEWS } from "../constants/views";
import { setView } from "../redux/actions/viewActions";

class Settings extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.setView(VIEWS.ONBOARDING);
  }

  render() {
    return (
      <Container>
        <div
          id="onboarding-btn"
          className="onboarding-option fade-in"
          onClick={() => this.handleClick()}
          value={VIEWS.ONBOARDING}
        >
          <Row>
            <Col>
              <b>Onboarding</b>
            </Col>
          </Row>
        </div>
        <Row>
          <Col className="fade-in" id="logout-button-container">
            <Button
              id="logout-button"
              variant="success"
              onClick={this.props.logOut}
            >
              Logout
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(
  null,
  { logOut, setView }
)(Settings);
