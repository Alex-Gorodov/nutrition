import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBu9LPONvHFuNwNZfKtI7LWmzvKgWvPnJw",
  authDomain: "nutrition-2cda7.firebaseapp.com",
  projectId: "nutrition-2cda7",
  storageBucket: "nutrition-2cda7.firebasestorage.app",
  messagingSenderId: "315118088156",
  appId: "1:315118088156:web:8ce5083334a48d3eb7a919",
  measurementId: "G-0QXM78CKMP"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const database = firebase.database();
