import { MOCK_TEAM_1 } from "../../mock_data/mockTeamData";

const initialState = MOCK_TEAM_1;

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}