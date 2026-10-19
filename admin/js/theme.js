(function () {
    var KEY = "thaparNavAdmin.theme";
    var root = document.documentElement;
    var query = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

    function saved() {
        try {
            var value = window.localStorage.getItem(KEY);
            return value === "dark" || value === "light" ? value : null;
        } catch (error) {
            return null;
        }
    }

    function current() {
        return saved() || (query && query.matches ? "dark" : "light");
    }

    function label() {
        return current() === "dark" ? "Light mode" : "Dark mode";
    }

    function refresh() {
        var theme = current();
        document.querySelectorAll("img[src*='ti-logo-with-']").forEach(function (img) {
            var wanted = theme === "dark" ? "white" : "black";
            img.src = img.src.replace(/ti-logo-with-(black|white)-name/, "ti-logo-with-" + wanted + "-name");
        });
        var button = document.getElementById("theme-toggle-btn");
        if (button) {
            var text = button.querySelector(".side-bar-expanded-text");
            if (text) text.textContent = label();
            button.setAttribute("data-tooltip", label());
        }
    }

    function apply() {
        root.setAttribute("data-theme", current());
        refresh();
        document.dispatchEvent(new CustomEvent("themechange", { detail: current() }));
    }

    var sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = "./css/dark.css";
    document.head.appendChild(sheet);

    root.setAttribute("data-theme", current());

    document.addEventListener("DOMContentLoaded", refresh);
    document.addEventListener("shell-ready", refresh);

    document.addEventListener("click", function (event) {
        if (!event.target.closest("#theme-toggle-btn")) return;
        event.preventDefault();
        var next = current() === "dark" ? "light" : "dark";
        try {
            window.localStorage.setItem(KEY, next);
        } catch (error) {
            root.setAttribute("data-theme", next);
        }
        apply();
    });

    if (query) {
        var onSystem = function () {
            if (!saved()) apply();
        };
        if (query.addEventListener) query.addEventListener("change", onSystem);
        else if (query.addListener) query.addListener(onSystem);
    }

    window.ThaparAdminTheme = { get: current, label: label };
})();
