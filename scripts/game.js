
 // Store twenty animal answers.
 // Manage attempts and clues.
 // Reveal final animal identity.
 // Game animals are stored locally.
 // No API requests during play.
 // All six clues are stored.

const gameAnimals = [
    ["Lion", "Panthera leo", "Carnivore", "Zebras, antelope and other mammals", "10-14 years", "1.4-2.5 m long", "120-250 kg"],
    ["Tiger", "Panthera tigris", "Carnivore", "Deer, wild boar and other mammals", "10-15 years", "2-3.3 m long", "65-300 kg"],
    ["Elephant", "Loxodonta africana", "Herbivore", "Grass, leaves, bark and fruit", "60-70 years", "2.5-4 m tall", "2,700-6,000 kg"],
    ["Giraffe", "Giraffa camelopardalis", "Herbivore", "Leaves, especially acacia", "20-25 years", "4.3-5.7 m tall", "550-1,930 kg"],
    ["Zebra", "Equus quagga", "Herbivore", "Grasses", "20-25 years", "1.1-1.5 m at shoulder", "175-385 kg"],
    ["Penguin", "Aptenodytes forsteri", "Carnivore", "Fish, krill and squid", "15-20 years", "1-1.2 m tall", "23-45 kg"],
    ["Dolphin", "Tursiops truncatus", "Carnivore", "Fish and squid", "40-60 years", "2-4 m long", "150-650 kg"],
    ["Cheetah", "Acinonyx jubatus", "Carnivore", "Gazelles and small antelope", "10-12 years", "1.1-1.5 m body length", "21-72 kg"],
    ["Gorilla", "Gorilla gorilla", "Herbivore", "Leaves, stems and fruit", "35-40 years", "1.2-1.8 m tall", "70-200 kg"],
    ["Kangaroo", "Macropus rufus", "Herbivore", "Grasses and shrubs", "12-18 years", "0.9-1.6 m body length", "18-90 kg"],
    ["Flamingo", "Phoenicopterus roseus", "Omnivore", "Algae, crustaceans and small invertebrates", "20-30 years", "1.1-1.5 m tall", "2-4 kg"],
    ["Crocodile", "Crocodylus niloticus", "Carnivore", "Fish, birds and mammals", "45-75 years", "3-5 m long", "225-750 kg"],
    ["Koala", "Phascolarctos cinereus", "Herbivore", "Eucalyptus leaves", "10-15 years", "60-85 cm long", "4-15 kg"],
    ["Rhinoceros", "Ceratotherium simum", "Herbivore", "Grasses", "35-50 years", "3.4-4.2 m long", "1,800-2,700 kg"],
    ["Okapi", "Okapia johnstoni", "Herbivore", "Leaves, buds and fungi", "20-30 years", "1.9-2.5 m long", "200-350 kg"],
    ["Axolotl", "Ambystoma mexicanum", "Carnivore", "Worms, insects and small aquatic animals", "10-15 years", "15-30 cm long", "60-200 g"],
    ["Pangolin", "Smutsia temminckii", "Insectivore", "Ants and termites", "About 20 years", "30-90 cm body length", "2-33 kg"],
    ["Fossa", "Cryptoprocta ferox", "Carnivore", "Lemurs and other small animals", "15-20 years", "70-80 cm body length", "5.5-8.6 kg"],
    ["Narwhal", "Monodon monoceros", "Carnivore", "Fish, squid and shrimp", "30-50 years", "4-5.5 m long", "800-1,600 kg"],
    ["Cassowary", "Casuarius casuarius", "Frugivore", "Fruit, fungi and small animals", "40-50 years", "1.5-1.8 m tall", "29-59 kg"]
];

// Store the clue headings.
const clueLabels = [
    "Scientific name",
    "Type",
    "Diet",
    "Lifespan",
    "Size",
    "Weight"
];

// Explain the clue categories.
const explanations = [
    "A scientific name is the internationally recognised two-part Latin name used to identify a species.",
    "Animal type describes its broad feeding group, such as carnivore, herbivore or omnivore.",
    "Diet means the foods an animal usually eats to survive.",
    "Lifespan is the typical length of time an animal lives.",
    "Size describes an animal's length or height, depending on the species.",
    "Weight describes how heavy an animal is, usually measured in grams or kilograms."
];

// Get the HTML elements.
const factBox = document.getElementById("game-facts");
const nameBox = document.getElementById("game-name");
const feedback = document.getElementById("game-feedback");
const attemptsBox = document.getElementById("attempts");
const hintButton = document.getElementById("hint-button");
const giveUp = document.getElementById("give-up");
const again = document.getElementById("play-again");
const input = document.getElementById("guess-input");
const form = document.getElementById("guess-form");
const photo = document.getElementById("game-animal-image");
const mystery = document.getElementById("game-mystery");
const fallback = document.getElementById("game-image-fallback");

// Store the current game state.
let current = null;
let previous = -1;
let attempts = 15;
let revealed = new Set();
let finished = false;


// Shuffle the array randomly.
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


// Animate elements using GSAP.
function animate(target, settings) {

    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        gsap.fromTo(
            target,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.42, ...settings }
        );
    }
}


// Display the term explanation.
function term(index) {

    document.getElementById("term-title").textContent =
        "Term: " + clueLabels[index];

    document.getElementById("term-description").textContent =
        explanations[index];

    animate(document.getElementById("term-box"));
}


// Create the clue rows.
function drawFacts() {

    factBox.replaceChildren();

    clueLabels.forEach((label, index) => {

        const row = document.createElement("div");

        row.className = "game-fact" +
            (revealed.has(index) ? " is-revealed" : "");

        const title = document.createElement("span");
        title.className = "game-fact-label";
        title.textContent = label + ":";

        const value = document.createElement("span");
        value.className = "game-fact-value";

        if (revealed.has(index)) {
            value.textContent = current[index + 1];
        } else {
            value.textContent = "????????";
        }

        row.append(title, value);

        // Make revealed clues clickable.
        if (revealed.has(index)) {

            row.tabIndex = 0;
            row.setAttribute("role", "button");
            row.setAttribute("aria-label", "Explain " + label);

            row.addEventListener("click", () => {
                term(index);
            });

            row.addEventListener("keydown", (e) => {

                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    term(index);
                }

            });
        }

        factBox.append(row);
    });

    animate(factBox);

    // Animate the revealed clues.
    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

        gsap.from(".game-fact.is-revealed", {
            opacity: 0,
            x: -9,
            duration: 0.3,
            stagger: 0.055,
            clearProps: "all"
        });
    }
}


// Update the remaining attempts.
function updateAttempts() {

    attemptsBox.textContent = attempts + "/15 attempts";

    hintButton.disabled =
        finished || attempts < 2 || revealed.size === 6;

    // Animate the attempt counter.
    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

        gsap.fromTo(
            attemptsBox,
            { scale: 1.16 },
            {
                scale: 1,
                duration: 0.36,
                ease: "back.out(2)",
                overwrite: true
            }
        );
    }
}


// Display the feedback message.
function message(text, success = false) {

    feedback.textContent = text;
    feedback.classList.toggle("success", success);

    animate(feedback);
}


// Format guesses for comparison.
function normalise(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}


// Store alternative animal names.
const acceptedNames = {
    Elephant: ["african elephant", "african bush elephant"],
    Zebra: ["plains zebra"],
    Penguin: ["emperor penguin"],
    Dolphin: ["bottlenose dolphin"],
    Gorilla: ["western gorilla"],
    Kangaroo: ["red kangaroo"],
    Flamingo: ["greater flamingo"],
    Crocodile: ["nile crocodile"],
    Rhinoceros: ["white rhinoceros", "white rhino", "rhino"],
    Pangolin: ["ground pangolin", "temmincks pangolin"],
    Cassowary: ["southern cassowary"]
};


// Reveal the animal photograph.
function revealImage() {

    mystery.hidden = true;
    fallback.hidden = true;
    photo.hidden = true;

    // Match animal Wikipedia pages.
    const wikiNames = {
        Elephant: "African bush elephant",
        Zebra: "Plains zebra",
        Penguin: "Emperor penguin",
        Dolphin: "Bottlenose dolphin",
        Gorilla: "Western gorilla",
        Kangaroo: "Red kangaroo",
        Flamingo: "Greater flamingo",
        Crocodile: "Nile crocodile",
        Rhinoceros: "White rhinoceros",
        Pangolin: "Ground pangolin",
        Cassowary: "Southern cassowary"
    };

    const title = wikiNames[current[0]] || current[0];

    fallback.textContent = current[0];
    fallback.hidden = false;

    // Request the Wikipedia image.
    fetch(
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(title)
    )
    .then(response => {

        if (!response.ok) {
            throw Error("Wikipedia unavailable");
        }

        return response.json();
    })
    .then(data => {

        const url = data.thumbnail?.source ||
                    data.originalimage?.source;

        if (!url) {
            return;
        }

        photo.onload = () => {

            photo.hidden = false;
            fallback.hidden = true;

            animate(photo);
        };

        photo.onerror = () => {

            photo.hidden = true;
            fallback.hidden = false;
        };

        photo.alt = current[0] + " photograph";
        photo.src = url;
    })
    .catch(() => {});
}


// Finish the current game.
function endGame(won, reason) {

    finished = true;

    // Reveal all six clues.
    revealed = new Set([0, 1, 2, 3, 4, 5]);

    drawFacts();

    nameBox.textContent = "Name: " + current[0];

    revealImage();

    // Disable the guessing controls.
    form.hidden = true;
    giveUp.disabled = true;
    again.hidden = false;

    updateAttempts();

    if (won) {
        message("Correct! You guessed " + current[0] + "!", true);
    } else {
        message(reason + " The animal was " + current[0] + ".");
    }

    animate(nameBox);
    animate(again);

    // Animate the animal reveal.
    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

        gsap.fromTo(
            "#game-picture",
            { scale: 0.94 },
            {
                scale: 1,
                duration: 0.65,
                ease: "back.out(1.5)",
                overwrite: true
            }
        );
    }
}


// Start a new game.
function start() {

    // Avoid repeating previous animal.
    let index = Math.floor(Math.random() * (gameAnimals.length - 1));

    if (previous !== -1 && index >= previous) {
        index++;
    }

    previous = index;
    current = gameAnimals[index];

    // Reset the game variables.
    attempts = 15;
    finished = false;

    // Reveal three random clues.
    revealed = new Set(
        shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3)
    );

    // Hide the animal identity.
    nameBox.textContent = "Name: ??????????????";
    mystery.hidden = false;
    photo.hidden = true;
    photo.removeAttribute("src");
    fallback.hidden = true;

    // Reset the game controls.
    form.hidden = false;
    giveUp.disabled = false;
    again.hidden = true;

    input.value = "";
    feedback.textContent = "";

    // Reset the term explanation.
    document.getElementById("term-title").textContent =
        "Term Explanation";

    document.getElementById("term-description").textContent =
        "Select a revealed category to learn what it means.";

    drawFacts();
    updateAttempts();

    animate(document.querySelector(".game-layout"));
}


// Check the player's guess.
form.addEventListener("submit", (e) => {

    e.preventDefault();

    if (finished) {
        return;
    }

    const guess = normalise(input.value.trim());

    if (!guess) {
        return;
    }

    // Check accepted animal names.
    const options = [
        current[0],
        ...(acceptedNames[current[0]] || [])
    ];

    if (options.some(name => normalise(name) === guess)) {
        endGame(true);
        return;
    }

    // Deduct one incorrect attempt.
    attempts--;
    input.value = "";

    if (attempts === 0) {
        endGame(false, "No attempts remaining!");
        return;
    }

    updateAttempts();
    message("Not quite! Try another animal.");

    // Shake the incorrect guess.
    if (window.gsap) {

        gsap.fromTo(
            input,
            { x: -7 },
            {
                x: 0,
                duration: 0.3,
                ease: "elastic.out(1,.3)"
            }
        );
    }

    input.focus();
});


// Reveal a hint when clicked.
hintButton.addEventListener("click", () => {

    if (finished || attempts < 2 || revealed.size === 6) {
        return;
    }

    // Deduct two hint attempts.
    attempts -= 2;

    // Select another hidden clue.
    const remaining = shuffle(
        [0, 1, 2, 3, 4, 5].filter(index => !revealed.has(index))
    );

    revealed.add(remaining[0]);

    drawFacts();
    term(remaining[0]);

    if (attempts === 0) {
        endGame(false, "No attempts remaining!");
        return;
    }

    updateAttempts();
    message("Hint revealed! 2 attempts used.");
});


// Handle the give up button.
giveUp.addEventListener("click", () => {

    if (!finished) {
        endGame(false, "You gave up!");
    }
});


// Handle the replay button.
again.addEventListener("click", start);


// Start the first round.
start();
