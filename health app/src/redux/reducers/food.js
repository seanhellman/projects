import {
  POPULATE_FOOD_SEARCH_RESULTS,
  SET_ACTIVE_FOOD,
  SET_ACTIVE_NUTRITION_DATA,
  SET_LOGGED_FOOD,
  CLEAR_FOOD_SEARCH_RESULTS,
  UPDATE_LOGGED_FOOD
} from "../actions/foodActionConstants";

const initialState = {
  searchResults: [],
  activeFood: {},
  activeNutritionData: {},
  loggedToday: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POPULATE_FOOD_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };
    case CLEAR_FOOD_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: []
      };
    case SET_ACTIVE_NUTRITION_DATA:
      return {
        ...state,
        activeNutritionData: action.payload
      };
    case SET_ACTIVE_FOOD:
      return {
        ...state,
        activeFood: action.payload
      };
    case SET_LOGGED_FOOD:
      return {
        ...state,
        loggedToday: action.payload
      };
    case UPDATE_LOGGED_FOOD:
      state.loggedToday.push(action.payload);
      return {
        ...state
      };
    default:
      return state;
  }
}
