import { SET_VIEW } from "../actions/viewActionConstants";
import { VIEWS } from '../../constants/views'

const initialState = {
  active: VIEWS.LOGIN_PAGE,
}

const chatRoomState = {
  active: VIEWS.CHAT_ROOM
}

// const foodExerciseInputState = {
//   active: VIEWS.FOOD_EXERCISE_INPUT
// }

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_VIEW:
      return { active: action.payload }
    default:
      return state;
  }
}