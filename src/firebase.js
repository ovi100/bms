
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyDD9brxQoyNsUR7CX1xnTwF2z6NvD2WcsE",
  authDomain: "electricity-bills-93e97.firebaseapp.com",
  projectId: "electricity-bills-93e97",
  storageBucket: "electricity-bills-93e97.appspot.com",
  messagingSenderId: "1035690593302",
  appId: "1:1035690593302:web:a35ee31f7427bb9eddb937"
};

const fireDB = firebase.initializeApp(config);

// Get a reference to the database service
const dbRef = fireDB.database().ref();

export default dbRef;