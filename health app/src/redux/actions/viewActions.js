import { SET_VIEW } from "./viewActionConstants";

export const setView = view => ({
  type: SET_VIEW,
  payload: view
})