// const firebase = require("firebase/app");
// require('firebase/firestore') // If you need it
import firebase from "firebase/app";
import 'firebase/firestore' // If you need it

var clientCredentials = {
  apiKey: "AIzaSyDyh2bmXjOKZL75Iv51F3qISLsKp6Jkx_8",
  authDomain: "school-birthday.firebaseapp.com",
  projectId: "school-birthday",
  storageBucket: "school-birthday.appspot.com",
  messagingSenderId: "387956954279",
  appId: "1:387956954279:web:a249335b35c568a9dc3782",
};

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

export default firebase;
// module.exports = firebase







