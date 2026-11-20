import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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
const db = getFirestore(app);

const listEl = document.getElementById("meetings-list");
const statusEl = document.getElementById("status");

// Escape text so notes/agenda can't inject HTML
function esc(str = "") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// Accepts a Firestore Timestamp, a JS Date, or a date string
function formatDate(value) {
    if (!value) return "No date";
    const date = value.toDate ? value.toDate() : new Date(value);
    if (isNaN(date)) return "No date";
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

// Keeps line breaks in multi-line agenda/notes text
function formatText(value) {
    return value ? esc(value).replace(/\n/g, "<br>") : "<em>Nothing recorded.</em>";
}

function renderMeeting(m, index, total) {
    // Newest meeting gets the highest number
    const num = m.number ?? total - index;
    return `
        <div class="meeting">
            <details>
                <summary>
                    <div class="meeting-header">
                        <p class="meeting-num">#${esc(String(num))}</p>
                        <p class="header-title important-heading">${esc(m.title || "Untitled meeting")}</p>
                        <p class="header-date">${formatDate(m.date)}</p>
                    </div>
                </summary>
                <div class="meeting-information">
                    <h3 class="important-heading info-title">${esc(m.title || "Untitled meeting")}</h3>
                    <h4 class="important-heading">Agenda</h4>
                    <p>${formatText(m.agenda)}</p>
                    <h4 class="important-heading">Notes</h4>
                    <p>${formatText(m.notes)}</p>
                </div>
            </details>
        </div>
    `;
}

async function loadMeetings() {
    statusEl.textContent = "Loading meetings...";
    listEl.innerHTML = "";

    try {
        const q = query(collection(db, "Meetings"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            statusEl.textContent = "No meetings logged yet.";
            return;
        }

        const meetings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        listEl.innerHTML = meetings
            .map((m, i) => renderMeeting(m, i, meetings.length))
            .join("");
        statusEl.textContent = "";
    } catch (err) {
        console.error("Failed to load meetings:", err);
        statusEl.textContent = "Couldn't load meetings. Check your connection or permissions.";
    }
}

loadMeetings();