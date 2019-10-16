import {
  SET_LOGGED_EXERCISES,
  UPDATE_LOGGED_EXERCISES
} from "./exerciseActionConstants";
import { todayDate, yesterdayDate } from "./index";
import { setView } from "./viewActions";
import { VIEWS } from "../../constants/views";
import firebase from "../../data/fbConfig";

export const fetchLoggedExercises = userId => {
  return dispatch => {
    const today = todayDate();
    const db = firebase.firestore();
    const todayExerciseDiary = db
      .collection("users")
      .doc(userId)
      .collection("exercise_diary")
      .doc(today);
    todayExerciseDiary.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        const loggedExercises = docSnapshot.data().exercises;
        dispatch(setLoggedExercises(loggedExercises));
      }
    });
  };
};

export const setLoggedExercises = loggedExercises => ({
  type: SET_LOGGED_EXERCISES,
  payload: loggedExercises
});

export const logExercise = (userId, exercise, minutes) => {
  return dispatch => {
    const today = todayDate();
    const db = firebase.firestore();
    const todayExerciseDiary = db
      .collection("users")
      .doc(userId)
      .collection("exercise_diary")
      .doc(today);
    todayExerciseDiary.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        todayExerciseDiary.set(
          {
            exercises: {
              [exercise]: minutes
            }
          },
          { merge: true }
        );
        dispatch(updateExerciseMetaData(db, userId));
        dispatch(updateLoggedExercises(exercise, minutes));
        dispatch(setView(VIEWS.FOOD_EXERCISE_INPUT));
      } else {
        todayExerciseDiary.set({
          exercises: {
            [exercise]: minutes
          }
        });
        dispatch(updateLoggedExercises(exercise, minutes));
        dispatch(setView(VIEWS.FOOD_EXERCISE_INPUT));
      }
    });
  };
};

export const updateExerciseMetaData = (db, userId) => {
  return dispatch => {
    const metaRef = db
      .collection("users")
      .doc(userId)
      .collection("exercise_diary")
      .doc("meta");
    metaRef.get().then(doc => {
      if (doc.exists) {
        const metaData = doc.data();
        const lastDayRecorded = metaData.streak.lastDayRecorded;
        const today = todayDate();
        const yesterday = yesterdayDate();
        if (lastDayRecorded === yesterday) {
          const newDaysIn = metaData.streak.daysIn + 1;
          metaRef.set({
            streak: {
              daysIn: newDaysIn,
              lastDayRecorded: today
            }
          });
        } else if (lastDayRecorded === today) {
          return;
        } else {
          metaRef.set({
            streak: {
              daysIn: 1,
              lastDayRecorded: today
            }
          });
        }
      }
    });
  };
};

export const updateLoggedExercises = (exercise, minutes) => ({
  type: UPDATE_LOGGED_EXERCISES,
  payload: {
    exercise,
    minutes
  }
});
