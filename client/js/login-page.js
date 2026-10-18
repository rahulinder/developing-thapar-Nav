import { getRole, getVisitorName, safeNextUrl, setVisitorName } from "./roles.js";
import { getContact, isValidContact, setContact } from "./visits.js";

const params = new URLSearchParams(window.location.search);
const next = safeNextUrl(params.get("next"));

if (getRole()) {
    window.location.replace(next);
}

const form = document.getElementById("credentials-card");
const nameInput = document.getElementById("visitor-name");
const contactInput = document.getElementById("visitor-contact");
nameInput.value = getVisitorName();
contactInput.value = getContact();

function goToRoleChoice() {
    window.location.href = `user-option.html?next=${encodeURIComponent(next)}`;
}

contactInput.addEventListener("input", () => contactInput.setCustomValidity(""));

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isValidContact(contactInput.value)) {
        contactInput.setCustomValidity("Enter a valid phone number or email address.");
        contactInput.reportValidity();
        return;
    }
    setVisitorName(nameInput.value);
    setContact(contactInput.value);
    goToRoleChoice();
});

document.getElementById("skip-btn").addEventListener("click", () => {
    setVisitorName("");
    setContact("");
    goToRoleChoice();
});
