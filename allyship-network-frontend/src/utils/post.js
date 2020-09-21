import { FETCH_URL } from "../constants";

export const putParticipantAttributes = (participantId, attributes) => {
  console.log(attributes);
  return fetch(FETCH_URL + `api/participants/${participantId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attributes),
  })
    .then((response) => {
      return response.json()
    })
    .catch((error) => console.error(error));
};

export const putButtonClicked = (participantId, teamId, roundNum, killStatus) => {
  fetch(FETCH_URL + "click_button", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ppt_id: participantId,
      team_id: teamId,
      which_round: roundNum,
      kill_status: killStatus,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
};