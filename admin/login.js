import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyArWKYht-KGGoestDSneUnVtlPXvQMm5qU",
    authDomain: "pbhs-nhs-fe45c.firebaseapp.com",
    projectId: "pbhs-nhs-fe45c",
    storageBucket: "pbhs-nhs-fe45c.firebasestorage.app",
    messagingSenderId: "177163659450",
    appId: "1:177163659450:web:a93ccf188953bef5c73a83",
    measurementId: "G-S5K702G6TV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard/index.html";
    } catch (error) {
        console.error("Login failed:", error.code);
        errorEl.textContent = "Invalid email or password.";
    }
});