import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
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
const db = getFirestore(app);

const form = document.querySelector("form.create");
const submitBtn = form.querySelector(".submit");
const val = (id) => document.getElementById(id).value.trim();

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = val("first-name");
    const lastName = val("last-name");
    const email = val("email");
    const password = document.getElementById("password").value;
    const gpa = parseFloat(val("gpa"));
    const gradeLevel = val("grade-level");
    const phoneNumber = val("phone-number");
    const timeJoined = val("time-joined");
    const position = val("position");

    if (!firstName || !lastName || !email || !password || !gradeLevel || !phoneNumber || !timeJoined || !position) {
        alert("Please fill out every field.");
        return;
    }
    if (Number.isNaN(gpa)) {
        alert("GPA must be a number.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "CREATING...";

    let cred;
    try {
        cred = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "Students", cred.user.uid), {
            firstName,
            lastName,
            email,
            GPA: gpa,
            gradeLevel: Number(gradeLevel),
            phoneNumber,
            timeJoined,
            position,
            createdAt: serverTimestamp(),
            hoursLeft:0,
            serviceHours:0,
            tutoringHours:0,
            probation: false,
            PFP:""
        });

        window.location.href = "../dashboard/index.html";
    } catch (error) {
        // If the account was created but the student doc failed, undo the account
        if (cred?.user) {
            try { await deleteUser(cred.user); } catch (_) {}
        }
        console.error("Signup failed:", error.code, error.message);
        alert(
            error.code === "auth/email-already-in-use" ? "That email already has an account." :
            error.code === "auth/weak-password" ? "Password must be at least 6 characters." :
            "Could not create account: " + error.message
        );
        submitBtn.disabled = false;
        submitBtn.textContent = "CREATE ACCOUNT";
    }
});