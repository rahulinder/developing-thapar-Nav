import { clearRole, clearVisitorName } from "./roles.js";

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "./css/drawer.css";
document.head.append(link);

function item(tag, props, label) {
    const node = document.createElement(tag);
    Object.assign(node, props);
    const heading = document.createElement("h1");
    heading.textContent = label;
    node.append(heading);
    return node;
}

const backdrop = document.createElement("div");
backdrop.id = "menu-backdrop";

const drawer = document.createElement("aside");
drawer.id = "menu-drawer";
drawer.setAttribute("aria-label", "Menu");
drawer.setAttribute("aria-hidden", "true");

const head = document.createElement("div");
head.className = "drawer-head";
const closeButton = document.createElement("button");
closeButton.type = "button";
closeButton.className = "drawer-close";
closeButton.setAttribute("aria-label", "Close menu");
const closeIcon = document.createElement("img");
closeIcon.src = "./assets/client-interface/balck-cross.svg";
closeIcon.alt = "";
closeButton.append(closeIcon);
head.append(closeButton);

const logout = item("button", { type: "button", className: "drawer-item" }, "Logout");

drawer.append(
    head,
    item("a", { href: "index.html" }, "Home"),
    item("a", { href: "user-option.html?next=index.html" }, "Change user type"),
    item("a", { href: "support.html" }, "Support"),
    logout
);
document.body.append(backdrop, drawer);

let opener = null;

function open(trigger) {
    opener = trigger || null;
    backdrop.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    closeButton.focus();
}

function close() {
    backdrop.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (opener) opener.focus();
}

document.addEventListener("click", (event) => {
    const trigger = event.target.closest('a[href="menu.html"]');
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
});

closeButton.addEventListener("click", close);
backdrop.addEventListener("click", close);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
});

logout.addEventListener("click", () => {
    clearRole();
    clearVisitorName();
    window.location.href = "login.html";
});
