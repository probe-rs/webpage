const root = document.firstElementChild;
const mediaQuery = "(prefers-color-scheme: dark)";
const mediaMatch = window.matchMedia;
const currentMode = mediaMatch(mediaQuery).matches;

const storeTheme = (targetTheme) => {
  root.setAttribute("data-theme", targetTheme);
  localStorage.setItem("data-theme", targetTheme);
};

const storedTheme =
  localStorage.getItem("data-theme") ?? (currentMode ? "dark" : "light");
storedTheme && storeTheme(storedTheme);

addEventListener(
  "DOMContentLoaded",
  () => {
    document
      .getElementById("switch-theme")
      .addEventListener("click", (_event) => {
        const currentTheme =
          localStorage.getItem("data-theme") ||
          getComputedStyle(root).getPropertyValue("color-scheme");
        storeTheme(currentTheme == "light" ? "dark" : "light");
      });

    mediaMatch(mediaQuery).addEventListener("change", (event) => {
      storeTheme(event.matches);
    });
  },
  false
);
