import {
  TOGGLE_WAITING_ROOM_STATUS,
  SET_CHAT_CLIENT,
  SET_ACTIVE_CHANNEL,
  SET_TIME_SLOT,
  SET_AUTH,
  SET_AUTH_INIT,
  SET_AUTH_ROLE,
  SET_AUTH_TOKEN,
  SET_AUTH_USER,
  SET_AUTH_LOADING,
  SET_AUTH_USER_ID,
  SET_PARTICIPANT_INFO,
  FETCH_STARTED,
  FETCH_SUCCESS,
  FETCH_ERROR,
  LOGOUT,
} from "./actionTypes";
import { TWILIO_SERVER } from "../constants";

const Chat = require("twilio-chat");

export const toggleWaitingRoomStatus = () => ({
  type: TOGGLE_WAITING_ROOM_STATUS,
});

export const setChatClient = (client) => ({
  type: SET_CHAT_CLIENT,
  payload: client,
});

export const setActiveChannel = (channel) => ({
  type: SET_ACTIVE_CHANNEL,
  payload: channel,
});

export const setTimeSlot = (timeSlot) => ({
  type: SET_TIME_SLOT,
  payload: timeSlot,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setFetchStarted = () => ({
  type: FETCH_STARTED,
});

export const setFetchSuccess = () => ({
  type: FETCH_SUCCESS,
});

export const setFetchError = () => ({
  type: FETCH_ERROR,
});

const fetchAccessToken = async (username) => {
  const response = await fetch(`${TWILIO_SERVER}/token`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identity: username }),
  });
  return response.json();
};

const connectMessagingClient = async (token) => {
  const client = Chat.Client.create(token);
  return client;
};

export const initClient = (username) => {
  return (dispatch) => {
    fetchAccessToken(username)
      .then((data) => {
        connectMessagingClient(data.jwt).then((client) => {
          // log events for this client
          client.on("channelJoined", (channel) => {
            console.log("Joined channel " + channel.friendlyName);
          });
          client.on("channelLeft", (channel) => {
            console.log("Left channel " + channel.friendlyName);
          });
          dispatch(setChatClient(client));
        });
      })
      .catch((error) => {
        console.log("Failed to fetch access token for " + username);
        console.log(error);
      });
  };
};

export const getChannel = (client, uniqueChannelName) => {
  return (dispatch) => {
    console.log("getChannel action");
    client.getChannelByUniqueName(uniqueChannelName).then((channel) => {
      console.log("Got channel: " + channel.friendlyName);
      dispatch(setActiveChannel(channel));
    });
  };
};

export const joinChannel = (channel) => {
  return (dispatch) => {
    channel.join();
  };
};

export const leaveChannel = (channel) => {
  return (dispatch) => {
    channel.leave();
  };
};

export const setAuth = (token, user, role, userId) => {
  return {
    type: SET_AUTH,
    payload: {
      loading: false,
      token,
      user,
      role,
      userId,
    },
  };
};

export const setAuthLoading = (loading) => ({
  type: SET_AUTH_LOADING,
  payload: { loading },
});

export const setAuthToken = (token) => ({
  type: SET_AUTH_TOKEN,
  payload: { token },
});

export const setAuthRole = (role) => ({
  type: SET_AUTH_ROLE,
  payload: { role },
});

export const setAuthUser = (user) => ({
  type: SET_AUTH_USER,
  payload: { user },
});

export const setAuthInit = () => ({
  type: SET_AUTH_INIT,
});

export const setAuthUserId = (userId) => ({
  type: SET_AUTH_USER_ID,
  payload: { userId },
});

export const setParticipantInfo = (info) => ({
  type: SET_PARTICIPANT_INFO,
  payload: info,
});