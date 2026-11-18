// Link cards to animal pages.
const animalName = new URLSearchParams(window.location.search).get("name");
if (animalName) document.getElementById("animal-heading").textContent = animalName;
