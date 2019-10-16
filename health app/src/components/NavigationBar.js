import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faUsers,
  faEdit,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";
import NavigationBtn from "./NavigationBtn";
import { completeOnboarding } from "../redux/actions/userActions";

const mapStateToProps = state => {
  const onboarding = !state.user.onboardingComplete;
  const user = state.user.userId;
  return { onboarding, user };
};

class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.setState({ tooltipOpen: this.props.onboarding });
  }

  handleClick(event) {
    event.preventDefault();
    this.props.setView(event.currentTarget.value);
  }

  toggle() {
    if (this.state.tooltipOpen === true) {
      this.props.completeOnboarding(this.props.user);
    }
    this.setState({
      tooltipOpen: false
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="nav-bar">
          <Container>
            <Row>
              <Col>
                <NavigationBtn
                  view={VIEWS.PROFILE}
                  id="profile"
                  icon={<FontAwesomeIcon className="fa-lg" icon={faIdCard} />}
                  handleClick={this.handleClick}
                  tooltipOpen={false}
                  tooltipInfo={"Your statitics and goals."}
                  toggle={this.toggle}
                />
              </Col>
              <Col>
                <NavigationBtn
                  view={VIEWS.SOCIAL_PAGE}
                  id="social"
                  icon={<FontAwesomeIcon className="fa-lg" icon={faUsers} />}
                  handleClick={this.handleClick}
                  tooltipOpen={this.state.tooltipOpen}
                  tooltipInfo={"Stay accountable with your friends."}
                  toggle={this.toggle}
                />
              </Col>
              <Col>
                <NavigationBtn
                  view={VIEWS.FOOD_EXERCISE_INPUT}
                  id="input"
                  icon={<FontAwesomeIcon className="fa-lg" icon={faEdit} />}
                  handleClick={this.handleClick}
                  tooltipOpen={false}
                  tooltipInfo=""
                  toggle={this.toggle}
                />
              </Col>
              <Col>
                <NavigationBtn
                  view={VIEWS.SETTINGS}
                  id="settings"
                  icon={<FontAwesomeIcon className="fa-lg" icon={faCog} />}
                  handleClick={this.handleClick}
                  tooltipOpen={false}
                  tooltipInfo=""
                  toggle={this.toggle}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  { setView, completeOnboarding }
)(NavigationBar);
