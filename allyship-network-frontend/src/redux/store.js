// for deploy version
// import { createStore, applyMiddleware, combineReducers } from "redux";
// import thunkMiddleware from "redux-thunk";
// import { participantReducer } from "./reducers/participant";
// import { teamReducer } from "./reducers/team";
// import { moderatorReducer } from "./reducers/moderator";
// import { gameReducer } from "./reducers/game";
// import { authReducer } from "./reducers/auth";

// export const rootReducer = combineReducers({
//    participant: participantReducer,
//    team: teamReducer,
//    moderator: moderatorReducer,
//    game: gameReducer,
//    auth: authReducer
// });

// export default createStore(rootReducer, applyMiddleware(thunkMiddleware));

// for develop version
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

function saveToLocalStorage(state) {
  try {
    delete state.participant.chatClient;
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (error) {
    console.log(error);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    state.participant.chatClient = null;
    return state;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

const persistedState = loadFromLocalStorage();

const store = createStore(
  rootReducer,
  persistedState,
  compose(applyMiddleware(thunk))
);

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;