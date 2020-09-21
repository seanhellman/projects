import React from "react";
import { Row, Col } from "react-bootstrap";
import { MdTimer } from "react-icons/md";

const Timer = (props) => {
  return (
    <Row noGutters className="bg-light border" style={{margin: "auto", maxWidth: "200px"}}>
      <Col xs={3} className="text-center align-middle p-2">
        <MdTimer size="1.5em" />
      </Col>
      <Col xs={9} className="border-left align-middle text-center p-2">
        <p>01:59</p>
      </Col>
    </Row>
  );
};

export default Timer;
