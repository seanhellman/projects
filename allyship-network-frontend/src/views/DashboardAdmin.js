import React, { Fragment } from "react";
import NavBarAllyship from "../components/NavBarAllyship";
import { Row, Col, Form, Button } from "react-bootstrap";
import { MOCK_STUDIES } from "../mock_data/mockStudyData";
import { FaChartBar, FaCalendarCheck, FaClipboardList } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";

const DashboardAdmin = (props) => {
  const userToken = useSelector(state=>state.auth.token);
  const userRole = useSelector(state=>state.auth.role);

  if (!userRole || !userToken || userRole !== "admin") {
    props.history.push("/signin");
  }

  const studies = MOCK_STUDIES.map((study, index) => <option key={index}>{study}</option>);
  return (
    <Fragment>
      <NavBarAllyship />
      <Row noGutters className="ml-3 mr-3">
        <Col>
          <Form>
            <Form.Group controlId="select-study">
              <Form.Label>Select a study:</Form.Label>
              <Row noGutters>
                <Col>
                  <Form.Control as="select">{studies}</Form.Control>
                </Col>
                <Col className="text-center">
                  <Button>New Study</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row noGutters className="ml-3 mt-5 mr-3">
        <Col className="mr-3">
          <Button variant="outline-primary" block>
            view/edit study constraints
            <br />
            <MdSettings size="5em" className="mt-3 mb-3" />
          </Button>
        </Col>
        <Col className="mr-3">
          <Button variant="outline-primary" block>
            manage time slots
            <br />
            <FaCalendarCheck size="5em" className="mt-3 mb-3" />
          </Button>
        </Col>
        <Col className="mr-3">
          <Button variant="outline-primary" block>
            download reports
            <br />
            <FaChartBar size="5em" className="mt-3 mb-3" />
          </Button>
        </Col>
        <Col>
          <Button variant="outline-primary" block>
            assign moderators
            <br />
            <FaClipboardList size="5em" className="mt-3 mb-3" />
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

export default DashboardAdmin;
