import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { initializeApp } from '@firebase/app';
import { getAuth, browserSessionPersistence } from '@firebase/auth';
import { connectFunctionsEmulator, getFunctions } from '@firebase/functions';


const firebaseConfig = {
  apiKey: "AIzaSyDmwhMPoJvTS99CCGtRw7x7LWovb9XxQs4",
  authDomain: "sessions-e4f78.firebaseapp.com",
  databaseURL: "https://sessions-e4f78-default-rtdb.firebaseio.com",
  projectId: "sessions-e4f78",
  storageBucket: "sessions-e4f78.appspot.com",
  messagingSenderId: "1078318421930",
  appId: "1:1078318421930:web:df1e929ed176d4c5a77dd3",
  measurementId: "G-LRS6NK8TER"
};

let firebaseApp = null;
if (typeof window !== undefined) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

const db = firebaseApp;

export const auth = getAuth(db);

export {db};