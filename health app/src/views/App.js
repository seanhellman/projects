import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import FoodInput from "../components/FoodInput";
import FoodResultDetail from "../components/FoodResultDetail";
import { VIEWS } from "../constants/views";
import { setView } from "../redux/actions/viewActions"
import { logOut } from "../redux/actions/loginActions"
import ChatRoom from "../components/ChatRoom";
import ProfileView from "./ProfileView"
import Login from "../components/Login";
import NavigationBar from "../components/NavigationBar";
import SocialView from "./SocialView";
import NewMessage from "../components/NewMessage";
import FoodExerciseInput from "../components/FoodExerciseInput";
import ExerciseInput from "../components/ExerciseInput";
import Settings from "../components/Settings";
import Onboarding from "../components/Onboarding";


const mapStateToProps = state => {
  const activeRoom = state.chat.active
  const { active } = state.view;
  return { active, activeRoom };
};

const displaySwitcher = (view) => {
  switch (view) {
    case VIEWS.FOOD_EXERCISE_INPUT:
      return <FoodExerciseInput />
    case VIEWS.FOOD_INPUT:
      return <FoodInput />;
    case VIEWS.EXERCISE_INPUT:
      return <ExerciseInput />
    case VIEWS.FOOD_RESULT_DETAIL:
      return <FoodResultDetail />;
    case VIEWS.CHAT_ROOM:
      return <ChatRoom className="fade-in"/>;
    case VIEWS.PROFILE:
      return <ProfileView />;
    case VIEWS.LOGIN_PAGE:
      return <Login />;
    case VIEWS.SETTINGS:
      return <Settings/>
    case VIEWS.SOCIAL_PAGE:
      return <SocialView/>
    case VIEWS.NEW_MESSAGE:
      return <NewMessage/>
    case VIEWS.ONBOARDING:
      return <Onboarding/>
    default:
      return "";
  }
};

const App = props => {
  return (
    <Fragment>
      {
        (props.active === VIEWS.LOGIN_PAGE || props.active === VIEWS.CHAT_ROOM) || props.active === VIEWS.ONBOARDING ? "" : <NavigationBar/>
      }
      <Container>{displaySwitcher(props.active)}</Container>

    </Fragment>
  );
};

export default connect(mapStateToProps, {setView, logOut})(App, displaySwitcher);
