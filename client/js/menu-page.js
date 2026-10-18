import { clearRole, clearVisitorName } from "./roles.js";

document.getElementById("menu-close").addEventListener("click", () => {
    if (window.history.length > 1 && document.referrer) {
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
});

document.getElementById("logout-button").addEventListener("click", () => {
    clearRole();
    clearVisitorName();
    window.location.href = "login.html";
});

const themeButton = document.getElementById("theme-button");
const themeLabel = themeButton.querySelector("h1");
themeLabel.textContent = window.ThaparTheme.label();
themeButton.addEventListener("click", () => {
    window.ThaparTheme.toggle();
});
document.addEventListener("themechange", () => {
    themeLabel.textContent = window.ThaparTheme.label();
});
