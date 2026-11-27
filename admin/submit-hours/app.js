import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
    getFirestore, collection, doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ---------- Firebase setup ----------
// Paste the config from Firebase Console > Project Settings for the project
// you're actually using (the error showed pbhs-nhs-d1836). It must match login.js.
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

const tutoringForm = document.getElementById("tutoring-form");
const submitBtn = document.getElementById("submit-tutoring");
const receipt = document.getElementById("submission-receipt");

let currentUser = null;
onAuthStateChanged(auth, (user) => { currentUser = user; });

// ---------- Toggle between tutoring / service ----------
const hours = {
    tutoring: {
        form: document.getElementById("tutoring-form-cont"),
        button: document.getElementById("tutoring-btn"),
    },
    service: {
        form: document.getElementById("service-form-cont"),
        button: document.getElementById("service-btn"),
    }
};

hours.tutoring.button.onclick = () => {
    hours.tutoring.form.style.display = "block";
    hours.service.form.style.display = "none";
    hours.tutoring.button.className = "toggle-btn active";
    hours.service.button.className = "toggle-btn";
    receipt.style.display = "none";
};

hours.service.button.onclick = () => {
    hours.tutoring.form.style.display = "none";
    hours.service.form.style.display = "block";
    hours.service.button.className = "toggle-btn active";
    hours.tutoring.button.className = "toggle-btn";
    receipt.style.display = "none";
};

// ---------- Image compression (keeps docs under Firestore's 1 MiB limit) ----------
const MAX_IMAGE_BYTES = 400_000; // per image

async function fileToCompressedDataUrl(file) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

    let maxDim = 900;
    let quality = 0.6;

    for (let attempt = 0; attempt < 6; attempt++) {
        const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length <= MAX_IMAGE_BYTES) {
            bitmap.close();
            return dataUrl;
        }
        maxDim = Math.round(maxDim * 0.8);
        quality = Math.max(0.35, quality - 0.05);
    }

    bitmap.close();
    throw new Error("Image could not be compressed enough");
}

// ---------- Tutoring submission ----------


const val = (id) => document.getElementById(id).value.trim();

tutoringForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert("You need to be logged in to submit hours.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
        const requestRef = doc(collection(db, "hour-requests"));

        const proofFile = document.getElementById("proof-photo").files[0];
        const assignmentFile = document.getElementById("assignment-photo").files[0];

        const [proofPhoto, assignmentPhoto] = await Promise.all([
            fileToCompressedDataUrl(proofFile),
            fileToCompressedDataUrl(assignmentFile),
        ]);

        await setDoc(requestRef, {
            type: "tutoring",
            status: "pending",
            submittedBy: currentUser.uid,
            submittedByEmail: currentUser.email,
            createdAt: serverTimestamp(),

            tutorName: val("tutor-name"),
            studentName: val("student-name"),
            nhsAssigned: document.getElementById("nhs-assigned").checked,

            date: val("tutoring-date"),
            timeOfDay: document.getElementById("tutoring-time").value,
            subject: val("tutoring-subject"),
            durationHours: Number(val("tutoring-duration")),

            proofPhoto,
            assignmentPhoto,

            tutorSignature: val("tutor-signature"),
            tuteeSignature: val("tutee-signature"),
        });

        tutoringForm.reset();
        tutoringForm.style.display = "none";
        receipt.style.display = "block";
    } catch (err) {
        console.error("Submission failed:", err);
        alert("Something went wrong submitting your hours. Please try again.");
        submitBtn.disabled = false;
        submitBtn.textContent = "SUBMIT HOURS";
    }
});