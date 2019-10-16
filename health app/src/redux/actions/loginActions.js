import firebase from "../../data/fbConfig";
import {
  FAILED_LOGIN,
  RESET_INVALID_MSG,
  SUCCESSFUL_LOGIN
} from "./loginActionConstants";
import { resetUser, loadUser } from "./userActions";
import { setView } from "./viewActions";
import { VIEWS } from "../../constants/views";
import { fetchFoodLoggedToday } from "./foodActions";
import { fetchLoggedExercises } from "./exerciseActions";

export const attemptLogin = (username, password, callback) => {
  return dispatch => {
    const database = firebase.firestore();
    database
      .collection("users")
      .where("username", "==", username)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size === 1) {
          const doc = querySnapshot.docs[0];
          if (doc.data().password === password) {
            dispatch(loadUser(doc.data(), doc.id));
            dispatch(fetchFoodLoggedToday(doc.id));
            dispatch(fetchLoggedExercises(doc.id));
            dispatch(successfulLogin());
            if (doc.data().onboardingComplete) {
              dispatch(setView(VIEWS.FOOD_EXERCISE_INPUT))
            } else {
              dispatch(setView(VIEWS.ONBOARDING))
            }
          } else {
            dispatch(failedLogin());
          }
        } else if (querySnapshot.size === 0) {
          dispatch(failedLogin());
        }
      });
    if (callback) {
      setTimeout(() => {
        callback();
      }, 600);
    }
  };
};

export const logOut = () => {
  return dispatch => {
    dispatch(resetUser());
    dispatch(setView(VIEWS.LOGIN_PAGE));
  };
};

export const successfulLogin = () => {
  return {
    type: SUCCESSFUL_LOGIN
  };
};

export const failedLogin = () => {
  return {
    type: FAILED_LOGIN
  };
};

export const resetInvalidMsg = () => {
  return {
    type: RESET_INVALID_MSG
  };
};
