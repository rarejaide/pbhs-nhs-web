const requests = {
    tutoring: {
        form: document.getElementById("tutoring-requests"),
        button: document.getElementById("tutoring-btn"),
    },
    service: {
        form: document.getElementById("service-requests"),
        button: document.getElementById("service-btn"),
    }
};

requests.tutoring.button.onclick = () => {
    requests.tutoring.form.style.display = "block";
    requests.service.form.style.display = "none";
    requests.tutoring.button.className = "toggle-btn active";
    requests.service.button.className = "toggle-btn";
    receipt.style.display = "none";
};

requests.service.button.onclick = () => {
    requests.tutoring.form.style.display = "none";
    requests.service.form.style.display = "block";
    requests.service.button.className = "toggle-btn active";
    requests.tutoring.button.className = "toggle-btn";
    receipt.style.display = "none";
};