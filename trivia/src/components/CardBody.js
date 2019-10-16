import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faDesktop, faUser } from '@fortawesome/free-solid-svg-icons'

const CardBody = (props) => {

  let userIcon = <FontAwesomeIcon icon={faUser} className="ml-2"/>
  let computerIcon = <FontAwesomeIcon icon={faDesktop} className="ml-2"/>
  let correctIcon = <FontAwesomeIcon icon={faCheckCircle} className="float-right"/>
  let incorrectIcon = <FontAwesomeIcon icon={faTimesCircle} className="float-right"/>

  let indexOfAnswerSelected = parseInt(props.indexOfAnswerSelected);

  return (

    <Row>
      <Col>
          {
            props.allAnswers.map(
              (answer, i) => {
                return (<button
                  key={props.id + 'option' + i}
                  id={props.id + 'option' + i}
                  name='options'
                  className={props.indexOfAnswerSelected === i ? 'active' : ''}
                  value={answer === props.correctAnswer ? true : false}
                  onClick={props.markAnswered}
                  disabled={props.answered ? true : false}
                >
                  {ReactHtmlParser(answer)}
                  {props.playMode === 'Solo' ? '' : i === props.computerAnswer ? computerIcon : ''}
                  {indexOfAnswerSelected === i ? userIcon : ''}
                  {props.answered ? answer === props.correctAnswer ? correctIcon : incorrectIcon : ''}
                </button> )
              }
            )
          }
      </Col>
    </Row>
  )

}

export default CardBody;
