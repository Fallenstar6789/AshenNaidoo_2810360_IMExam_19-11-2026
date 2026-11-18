// Animate category hover arrows.
// Home page GSAP animations
if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach(function (card) {
        const arrow = card.querySelector(".category-arrow");

        card.addEventListener("mouseenter", function () {
            gsap.killTweensOf(arrow);
            gsap.to(arrow, {
                y: -16,
                duration: 0.38,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        });

        card.addEventListener("mouseleave", function () {
            gsap.killTweensOf(arrow);
            gsap.to(arrow, { y: 0, duration: 0.25 });
        });
    });
}
