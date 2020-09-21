import {
  NOT_FETCHED,
  FETCH_STARTED,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from "../actionTypes";

const initialState = {
  participantInfo: NOT_FETCHED,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_STARTED:
      console.log("setting fetch to STARTED");
      return {
        ...state,
        participantInfo: FETCH_STARTED,
      };
    case FETCH_SUCCESS:
      console.log("setting fetch to SUCCESS");
      return {
        ...state,
        participantInfo: FETCH_SUCCESS,
      };
    case FETCH_ERROR:
      console.log("setting fetch to ERROR");
      return {
        ...state,
        participantInfo: FETCH_ERROR,
      };
    default:
      return state;
  }
}
