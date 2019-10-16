import React from "react";
import { Nav } from "react-bootstrap";
import { connect } from "react-redux";
import {} from "../redux/actions/foodActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const CalNav = props => {
  return (
    <Nav className="justify-content-center bg-light mb-3">
    <Nav.Item>
      <Nav.Link eventKey="disabled" disabled>
        {<FontAwesomeIcon className="fa-lg" icon={faAngleLeft} />}
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="disabled" disabled>
        today
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="disabled" disabled>
        {<FontAwesomeIcon className="fa-lg" icon={faAngleRight} />}
      </Nav.Link>
    </Nav.Item>
  </Nav>
  )
}

export default connect()(CalNav);