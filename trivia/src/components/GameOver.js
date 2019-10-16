import React, { Fragment } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrownOpen } from '@fortawesome/free-solid-svg-icons'

const GameOver = (props) => {

  let gameOverIcon = <FontAwesomeIcon icon={faFrownOpen} className="ml-2" />

  return (
    <Fragment>
      <div className="mb-4 p-3 question-card">
        <h2>GAME OVER {gameOverIcon}</h2>
        <p>Sorry! You've answered more than half of the questions incorrectly.
        Click the button below to start a new game.</p>
      </div>
      <Button onClick={props.restart}>New Game</Button>
    </Fragment>
  )

}



export default GameOver;