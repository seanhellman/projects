import {
  LOAD_USER,
  RESET_USER,
  ADD_NEW_CHATROOM,
  COMPLETE_ONBOARDING,
} from "../actions/userActionConstants";

const initialState = {
  userId: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  chatrooms: [],
  imageURL: "",
  socket: null,
  onboardingComplete: false
};

export default function(state = initialState, actions) {
  switch (actions.type) {
    case LOAD_USER:
      return {
        ...state,
        ...actions.payload
      };
    case ADD_NEW_CHATROOM:
      return {
        ...state,
        chatrooms: [...state.chatrooms, actions.payload]
      };
    case COMPLETE_ONBOARDING:
      return { ...state, onboardingComplete: true };
    case RESET_USER:
      return initialState;
    default:
      return state;
  }
}
