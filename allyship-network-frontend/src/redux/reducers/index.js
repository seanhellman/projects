import { combineReducers } from "redux";
// import individual reducers
import participant from "./participant";
import team from "./team";
import moderator from "./moderator";
import game from "./game";
import auth from "./auth";
import api from "./api";
import { LOGOUT } from "../actionTypes";

const appReducer = combineReducers({ participant, team, moderator, game, auth, api });

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined
  }

  return appReducer(state, action);
}

export default rootReducer;