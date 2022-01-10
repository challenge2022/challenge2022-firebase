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
  apiKey: "AIzaSyD3M8q_l2iz8SaJ92XcyWkgrfBhKYLv3VA",
  authDomain: "challenge2020test.firebaseapp.com",
  projectId: "challenge2020test",
  storageBucket: "challenge2020test.appspot.com",
  messagingSenderId: "870118346352",
  appId: "1:870118346352:web:556db834d631edac9eaeb5",
  measurementId: "G-J90X6NZRVQ"
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