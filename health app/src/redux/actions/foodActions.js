import {
  EDAMAM_API_PARSER_URL,
  EDAMAM_API_NUTRITION_URL
} from "../../constants/api";
import { VIEWS } from "../../constants/views";
import {
  POPULATE_FOOD_SEARCH_RESULTS,
  CLEAR_FOOD_SEARCH_RESULTS,
  SET_ACTIVE_NUTRITION_DATA,
  SET_ACTIVE_FOOD,
  SET_LOGGED_FOOD,
  UPDATE_LOGGED_FOOD
} from "./foodActionConstants";
import { setView } from "./viewActions";
import { todayDate } from "./index";
import firebase from "../../data/fbConfig";

export const fetchFoodLoggedToday = userId => {
  return dispatch => {
    const today = todayDate();
    const db = firebase.firestore();
    const todayFoodDiary = db
      .collection("users")
      .doc(userId)
      .collection("food_diary")
      .doc(today);
    todayFoodDiary.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        const Raw = docSnapshot.data().foods;
        const Parsed = Raw.map(food => JSON.parse(food));
        dispatch(setFoodLoggedToday(Parsed));
      }
    });
  };
};

export const setFoodLoggedToday = loggedToday => ({
  type: SET_LOGGED_FOOD,
  payload: loggedToday
});

// this action fetches results from the edamam food database based on
// input provided by the user
export const fetchFood = food => {
  return dispatch => {
    // dispatch(foodSearchRequested());
    const url = buildApiUrl(food);
    fetch(url)
      .then(results => results.json())
      .then(data => {
        const results = data.hints;
        dispatch(populateFoodSearchResults(results));
      })
      .catch(error => {
        // dispatch(fetchError());
      });
  };
};

const buildApiUrl = food => {
  const parsedFood = food.replace(" ", "%20");
  return EDAMAM_API_PARSER_URL.replace("{parsedFood}", parsedFood);
};

export const populateFoodSearchResults = results => ({
  type: POPULATE_FOOD_SEARCH_RESULTS,
  payload: results
});

export const clearFoodSearchResults = () => ({
  type: CLEAR_FOOD_SEARCH_RESULTS
})

// this action triggers the process required to show the detailed view
// of a food result, including first setting the active foodId, next
// setting the active measure URI, and finally updating the view
export const renderFoodResultDetail = food => {
  return dispatch => {
    dispatch(setActiveFood(food));
    dispatch(fetchNutritionData(food.food.foodId, food.measures[0].uri));
  };
};

export const setActiveFood = food => ({
  type: SET_ACTIVE_FOOD,
  payload: food
});

// this action fetches nutrition database for a selected food given
// the foodId and measureURI returned from the Edamam GET api request
export const fetchNutritionData = (foodId, measureURI, quantity = 1) => {
  return dispatch => {
    const data = buildData(foodId, measureURI, quantity);
    fetch(EDAMAM_API_NUTRITION_URL, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
      .then(response => response.json())
      .then(data => {
        const nutritionData = data;
        dispatch(setActiveNutritionData(nutritionData));
        dispatch(setView(VIEWS.FOOD_RESULT_DETAIL));
      })
      .catch(error => {
        // dispatch(fetchError());
      });
  };
};

export const buildData = (foodId, measureURI, quantity) => {
  return {
    ingredients: [
      {
        quantity: quantity,
        measureURI: measureURI,
        foodId: foodId
      }
    ]
  };
};

export const setActiveNutritionData = nutritionData => ({
  type: SET_ACTIVE_NUTRITION_DATA,
  payload: nutritionData
});

// logs food to the database
export const logFoodToDatabase = (userId, nutritionData) => {
  return dispatch => {
    dispatch(updateLoggedFood(nutritionData));
    const addlCalories = nutritionData.calories;
    const addlCarbs =
      "CHOCDF" in nutritionData.totalNutrients
        ? nutritionData.totalNutrients.CHOCDF.quantity
        : 0;
    const addlFat =
      "FAT" in nutritionData.totalNutrients
        ? nutritionData.totalNutrients.FAT.quantity
        : 0;
    const addlProtein =
      "PROCNT" in nutritionData.totalNutrients
        ? nutritionData.totalNutrients.PROCNT.quantity
        : 0;
    const date = todayDate();
    const db = firebase.firestore();
    const dailyEntry = db
      .collection("users")
      .doc(userId)
      .collection("food_diary")
      .doc(date);
    dailyEntry.get().then(doc => {
      if (!doc.exists) {
        db.collection("users")
          .doc(userId)
          .collection("food_diary")
          .doc(date)
          .set({
            calories: addlCalories,
            foods: [JSON.stringify(nutritionData)],
            macros: {
              carbs: addlCarbs,
              fat: addlFat,
              protein: addlProtein
            }
          });
      } else {
        const docData = doc.data();
        const newCarbs = docData.macros.carbs + addlCarbs;
        const newFat = docData.macros.fat + addlFat;
        const newProtein = docData.macros.protein + addlProtein;
        db.collection("users")
        .doc(userId)
        .collection("food_diary")
        .doc(date)
        .update({
          calories: firebase.firestore.FieldValue.increment(addlCalories),
          foods: firebase.firestore.FieldValue.arrayUnion(
            JSON.stringify(nutritionData)
          ),
          macros: {
            carbs: newCarbs,
            fat: newFat,
            protein: newProtein
          }
        });
      }
    }).then(dispatch(setView(VIEWS.FOOD_EXERCISE_INPUT)));
  };
};

export const updateLoggedFood = nutritionData => ({
  type: UPDATE_LOGGED_FOOD,
  payload: nutritionData
})