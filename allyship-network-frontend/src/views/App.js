import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashboardParticipant from "../views/DashboardParticipant";
import GameRound from "./GameRound";
import WaitingRoom from "./WaitingRoom";
import ChatTest from "../components/ChatTest";
import DashboardAdmin from "./DashboardAdmin";
import DashboardModerator from "./DashboardModerator";
import SignIn from "./SignIn";
import { connect } from "react-redux";
import { setParticipantInfo } from "../redux/actions";
import { handleConsentRedirect, handlePreSurveyRedirect, handlePostSurveyRedirect } from "../utils/redirects";

const mapStateToProps = (state) => {
  const { participantId } = state.participant;
  return { participantId };
};

const App = (props) => {

  return (
    <Container>
      <Router>
        <Switch>
          <Route path="/game" component={GameRound} />
        </Switch>
      </Router>
    </Container>
  );
};

export default connect(mapStateToProps, { setParticipantInfo })(App);
