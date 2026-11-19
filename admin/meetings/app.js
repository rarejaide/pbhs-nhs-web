import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// ---- CONFIG: fill these in from your Firebase console ----
const CONFIG = {
    firebase: {
        apiKey: "AIzaSyArWKYht-KGGoestDSneUnVtlPXvQMm5qU",
        authDomain: "pbhs-nhs-fe45c.firebaseapp.com",
        projectId: "pbhs-nhs-fe45c",
        appId: "1:177163659450:web:a93ccf188953bef5c73a83",
    },
    dataConnect: {
        location: "us-east4",   // region of your Data Connect service
        service: "pbhs-nhs-fe45c-service", // from dataconnect.yaml (serviceId)
        connector: "default",       // from connector.yaml (connectorId)
        operation: "ListMeetings",  // name of your GraphQL query
    },
};

const app = initializeApp(CONFIG.firebase);
const auth = getAuth(app);

const tbody = document.querySelector("#meetings-log-table tbody");
const statusEl = document.getElementById("status");

// Call a Data Connect query through the REST API
async function executeQuery(operationName, variables = {}) {
    const { location, service, connector } = CONFIG.dataConnect;
    const token = await auth.currentUser.getIdToken();

    const url =
    `https://firebasedataconnect.googleapis.com/v1/projects/${CONFIG.firebase.projectId}` +
    `/locations/${location}/services/${service}/connectors/${connector}:executeQuery`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: `projects/${CONFIG.firebase.projectId}/locations/${location}/services/${service}/connectors/${connector}`, operationName, variables }),
    });

    if (!res.ok) throw new Error(`Data Connect error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
}

// Build one <tr> from one meeting record (textContent avoids HTML injection)
function addMeetingRow(meeting) {
    const tr = document.createElement("tr");
    const cells = [
        formatDate(meeting.date),
        meeting.title,
        meeting.location,
        meeting.attendance,
        meeting.notes,
    ];
    cells.forEach((value) => {
    const td = document.createElement("td");
    td.textContent = value ?? "—";
    tr.appendChild(td);
    });
    tbody.appendChild(tr);
}

function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d) ? value : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

async function loadMeetings() {
    statusEl.textContent = "Loading meetings...";
    tbody.innerHTML = "";
    try {
        const data = await executeQuery(CONFIG.dataConnect.operation);
        const meetings = data.meetings ?? []; // key = the field name in your GraphQL query
        meetings.forEach(addMeetingRow);
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