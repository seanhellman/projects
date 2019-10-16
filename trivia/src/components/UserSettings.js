import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const UserSettings = (props) => {

  // create an array of numbers from 10-50
  function populateNumQuestionsArray() {
    const rangeOfNumQuestions = 41;
    let numQuestions = new Array(rangeOfNumQuestions);
    for (let i = 0; i < 41; i++) {
      numQuestions[i] = i + 10;
    }
    return numQuestions
  }

  // create an <option> for each number in the array from 10-50
  let num = populateNumQuestionsArray().map(amount => <option key={amount}>{amount}</option>)

  // create an <option> for each category
  let categories = props.allCategories.map(category => <option key={category}>{category}</option>)

  return (
    <Row>
      <Col>
        <p className="mb-4 p-3 question-card">Welcome to trivia! Change the
          settings below to customize the game
          and then get started. You can choose your number of questions,
          difficulty level, category, and play mode. Under play mode, choose 'Solo' if
          you'd like to play without a competitor. Choose 'Computer' if you've like
          to play against the computer. <br /><br />
          <strong><u>Rules:</u></strong> <br />
          As long as you (or the computer, if you're 
          playing against it) have gotten or can get 50% of the questions correct, then 
          you can keep playing. However, once you answer more than 50% of the questions 
          incorreclty, it's 'game over' and you'll have to try again.
        </p>
        <Form>
          <FormGroup>
            <Label for="numQuestions" className="info-icon bright-red">
              Number of questions
          </Label>
            <Input
              id="numQuestions"
              name="selectNumQuestions"
              type="select"
              value={props.numQuestions}
              onChange={props.setNumQuestions}
            >
              {num}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="difficultyLevel" className="info-icon bright-red">
              Difficulty level
          </Label>
            <Input
              id="difficultyLevel"
              name="selectDifficultyLevel"
              type="select"
              value={props.difficultyLevel}
              onChange={props.setDifficultyLevel}
            >
              <option>Any</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="category" className="info-icon bright-red">
              Category
          </Label>
            <Input
              id="category"
              name="selectCategory"
              type="select"
              value={props.category}
              onChange={props.setCategory}
            >
              <option>All</option>
              {categories}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="playMode" className="info-icon bright-red">
              Play mode
          </Label>
            <Input
              id="playMode"
              name="selectPlayMode"
              type="select"
              value={props.playMode}
              onChange={props.setPlayMode}
            >
              <option>Solo</option>
              <option>Computer</option>
            </Input>
          </FormGroup>
        </Form>
        <Button onClick={props.markSettingsConfigured}>Start!</Button>
      </Col>
    </Row>
  )
}

export default UserSettings