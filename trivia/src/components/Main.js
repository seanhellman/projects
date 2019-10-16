import React, { Component } from 'react';
import { Button } from 'reactstrap'
import ReactHtmlParser from 'react-html-parser';
import Card from '../components/Card';
import GameOver from '../components/GameOver';
import Footer from '../components/Footer';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetched: false,
      questions: [],
      questionNumber: 0,
      correctAnswerIndex: 0,
      computerAnswerIndex: 0,
      indexOfAnswerSelected: '',
      answered: false,
      userNumAnsweredIncorrectly: 0,
      compNumAnsweredIncorrectly: 0,
    }

    this.userScore = 0;
    this.compScore = 0;

    this.advanceToNextQuestion = this.advanceToNextQuestion.bind(this);
    this.markAnswered = this.markAnswered.bind(this);
  }

  // fetch data from opentdb and populate state
  componentDidMount() {
    let url = 'https://opentdb.com/api.php?amount=' + this.props.numQuestions
      + '&category=' + this.props.category + '&difficulty=' + this.props.difficultyLevel;

    fetch(url)
      .then(results => results.json())
      .then(data => {
        let arrOfQuestions = data.results;
        let numOptions = data.results[0].incorrect_answers.length;
        let correctAnswerIndex = this.randInt(0, numOptions);
        let computerAnswerIndex = this.randInt(0, numOptions);
        this.setState({
          questions: arrOfQuestions,
          correctAnswerIndex: correctAnswerIndex,
          computerAnswerIndex: computerAnswerIndex,
          fetched: true
        });
      });

  }

  advanceToNextQuestion() {
    let questionNumber = this.state.questionNumber + 1;
    let numOptions = this.state.questions[questionNumber].incorrect_answers.length;
    let correctAnswerIndex = this.randInt(0, numOptions);
    let computerAnswerIndex = this.randInt(0, numOptions);
    this.setState({
      questionNumber: questionNumber,
      correctAnswerIndex: correctAnswerIndex,
      computerAnswerIndex: computerAnswerIndex,
      indexOfAnswerSelected: '',
      answered: false
    });
  }

  markAnswered(event) {

    let button = event.target;
    let id = button.id;
    let value = button.value;
    let indexOfAnswerSelected = id.charAt(id.length - 1);

    // set state with index of answer selected by the user
    this.setState({
      answered: true,
      indexOfAnswerSelected: indexOfAnswerSelected
    })

    // always update user stats
    this.updateUserStats(value);

    // only update computer stats if playMode === 'Computer'
    if (this.props.playMode === 'Computer') {
      this.updateComputerStats(event);
    }
  }

  // if the user answered correclty, increment user score
  // otherwise, increment number of answers user answered incorrectly
  updateUserStats(value) {
    if (value === 'true') {
      this.userScore++;
    } else {
      this.setState({
        userNumAnsweredIncorrectly: this.state.userNumAnsweredIncorrectly + 1
      })
    }
  }

  // if the comp answered correclty, increment comp score
  // otherwise, increment number of answers comp answered incorrectly
  updateComputerStats() {
    let correctAnswerIndex = this.state.correctAnswerIndex;
    let computerAnswerIndex = this.state.computerAnswerIndex;
    if (computerAnswerIndex === correctAnswerIndex) {
      this.compScore++;
    } else {
      this.setState({
        compNumAnsweredIncorrectly: this.state.compNumAnsweredIncorrectly + 1
      })
    }
  }

  // if solo mode, game over if user answers more than half of the 
  // questions incorrectly
  // if computer mode, game over if both user and comp answer more
  // than half of the questions incorrectly
  gameOver() {
    let numQuestions = this.props.numQuestions;
    let userNumAnsweredIncorrectly = this.state.userNumAnsweredIncorrectly;
    let compNumAnsweredIncorrectly = this.state.compNumAnsweredIncorrectly;
    if (this.props.playMode === 'Solo') {
      return (userNumAnsweredIncorrectly / numQuestions) > 0.5;
    }
    return (userNumAnsweredIncorrectly / numQuestions) > 0.5
      && (compNumAnsweredIncorrectly / numQuestions) > 0.5;
  }

  // strips 'Entertainment: ' from opentdb categories as necessary
  shorten(category) {
    if (category.startsWith('Entertainment')) {
      return category.slice(14);
    }
    return category;
  }

  // generates a random int between min and max (inclusive)
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  render() {

    let lastQuestion = this.state.questionNumber === this.props.numQuestions - 1 ? true : false;

    if (this.gameOver() && !lastQuestion) {
      return (
        <GameOver restart={this.props.restart} />
      )
    }

    if (this.state.fetched) {
      let questionNumber = this.state.questionNumber;
      let question = this.state.questions[questionNumber];
      let correctAnswerIndex = this.state.correctAnswerIndex;

      let allAnswers = Array.from(question.incorrect_answers);
      allAnswers.splice(correctAnswerIndex, 0, question.correct_answer);

      let button = this.state.questionNumber === this.props.numQuestions - 1 ?
        <Button
          onClick={this.props.restart}
          disabled={this.state.answered ? false : true}
        >
          New Game
        </Button>
        :
        <Button
          onClick={this.advanceToNextQuestion}
          disabled={this.state.answered ? false : true}
        >
          Next
        </Button>

      return (
        <div>
          <Card
            id={'card' + questionNumber + '-'}
            playMode={this.props.playMode}
            question={ReactHtmlParser(question.question)[0]}
            questionNum={this.state.questionNumber + 1}
            category={this.shorten(ReactHtmlParser(question.category)[0])}
            difficulty={ReactHtmlParser(question.difficulty)[0]}
            allAnswers={allAnswers}
            correctAnswer={question.correct_answer}
            computerAnswer={this.state.computerAnswerIndex}
            indexOfAnswerSelected={this.state.indexOfAnswerSelected}
            answered={this.state.answered}
            markAnswered={this.markAnswered}
          />
          {button}
          <Footer
            playMode={this.props.playMode}
            numQuestions={this.props.numQuestions}
            userScore={this.userScore}
            compScore={this.compScore}
          />
        </div>
      )
    }

    return ('')

  }
}

export default Main
