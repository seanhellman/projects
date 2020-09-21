import { FETCH_URL, GRANT_TYPE, CLIENT_ID, CLIENT_SECRET } from "../constants";

export const signIn = (username, password) => {
  return fetch(FETCH_URL + "auth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: GRANT_TYPE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getDashboard = (username, access_token) => {
  return fetch(FETCH_URL + "api/users?user=" + username, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getAllTimeSlots = (access_token) => {
  return fetch(FETCH_URL + "api/timeslots", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getParticipantInfo = (userId, access_token) => {
  return fetch(FETCH_URL + "api/participants?user_id=" + userId, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getTeam = (participantId, shuffleNum) => {
  return fetch(FETCH_URL + `api/participants/${participantId}/team?which_shuffle=${shuffleNum}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
};
