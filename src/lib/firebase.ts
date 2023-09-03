// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu1kKtv4bT2mpbFRlbIj-CW30A59SCDaQ",
  authDomain: "klinnika-5ea40.firebaseapp.com",
  projectId: "klinnika-5ea40",
  storageBucket: "klinnika-5ea40.appspot.com",
  messagingSenderId: "2407716269",
  appId: "1:2407716269:web:5e0bc546fdb3104c7fbd24",
  measurementId: "G-K404XS6SCV"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth()

export {app, auth}
