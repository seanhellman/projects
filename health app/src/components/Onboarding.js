import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import Slide from "./Slide";
import SlideIndicator from "./SlideIndicator";
import { setView } from "../redux/actions/viewActions";
import { VIEWS } from "../constants/views";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHamburger, faCarrot, faIceCream, faRunning, faSwimmer, faBiking, faUserFriends } from '@fortawesome/free-solid-svg-icons';


const TOTAL_SLIDES = 3;

class Onboarding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 1
    };

    this.pickSlide = this.pickSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.exitOnboarding = this.exitOnboarding.bind(this);
  }

  setSlideState(currentSlide) {
    if (currentSlide === this.state.activeSlide) {
      return "active";
    } else {
      return "inactive";
    }
  }

  pickSlide(event, currentSlide) {
    this.setSlide(currentSlide);
  }

  nextSlide() {
    let slideNum = this.state.activeSlide;
    slideNum < TOTAL_SLIDES
      ? this.setSlide(slideNum + 1)
      : this.exitOnboarding();
  }

  setSlide(currentSlide) {
    this.setState({ activeSlide: currentSlide });
  }

  exitOnboarding() {
    this.props.setView(VIEWS.FOOD_EXERCISE_INPUT)
  }

  generateSlides() {
    let indicators = [];
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      indicators.push(
        <SlideIndicator
          slideStatus={this.setSlideState(i)}
          key={i}
          slideID={i}
          click={this.pickSlide}
        />
      );
    }
    return indicators;
  }

  render() {
    return (
      <div className="fullscreen slides-bg">
        <Slide slideStatus={this.setSlideState(1)} slideId={1}>
          <Container className="onboarding-margin">
            <Row className="justify-content-lg-center justify-content-md-center justify-content-sm-center">
              <Col lg="auto" md="auto" sm="auto" className="text-center">
                <h1>Log your meals.</h1>
                <h3><FontAwesomeIcon className="fa-lg" icon={faHamburger}/><FontAwesomeIcon className="fa-lg left-padding" icon={faCarrot}/><FontAwesomeIcon className="fa-lg left-padding" icon={faIceCream}/></h3>
              </Col>
            </Row>
          </Container>
        </Slide>
        <Slide slideStatus={this.setSlideState(2)} slideId={2}>
          <Container className="onboarding-margin">
            <Row className="justify-content-lg-center justify-content-md-center justify-content-sm-center">
              <Col lg="auto" md="auto" sm="auto" className="text-center">
                <h1>Keep track of how often you exercise.</h1>
                <h3><FontAwesomeIcon className="fa-lg" icon={faRunning}/><FontAwesomeIcon className="fa-lg left-padding" icon={faBiking}/><FontAwesomeIcon className="fa-lg left-padding" icon={faSwimmer}/></h3>
              </Col>
            </Row>
          </Container>
        </Slide>
        <Slide slideStatus={this.setSlideState(3)} slideId={3}>
          <Container className="onboarding-margin">
            <Row className="justify-content-lg-center justify-content-md-center justify-content-sm-center">
              <Col lg="auto" md="auto" sm="auto" className="text-center">
                <h1>Keep you and your friends accountable.</h1>
                <h3><FontAwesomeIcon className="fa-lg" icon={faUserFriends}/></h3>
              </Col>
            </Row>
          </Container>
        </Slide>
        <div className="slides-controls">
          <button
            className="align-left control-btn bold"
            onClick={this.exitOnboarding}
            aria-label="onboarding-skip"
          >
            Skip
          </button>
          <div className="align-center">{this.generateSlides()}</div>
          <button
            className="align-right control-btn bold"
            onClick={this.nextSlide}
            aria-label="onboarding-next"
          >
            {this.state.activeSlide < TOTAL_SLIDES ? "Next" : "Done"}
          </button>
        </div>
      </div>
    );
  }
}
export default connect(
  null,
  { setView }
)(Onboarding);
