// Fetch requested animal details.
// Retrieve Wikipedia summary images.
// Handle missing API results.
// Animal information is requested only when this page is opened.
const animalName = (new URLSearchParams(window.location.search).get("name") || "").trim();
const statusBox = document.getElementById("animal-status");
const profile = document.getElementById("animal-profile");
const apiKey = API_NINJAS_KEY;

// Run set status logic.

function setStatus(message) {
    statusBox.textContent = message;
    statusBox.hidden = false;
}
// Run show value logic.
function showValue(id, value) {
    document.getElementById(id).textContent = value || "Information unavailable";
}
// Run get property logic.
function getProperty(object, key) {
    return object && object[key] ? object[key] : "";
}
// Run format range logic.
function formatRange(min, max, unit) {
    if (!min && !max) return "Information unavailable";
    if (min && max) return min === max ? min + " " + unit : min + "–" + max + " " + unit;
    return (min || max) + " " + unit;
}
// Run load wikipedia logic.
async function loadWikipedia(name) {
    const wikiNames = {"Grey Wolf":"Gray wolf", "African Elephant":"African bush elephant", "Plains Zebra":"Plains zebra", "Galápagos Giant Tortoise":"Galápagos tortoise"};
    const title = wikiNames[name] || name;
    try {
        const response = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title));
        if (!response.ok) throw new Error("Wikipedia unavailable");
        const data = await response.json();
        showValue("animal-description", data.extract || "Description unavailable.");
        const photo = (data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source);
        if (photo) {
            const img = document.getElementById("animal-image");
            img.onload = function () { img.hidden = false; document.getElementById("image-fallback").hidden = true; };
            img.onerror = function () { document.getElementById("image-fallback").textContent = "Photograph unavailable"; };
            img.src = photo;
            img.alt = name + " photograph";
        } else {
            document.getElementById("image-fallback").textContent = "Photograph unavailable";
        }
    } catch (error) {
        showValue("animal-description", "Description currently unavailable.");
        document.getElementById("image-fallback").textContent = "Photograph unavailable";
    }
}
// Run load animal logic.
async function loadAnimal(name) {
    setStatus("Loading information about " + name + "...");
    profile.hidden = true;
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/animals?name=" + encodeURIComponent(name), {
            headers: {"X-Api-Key": apiKey}
        });
        if (response.status === 401 || response.status === 403) {
            setStatus("API Ninjas rejected the API key. Please check your configuration.");
            return;
        }
        if (!response.ok) throw new Error("API Ninjas returned status " + response.status);
        const results = await response.json();
        if (!Array.isArray(results) || results.length === 0) {
            setStatus("Animal is not in our system Yet, Please try again");
            return;
        }
        // Prefer an exact match if the API returns several related species.
        const animal = results.find(function (item) { return item.name.toLowerCase() === name.toLowerCase(); }) || results[0];
        const characteristics = animal.characteristics || {};
        const taxonomy = animal.taxonomy || {};
        document.getElementById("animal-title").textContent = animal.name.toUpperCase();
        showValue("scientific-name", getProperty(taxonomy,"scientific_name") || (getProperty(taxonomy,"genus") && getProperty(taxonomy,"species") ? taxonomy.genus + " " + taxonomy.species : "Scientific name unavailable"));
        showValue("animal-type", getProperty(characteristics,"type") || getProperty(taxonomy,"class"));
        showValue("animal-diet", getProperty(characteristics,"diet"));
        showValue("animal-lifespan", getProperty(characteristics,"lifespan"));
        showValue("animal-size", getProperty(characteristics,"length") || getProperty(characteristics,"height") || getProperty(characteristics,"size"));
        showValue("animal-weight", getProperty(characteristics,"weight"));
        profile.hidden = false;
        statusBox.hidden = true;
        loadWikipedia(animal.name);
        if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.from(".animal-left", {opacity:0, x:-35, duration:0.7});
            gsap.from(".animal-facts", {opacity:0, x:35, duration:0.7, delay:0.15});
            gsap.from(".animal-facts tr", {opacity:0, x:14, duration:0.4, stagger:0.08, delay:0.35, clearProps:"all"});
            gsap.from(".animal-description", {opacity:0, y:12, duration:0.5, delay:0.3, clearProps:"all"});
        }
    } catch (error) {
        setStatus("Unable to load animal information right now. Please check your connection and try again.");
    }
}
if (animalName) {
    document.getElementById("animal-name").value = animalName;
    loadAnimal(animalName);
} else {
    setStatus("Search for an animal above, or select Learn More from a category.");
}
