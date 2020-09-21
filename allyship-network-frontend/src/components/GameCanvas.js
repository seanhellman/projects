import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Timer from './Timer';
import GameButton from './GameButton';

const GameCanvas = (props) => {
  return ( 
    <Row noGutters className="mb-4 align-items-center" style={{minHeight: "200px"}}>
      <Col className="text-center">
        <GameButton />
        <Timer />
      </Col>
    </Row>
   );
}
 
export default GameCanvas;