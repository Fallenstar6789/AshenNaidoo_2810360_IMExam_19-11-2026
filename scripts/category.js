// Build selected animal cards.
// Load Wikipedia animal photographs.
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category") || "carnivores";
const animalGrid = document.getElementById("animal-grid");
const title = document.getElementById("category-title");
const wikipediaNames = {"Grey Wolf":"Wolf", "African Elephant":"African bush elephant", "Plains Zebra":"Plains zebra", "White Rhinoceros":"White rhinoceros", "Green Anaconda":"Green anaconda", "Chameleon":"Chameleon", "Octopus":"Octopus", "Seahorse":"Seahorse"};

if (!animalCategories[selectedCategory]) {
    title.textContent = "CATEGORY NOT FOUND";
    animalGrid.innerHTML = '<p>Choose a category from <a href="discover.html">Discover</a>.</p>';
} else {
    title.textContent = categoryNames[selectedCategory];
    animalCategories[selectedCategory].forEach(function (animal) {
        const card = document.createElement("article");
        card.className = "animal-card";
        const image = document.createElement("div");
        image.className = "animal-card-image";
        image.textContent = "Loading image...";
        const details = document.createElement("div");
        details.className = "animal-card-details";
        const heading = document.createElement("h2");
        heading.textContent = animal.toUpperCase();
        const link = document.createElement("a");
        link.className = "learn-more";
        link.textContent = "Learn More";
        link.href = "animal.html?name=" + encodeURIComponent(animal);
        details.append(heading, link);
        card.append(image, details);
        animalGrid.appendChild(card);
        loadAnimalImage(animal, image);
    });
    
    if (typeof gsap !== "undefined") {
        gsap.from(".animal-card", {opacity: 0, y: 35, duration: 0.6, stagger: 0.09, ease: "power2.out", clearProps: "all"});
    }
}

// Run load animal image logic.
async function loadAnimalImage(animal, container) {
    const wikiTitle = wikipediaNames[animal] || animal;
    try {
        const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(wikiTitle);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Image unavailable");
        const data = await response.json();
        const imageUrl = (data.thumbnail && data.thumbnail.source) || (data.originalimage && data.originalimage.source);
        if (!imageUrl) throw new Error("No image");
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = animal;
        image.loading = "lazy";
        image.onerror = function () { container.textContent = "Image unavailable"; };
        container.replaceChildren(image);
    } catch (error) {
        container.textContent = "Image unavailable";
    }
}
