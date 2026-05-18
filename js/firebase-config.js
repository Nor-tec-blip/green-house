// Firebase Configuration
// Project: monitoring-iot-29ac6

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE88gFIwE3gxH52qEgkr6zmVSxH8kZp1Y",
  authDomain: "greenhousex-38d4c.firebaseapp.com",
  databaseURL: "https://greenhousex-38d4c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "greenhousex-38d4c",
  storageBucket: "greenhousex-38d4c.firebasestorage.app",
  messagingSenderId: "527631702104",
  appId: "1:527631702104:web:51f8f1e2d4c9e2cd7f922d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
