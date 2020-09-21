import React, { Fragment } from "react";
import NavBarAllyship from "../components/NavBarAllyship";
import { Row, Col, Button } from "react-bootstrap";
import { MOCK_TIME_SLOT_DATA } from "../mock_data/mockTimeSlotData";
import {
  formatAsLocalDateTime,
  isWithinPreWindow,
  isWithinPostWindow,
} from "../utils/funcs";
import { PRE_WINDOW, POST_WINDOW } from "../constants";
import { useSelector } from "react-redux";

const DashboardModerator = (props) => {
  const userToken = useSelector(state=>state.auth.token);
  const userRole = useSelector(state=>state.auth.role);

  if (!userRole || !userToken || userRole !== "monitor") {
    props.history.push("/signin");
  }

  const timeSlotItems = Object.keys(MOCK_TIME_SLOT_DATA).map(
    (timeSlot, index) => {
      const withinWindow =
        isWithinPreWindow(timeSlot, PRE_WINDOW) ||
        isWithinPostWindow(timeSlot, POST_WINDOW);
      const label = formatAsLocalDateTime(timeSlot);
      return (
        <Row noGutters className="border-bottom align-items-center" key={index}>
          <Col>
            <p>{label}</p>
          </Col>
          <Col>
            <Button disabled={!withinWindow} className="mt-2 mb-2">
              Moderate
            </Button>
          </Col>
        </Row>
      );
    }
  );

  return (
    <Fragment>
      <NavBarAllyship />
      <Row noGutters className="debug-1 pl-3 pt-3 pr-3">
        <Col>
          <h2>Moderator Time Slots</h2>
          <p className="mb-3 font-italic">
            You will be able to open the moderater panel 30 minutes prior to
            each time slot.
          </p>
          {timeSlotItems}
        </Col>
      </Row>
    </Fragment>
  );
};

export default DashboardModerator;
