import React from 'react';
import CardHeader from '../components/CardHeader';
import CardBody from '../components/CardBody';

const Card = (props) =>
  <div className="mb-4 p-3 question-card">
    <CardHeader
      question={props.question}
      category={props.category}
      difficulty={props.difficulty}
      questionNum={props.questionNum}
    />
    <CardBody
      key={props.id + 'cardbody-'}
      id={props.id + 'cardbody-'}
      playMode={props.playMode}
      allAnswers={props.allAnswers}
      correctAnswer={props.correctAnswer}
      computerAnswer={props.computerAnswer}
      indexOfAnswerSelected={props.indexOfAnswerSelected}
      answered={props.answered}
      markAnswered={props.markAnswered}
    />
  </div>

export default Card;