// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByPhwZ4YzzAT-sYV-lerLuyLFsw-deSdg",
  authDomain: "pro-task-manager-ef65d.firebaseapp.com",
  projectId: "pro-task-manager-ef65d",
  storageBucket: "pro-task-manager-ef65d.firebasestorage.app",
  messagingSenderId: "465594319599",
  appId: "1:465594319599:web:d5f6a9e90ed6282536111a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);