/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
// Import the functions you need from the SDKs you need
//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
//import {getAuth, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyA04T7-OEjZ9lHxndn4BdBOZU9M1Chcyns",
  authDomain: "challenge-2022.firebaseapp.com",
  projectId: "challenge-2022",
  storageBucket: "challenge-2022.appspot.com",
  messagingSenderId: "360765442181",
  appId: "1:360765442181:web:513b020af3bcb4d33c41ec",
  measurementId: "G-DVCQKBKNN7"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//auth.getAuth();
//const analytics = getAnalytics(app);

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}