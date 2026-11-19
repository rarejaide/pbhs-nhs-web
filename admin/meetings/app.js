import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getDataConnect, queryRef, executeQuery } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-data-connect.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXOZId1Gh11zXtMF1kaspqX9RiN7oMTL8",
    authDomain: "pbhs-nhs-d1836.firebaseapp.com",
    projectId: "pbhs-nhs-d1836",
    storageBucket: "pbhs-nhs-d1836.firebasestorage.app",
    messagingSenderId: "785071480069",
    appId: "1:785071480069:web:84732933670424e758ab6c",
    measurementId: "G-1D1FNJWRDL"
};

// Must match dataconnect.yaml (serviceId + location) and connector.yaml (connectorId)
const connectorConfig = {
    connector: "example",
    service: "pbhs-nhs-d1836-service",
    location: "us-east4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dataConnect = getDataConnect(app, connectorConfig);

const listEl = document.getElementById("meetings-list");
const statusEl = document.getElementById("status");

// "2026-11-19" -> "November 19, 2026" (parsed as a local date so it never shifts a day)
function formatDate(value) {
    if (!value) return "No date";
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    const d = match ? new Date(+match[1], +match[2] - 1, +match[3]) : new Date(value);
    return isNaN(d)
        ? String(value)
        : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Small helper: <tag class="...">text</tag>
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text; // textContent avoids HTML injection
    return node;
}

// Build one meeting using the same structure as the markup in index.html
function addMeeting(meeting, index, all) {
    const number = all.length - index; // newest first, so the oldest meeting is #1

    const wrapper = el("div", "meeting");
    const details = document.createElement("details");

    // --- Collapsed header ---
    const summary = document.createElement("summary");
    const header = el("div", "meeting-header");
    header.append(
        el("p", "meeting-num", `#${number}`),
        el("p", "header-title important-heading", meeting.topic),
        el("p", "header-date", formatDate(meeting.date))
    );
    summary.appendChild(header);

    // --- Expanded information ---
    const info = el("div", "meeting-information");
    info.appendChild(el("h3", "important-heading info-title", meeting.topic));

    [
        ["Agenda", meeting.agenda],
        ["Notes", meeting.notes],
    ].forEach(([label, value]) => {
        info.appendChild(el("h4", "important-heading", label));
        info.appendChild(el("p", "meeting-text", value || "None recorded."));
    });

    details.append(summary, info);
    wrapper.appendChild(details);
    listEl.appendChild(wrapper);
}

async function loadMeetings() {
    statusEl.textContent = "Loading meetings...";
    listEl.innerHTML = "";
    try {
        const result = await executeQuery(queryRef(dataConnect, "ListMeetings"));
        const meetings = result.data.meetings ?? [];
        meetings.forEach(addMeeting);
        statusEl.textContent = meetings.length ? "" : "No meetings logged yet.";
    } catch (err) {
        console.error(err);
        statusEl.textContent = "Couldn't load meetings. Try refreshing.";
    }
}

// Only load once Firebase has restored the logged-in user
onAuthStateChanged(auth, (user) => {
    if (user) loadMeetings();
    else window.location.href = "../index.html"; // back to login
});