import React from 'react';
import { Row, Col } from 'reactstrap';

const CardHeader = (props) =>
  <Row>
    <Col sm={{ size: 4, order: 2 }}>
      <p className="info-icon bright-red">{props.category}</p>
      <p className="info-icon light-red">{props.difficulty}</p>
    </Col>
    <Col sm={{ size: 8, order: 1 }}>
      <p className="small-text">question #: {props.questionNum}</p>
      <p>{props.question}</p>
    </Col>
  </Row>


export default CardHeader;

