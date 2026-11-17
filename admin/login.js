import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
// (You can find this in your Firebase Console Project Settings!)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "pbhs-nhs-fe45c.firebaseapp.com",
    projectId: "pbhs-nhs-fe45c",
    storageBucket: "pbhs-nhs-fe45c.firebasestorage.app",
    messagingSenderId: "177163659450",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Call this function when the login form is submitted
async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Successfully logged in:", user.email);
        // Redirect your member to their dashboard here!
        window.location.href = "https://pbhs-nhs-web.vercel.app/admin/dashboard/";
    } catch (error) {
        console.error("Login failed:", error.code, error.message);
        // Display an error message to your user (e.g., "Invalid password")
    }
}
