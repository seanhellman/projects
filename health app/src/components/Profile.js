import React, {Component} from 'react';
import {connect} from "react-redux";
import { Container, Image, Button, Row, Col, Accordion, Card } from 'react-bootstrap';

const mapStateToProps = state => {
  const firstName = state.user.firstName;
  const lastName = state.user.lastName;
  const imageURL = state.user.imageURL;
  const exerciseToday = state.exercise.loggedToday
  return { firstName, lastName, imageURL, exerciseToday }
}


class Profile extends Component {
  render() {
    let userFullName = this.props.firstName + " " + this.props.lastName;
    let exerciseLogged = [];
    if (this.props.exerciseToday) {
      for (let property in this.props.exerciseToday) {
        exerciseLogged.push({property, value: this.props.exerciseToday[property]})
      }
    }
    return (
      <React.Fragment> 
        <Container className='profile-card zoom-in' id='profile-card-background'>
          <Row>
            <Container className="fade-in" id='profile-picture-container'>
              { 
                this.props.imageURL ? <Image id='profile-picture' aria-label='profile picture'
                                      src={this.props.imageURL}/> : <i class="fas fa-user-circle"></i>
              }
            </Container>
          </Row>
          <Row>
            <Col className="fade-in" id='user-display-name'>
              <h3> 
               {
                 this.props.firstName ? userFullName : ''
               }
              </h3>
            </Col>
          </Row>
          <Accordion>
            <Row>
              <Col className='metric-goal-container fade-in'>
                <Button variant='success' id='metrics-button' aria-label='View metrics button'>
                  Metrics
                </Button>
              </Col>
              <Col className='metric-goal-container fade-in'>
                <Accordion.Toggle as={Button} variant="success" eventKey="0">
                  Goals
                </Accordion.Toggle>
              </Col>
            </Row>
            <Accordion.Collapse eventKey="0">
              <Row className="info-container profile-content">
                <Col>
                  <Card>
                    <Card.Header>
                      Goals
                    </Card.Header>
                    <Card.Body id="goal-card">
                      <p className="goal-title">
                        Exercise:
                      </p>
                      Work out 3x a week 
                      <br/>
                      Benchpress 100lb
                      <br/>
                      <p className="goal-title">
                        Nutrition:
                      </p>
                      Eat more potatochips 
                      <br/>
                      Become a vegetarian
                      <br/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Accordion.Collapse>
          </Accordion>
          <Row className="fade-in info-container">
            <Col>
              <Card>
                  <Card.Body>
                    <span className="bold-text">Exercise Streak</span>: 4 workouts in a row
                  </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="info-container profile-content fade-in">
              <Col>
                <Card>
                  <Card.Header className="bold-text">
                    Today's Exercises
                  </Card.Header>
                  <Card.Body id="goal-card">
                    {
                      (exerciseLogged != undefined && exerciseLogged.length > 0) ? 
                       exerciseLogged.map(({property, value}) => <span>{property} - {value} minutes<br/></span>) : 
                      "Nothing logged today"
                    }
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps, {})(Profile);