import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmhF__oRrevuWM-dPQ-p7wym2eBHGvxig",
  authDomain: "pranitha-final-project.firebaseapp.com",
  databaseURL: "https://pranitha-final-project-default-rtdb.firebaseio.com",
  projectId: "pranitha-final-project",
  storageBucket: "pranitha-final-project.firebasestorage.app",
  messagingSenderId: "1052172715537",
  appId: "1:1052172715537:web:5717360c1b9c522a7d93b0",
  measurementId: "G-SG7PR7N0HV"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export default app;
