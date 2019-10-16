import {
  SET_LOGGED_EXERCISES,
  UPDATE_LOGGED_EXERCISES
} from "../actions/exerciseActionConstants";

const initialState = {
  loggedToday: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_LOGGED_EXERCISES:
      return {
        ...state,
        loggedToday: action.payload
      };
    case UPDATE_LOGGED_EXERCISES:
      return {
        loggedToday: Object.assign(state.loggedToday, {
          [action.payload.exercise]: action.payload.minutes
        })
      }
    default:
      return state;
  }
}
