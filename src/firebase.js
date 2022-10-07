import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "reels-clone-62dfc.firebaseapp.com",
    projectId: "reels-clone-62dfc",
    storageBucket: "reels-clone-62dfc.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_KEY,
    appId: process.env.REACT_APP_FIRBASE_APP_KEY
  };

  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);
  export const auth = getAuth();
  export const storage = getStorage(app)

  