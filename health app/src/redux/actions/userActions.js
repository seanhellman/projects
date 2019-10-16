import { LOAD_USER, RESET_USER, ADD_NEW_CHATROOM, COMPLETE_ONBOARDING } from './userActionConstants'
import client from '../../client';
import firebase from "../../data/fbConfig";


export const loadUser = (user, userId) => {
    let loadChatrooms = user.chatrooms ? user.chatrooms : [];
    let loadImageURL = user.imageURL ? user.imageURL : '';
    return {
        type: LOAD_USER,
        payload: {
            userId: userId,
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            chatrooms: loadChatrooms,
            socket: client(),
            onboardingComplete: user.onboardingComplete,
            imageURL: loadImageURL,
        }
    }
}

export const resetUser = () => {
    return {
        type: RESET_USER
    }
}

export const addNewChatroom = (chatroomName) => {
    return {
        type: ADD_NEW_CHATROOM,
        payload: chatroomName
    }
}

const onboardingComplete = () => ({type: COMPLETE_ONBOARDING});

export const completeOnboarding = user => {
  return dispatch => {
      const database = firebase.firestore();
      database.collection("users")
          .doc(user)
          .set({
              onboardingComplete: true
          }, { merge: true })
          .then(() => dispatch(onboardingComplete()))
          .catch(error => console.log(error));
  }
}