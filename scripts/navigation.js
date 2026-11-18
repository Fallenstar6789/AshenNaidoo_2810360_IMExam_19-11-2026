// Build shared page navigation.
// Toggle mobile navigation menu.
// Shared navigation across the website
const navLinks = document.querySelector(".nav-links");
const inPages = window.location.pathname.includes("/pages/");
let sitePath = inPages ? "../" : "./";

navLinks.innerHTML = `
    <a href="${sitePath}index.html">HOME</a>
    <a href="${sitePath}pages/discover.html">DISCOVER</a>
    <a href="${sitePath}pages/games.html">GAMES</a>
`;

const menuButton = document.querySelector(".menu-button");
menuButton.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("show-menu");
    menuButton.setAttribute("aria-expanded", isOpen);
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";
navLinks.querySelectorAll("a").forEach(function (link) {
    if (link.getAttribute("href").split("/").pop() === currentPage) {
        link.setAttribute("aria-current", "page");
    }
});
