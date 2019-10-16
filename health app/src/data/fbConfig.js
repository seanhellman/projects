import firebase from "firebase/app"
import "firebase/firestore";
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyB5MHY_F0Z1b0xB1Q05SxCk0vIAaGtgWng",
    authDomain: "health-app-8529b.firebaseapp.com",
    databaseURL: "https://health-app-8529b.firebaseio.com",
    projectId: "health-app-8529b",
    storageBucket: "health-app-8529b.appspot.com",
    messagingSenderId: "506227198033",
    appId: "1:506227198033:web:9529de82818a8873"
}

firebase.initializeApp(firebaseConfig);
export default firebase;