import { UPDATE_MESSAGES, SET_CHATROOM, CLEAR_MESSAGES} from "./chatRoomActionConstants";
import { sendMessage } from "../../client";

export const sendToServer = message => {
  return dispatch => {
      sendMessage(message, result => {
          console.log(result);
          dispatch(updateMessages(result));
      });
  }
}

export const updateMessages = messages => ({
  type: UPDATE_MESSAGES,
  payload: {
      messages
  }
});

export const updateChatroom = chatroom => ({
  type: SET_CHATROOM,
  payload: {
      chatroom
  }
})

export const clearMessages = () => {
  return {type: CLEAR_MESSAGES}
} 
