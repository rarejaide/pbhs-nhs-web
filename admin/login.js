import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    // apiKey: "AIzaSyArWKYht-KGGoestDSneUnVtlPXvQMm5qU",
    // authDomain: "pbhs-nhs-fe45c.firebaseapp.com",
    // projectId: "pbhs-nhs-fe45c",
    // storageBucket: "pbhs-nhs-fe45c.firebasestorage.app",
    // messagingSenderId: "177163659450",
    // appId: "1:177163659450:web:a93ccf188953bef5c73a83",
    // measurementId: "G-S5K702G6TV"
    apiKey: "AIzaSyAXOZId1Gh11zXtMF1kaspqX9RiN7oMTL8",
    authDomain: "pbhs-nhs-d1836.firebaseapp.com",
    projectId: "pbhs-nhs-d1836",
    storageBucket: "pbhs-nhs-d1836.firebasestorage.app",
    messagingSenderId: "785071480069",
    appId: "1:785071480069:web:84732933670424e758ab6c",
    measurementId: "G-1D1FNJWRDL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementsByClassName("login")[0];
//const errorEl = document.getElementById("error");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    //errorEl.textContent = "";
    const email = document.getElementsByClassName("cred")[0].value;
    const password = document.getElementsByClassName("cred")[1].value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard/index.html";
    } catch (error) {
        console.error("Login failed:", error.code);
        //errorEl.textContent = "Invalid email or password.";
    }
});

document.querySelector(".login").addEventListener("submit", (e) => {
    e.preventDefault();
    const [email, password] = [...e.target.querySelectorAll(".cred")].map((i) => i.value);
    handleLogin(email, password);
});