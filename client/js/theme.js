(function () {
    var KEY = "thaparNav.theme";
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

    function swapLogos(theme) {
        var logos = document.querySelectorAll("img[src*='ti-logo-with-']");
        logos.forEach(function (img) {
            var wanted = theme === "dark" ? "white" : "black";
            if (img.id === "logo" && img.closest("#logo-and-search")) return;
            img.src = img.src.replace(/ti-logo-with-(black|white)-name/, "ti-logo-with-" + wanted + "-name");
        });
    }

    function apply() {
        var theme = current();
        root.setAttribute("data-theme", theme);
        if (document.body) swapLogos(theme);
        document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
        return theme;
    }

    var sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = "./css/dark.css";
    document.head.appendChild(sheet);

    root.setAttribute("data-theme", current());

    document.addEventListener("DOMContentLoaded", function () {
        swapLogos(current());
    });

    if (query) {
        var onSystem = function () {
            if (!saved()) apply();
        };
        if (query.addEventListener) query.addEventListener("change", onSystem);
        else if (query.addListener) query.addListener(onSystem);
    }

    window.ThaparTheme = {
        get: current,
        toggle: function () {
            var next = current() === "dark" ? "light" : "dark";
            try {
                window.localStorage.setItem(KEY, next);
            } catch (error) {
                root.setAttribute("data-theme", next);
            }
            return apply();
        },
        label: function () {
            return current() === "dark" ? "Light mode" : "Dark mode";
        }
    };
})();
