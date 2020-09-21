import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import CheckList from "../components/CheckList";
import NavBarAllyship from "../components/NavBarAllyship";
import { Row, Col } from "react-bootstrap";
import AccountParticipant from "../components/AccountParticipant";
import TimeSlotAlert from "../components/TimeSlotAlert";
import { useRouteMatch, Route } from "react-router-dom";
import TimeSlotSelect from "./TimeSlotSelect";
import ConsentForm from "../components/ConsentForm";
import PreSurvey from "../components/PreSurvey";
import PostSurvey from "../components/PostSurvey";
import OnboardingModal from "../components/OnboardingModal";
import { setParticipantInfo } from "../redux/actions";
import { useSelector } from "react-redux";
import { putParticipantAttributes } from "../utils/post";

const mapStateToProps = (state) => {
  const { participantId, completeOnboarding } = state.participant;
  const { participantInfo } = state.api;
  return { participantId, completeOnboarding, participantInfo };
};

const DashboardParticipant = (props) => {

  const dispatch = useDispatch();

  const userToken = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.role);

  if (!userRole || !userToken || userRole !== "participant") {
    props.history.push("/signin");
  }

  useEffect(() => {
    if (window.location.hash === "#updatePostSurvey") {
      putParticipantAttributes(props.participantId, {
        complete_post_survey: true,
      }).then((data) => {
        dispatch(setParticipantInfo(data));
        props.history.push("/participant-dashboard");
      })
    }
  });

  // state and handler for onboarding
  const [show, setShow] = useState(!props.completeOnboarding);
  const handleClose = () => {
    putParticipantAttributes(props.participantId, {
      complete_onboarding: true,
    }).then((data) => {
      // update local state
      props.setParticipantInfo(data);
    });
    setShow(false);
  };

  let match = useRouteMatch();

  return (
    <>
      <OnboardingModal show={show} close={handleClose} />
      {/* explicitly passing history to NavBar since it's not passed directly by React Router  */}
      <NavBarAllyship history={props.history}/>
      <Row noGutters className="pl-3 pr-3">
        <Col>
          <TimeSlotAlert />
          <Row noGutters>
            <Col xs={3} className="mr-4">
              <CheckList />
            </Col>
            <Col>
              <Switch>
                <Route exact path={match.path} component={AccountParticipant} />
                <Route
                  path={`${match.path}/consent-form`}
                  component={ConsentForm}
                />
                <Route
                  path={`${match.path}/pre-survey`}
                  component={PreSurvey}
                />
                <Route
                  path={`${match.path}/select-a-time-slot`}
                  component={TimeSlotSelect}
                />
                <Route
                  path={`${match.path}/post-survey`}
                  component={PostSurvey}
                />
              </Switch>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps, { setParticipantInfo })(
  DashboardParticipant
);
