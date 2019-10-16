import { UPDATE_MESSAGES, SET_CHATROOM, CLEAR_MESSAGES } from "../actions/chatRoomActionConstants";

const initialState = {
  active: "",
  messages: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MESSAGES:
      return { ...state, messages: [...state.messages, ...action.payload.messages] }
    case SET_CHATROOM:
      return { ...state, active: action.payload.chatroom}
    case CLEAR_MESSAGES:
      return initialState
    default:
      return state;
  }
}