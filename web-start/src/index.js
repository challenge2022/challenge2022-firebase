/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  EmailAuthProvider
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  getDoc
} from 'firebase/firestore';


import { getFirebaseConfig } from './firebase-config.js';

import * as firebaseui from 'firebaseui';


async function signInEmail() {
  ui.start('#firebaseui-auth-container', uiConfig);
  signOutButtonElement.removeAttribute('hidden');
  profileButtonElement.removeAttribute('hidden');
}

// Signs-out of Challenge2022.
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
  hideProfile();
  signOutButtonElement.setAttribute('hidden', 'true');
  profileButtonElement.setAttribute('hidden', 'true');
}

// Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}

function getUserMail() {
  return getAuth().currentUser.email;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!getAuth().currentUser;
}


async function getProfile() {
const ref = doc(getFirestore(), getUserMail(),'Profile').withConverter(profileConverter);
const docSnap = await getDoc(ref);
if (docSnap.exists()) {
  // Convert to City object
  const profile = docSnap.data();
  ageInputElement.value = profile.age;
  yearlyGoalInputElement.value = profile.yearlyGoal;
  countyInputElement.value = profile.county;
  
  ageInputElement.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  yearlyGoalInputElement.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  countyInputElement.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  sexInputElement.value = profile.sex;
  sexInputElement.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  // Use a City instance method
  console.log(profile.toString());
} else {
  console.log("No such document!");
}
}

async function saveProfile(age, sex,yearlyGoal,county) {
  // Add a new message entry to the Firebase database.
  try {
    await setDoc(doc(getFirestore(), getUserMail(),'Profile'), {
      age: age,
      sex: sex,
      county:county,
      yearlyGoal:yearlyGoal,
      timestamp: serverTimestamp(),
      name: getUserName()
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}

// Saves a new message to Cloud Firestore.
async function saveMessage(messageText, continousCheck) {
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), getUserMail()), {
      quantity: messageText,
      continous: continousCheck,
      timestamp: serverTimestamp(),
      name: getUserName()
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}

// Triggered when the send new message form is submitted.
function onProfileSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if ((ageInputElement.value || sexInputElement.value|| yearlyGoalInputElement.value || countyInputElement.value ) && checkSignedInWithMessage()) {
    saveProfile(ageInputElement.value, sexInputElement.value,yearlyGoalInputElement.value, countyInputElement.value).then(function () {
      hideProfile();
    });
  }
}


// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value, messageContinousValue.checked).then(function () {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      hideRegistration();
      showRegistered();
    });
  }
}

function registerMore(e) {
  e.preventDefault();
  hideRegistered();
  showRegistration();
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage =
      'url(' + profilePicUrl + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');
    profileButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInEmailButtonElement.setAttribute('hidden', 'true');

    getProfile();

    // We save the Firebase Messaging Device token and enable notifications.
    //saveMessagingDeviceToken();
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');
    profileButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInEmailButtonElement.removeAttribute('hidden');
    resetMaterialTextfield(ageInputElement);
    resetMaterialTextfield(sexInputElement);
    resetMaterialTextfield(yearlyGoalInputElement);
    resetMaterialTextfield(countyInputElement);
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000,
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}


// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

function toggleProfileButton() {
  if (ageInputElement.value || sexInputElement.value || yearlyGoalInputElement.value || countyInputElement.value) {
    submitProfileButtonElement.removeAttribute('disabled');
  } else {
    submitProfileButtonElement.setAttribute('disabled', 'true');
  }
}

function toggleProfileForm() {
  if (profileFormElement.getAttribute('hidden')) {
    showProfile();
  } else {
   hideProfile();
  }
}
// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}


// Template for messages.
var MESSAGE_TEMPLATE =
  '<div class="message-container">' +
  '<div class="spacing"><div class="pic"></div></div>' +
  '<div class="message"></div>' +
  '<div class="name"></div>' +
  '</div>';




// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var messageContinousValue = document.getElementById('continous');
var submitButtonElement = document.getElementById('submit');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');
var signInEmailButtonElement = document.getElementById('sign-inEmail');
var responseFormElement = document.getElementById('response-form');
var responseMoreButtonElement = document.getElementById('more');
var ageInputElement = document.getElementById('age');
var sexInputElement = document.getElementById('sex');
var countyInputElement = document.getElementById('county');
var yearlyGoalInputElement = document.getElementById('yearlyGoal');
var submitProfileButtonElement = document.getElementById('submitProfile');
var profileFormElement = document.getElementById('profile-form');
var profileButtonElement = document.getElementById('profile');

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener('click', signOutUser);
signInEmailButtonElement.addEventListener('click', signInEmail);
responseMoreButtonElement.addEventListener('click', registerMore);
submitProfileButtonElement.addEventListener('click', onProfileSubmit);
profileButtonElement.addEventListener('click', toggleProfileForm);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

ageInputElement.addEventListener('keyup', toggleProfileButton);
ageInputElement.addEventListener('change', toggleProfileButton);
sexInputElement.addEventListener('keyup', toggleProfileButton);
sexInputElement.addEventListener('change', toggleProfileButton);
yearlyGoalInputElement.addEventListener('keyup', toggleProfileButton);
yearlyGoalInputElement.addEventListener('change', toggleProfileButton);
countyInputElement.addEventListener('keyup', toggleProfileButton);
countyInputElement.addEventListener('change', toggleProfileButton);



function showProfile() {
  profileFormElement.removeAttribute('hidden');
 // getProfile();
}

function hideProfile() {
  profileFormElement.setAttribute('hidden', 'true');
  submitProfileButtonElement.setAttribute('disabled', 'true');
}

function showRegistration() {
  messageFormElement.removeAttribute('hidden');
  messageContinousValue.removeAttribute('disabled');
}

function hideRegistration() {
  messageContinousValue.setAttribute('disabled', true);
  messageFormElement.setAttribute('hidden', true);
}

function showRegistered() {
  responseFormElement.removeAttribute('hidden');
  responseMoreButtonElement.removeAttribute('disabled');
}

function hideRegistered() {
  responseMoreButtonElement.setAttribute('disabled', true);
  responseFormElement.setAttribute('hidden', true);
}

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

initFirebaseAuth();

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(getAuth());

  class Profile {
    constructor (name, age, sex,yearlyGoal,county ) {
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.yearlyGoal=yearlyGoal;
        this.county=county
    }
    toString() {
        return this.name + ', ' + this.age + ', ' + this.sex+ ', '+this.yearlyGoal+', '+this.county;
    }
}

// Firestore data converter
const profileConverter = {
    toFirestore: (profile) => {
        return {
            name: profile.name,
            state: profile.age,
            country: profile.sex,
            county:profile.county,
            yearlyGoal:profile.yearlyGoal
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Profile(data.name, data.age, data.sex,data.yearlyGoal,data.county);
    }
};
