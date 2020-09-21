import { 
  SET_AUTH,
  SET_AUTH_INIT,
  SET_AUTH_ROLE, 
  SET_AUTH_TOKEN,
  SET_AUTH_USER,
  SET_AUTH_LOADING,
  SET_AUTH_USER_ID,
} from "../actionTypes";

const initialState = {
  loading: true,
  user: null,
  token: null,
  role: null,
  userId: null,
};

// bypass signin for dev
// const initialState = {
//   loading: false,
//   user: "participant",
//   token: "wiXS4FIVDCB5aYQOx31tK1tw6iZin2",
//   role: "participant",
//   userId: 1,
// };

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        loading: action.payload.loading,
        token: action.payload.token,
        user: action.payload.user,
        role: action.payload.role,
        userId: action.payload.userId
      }
    case SET_AUTH_INIT:
      return initialState;
    case SET_AUTH_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      }
    case SET_AUTH_ROLE:
      return {
        ...state,
        role: action.payload.role
      }
    case SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.payload.token
      }
    case SET_AUTH_USER:
      return {
        ...state,
        user: action.payload.user
      }
    case SET_AUTH_USER_ID:
      return {
        ...state,
        userId: action.payload.userId
      }
    default:
      return state;
  }
};