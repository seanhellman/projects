import { MOCK_MODERATOR_1 } from "../../mock_data/mockModeratorData";

const initialState = MOCK_MODERATOR_1;

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}