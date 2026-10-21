import { getRole, getVisitorName, isLoginPending, safeNextUrl, setLoginPending, setVisitorName } from "./roles.js";
import { getContact, getRollNo, isValidContact, isValidRollNo, setContact, setRollNo } from "./visits.js";

const params = new URLSearchParams(window.location.search);
const next = safeNextUrl(params.get("next"));
const role = getRole();

if (!role) {
    window.location.replace(`user-option.html?next=${encodeURIComponent(next)}`);
} else if (!isLoginPending()) {
    window.location.replace(next);
}

const isStudent = role === "student";
const form = document.getElementById("credentials-card");
const nameInput = document.getElementById("visitor-name");
const contactInput = document.getElementById("visitor-contact");
const rollInput = document.getElementById("visitor-roll");
nameInput.value = getVisitorName();
contactInput.value = getContact();
rollInput.value = getRollNo();

document.getElementById("contact-field").hidden = isStudent;
document.getElementById("roll-field").hidden = !isStudent;
contactInput.required = !isStudent;
rollInput.required = isStudent;

function finish() {
    setLoginPending(false);
    window.location.href = next;
}

contactInput.addEventListener("input", () => contactInput.setCustomValidity(""));
rollInput.addEventListener("input", () => rollInput.setCustomValidity(""));

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isStudent) {
        if (!isValidRollNo(rollInput.value)) {
            rollInput.setCustomValidity("Enter a valid roll number (letters and digits only).");
            rollInput.reportValidity();
            return;
        }
        setRollNo(rollInput.value);
    } else {
        if (!isValidContact(contactInput.value)) {
            contactInput.setCustomValidity("Enter a valid phone number or email address.");
            contactInput.reportValidity();
            return;
        }
        setContact(contactInput.value);
    }
    setVisitorName(nameInput.value);
    finish();
});

document.getElementById("skip-btn").addEventListener("click", () => {
    setVisitorName("");
    setContact("");
    setRollNo("");
    finish();
});
