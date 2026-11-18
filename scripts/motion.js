
 // Coordinate shared GSAP animations.
 // Apply animations across pages.
 // Respect reduced motion preferences.

(function () {

    // Check if GSAP exists.
    if (
        typeof gsap === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    // Select a single element.
    const $ = (selector) => document.querySelector(selector);

    // Select multiple page elements.
    const $$ = (selector) => gsap.utils.toArray(selector);

    // Check ScrollTrigger plugin availability.
    const hasScroll = typeof ScrollTrigger !== "undefined";

    if (hasScroll) {
        gsap.registerPlugin(ScrollTrigger);
    }


   

    // Coordinate page entrance animations.
    const opening = gsap.timeline({
        defaults: {
            ease: "power2.out"
        }
    });

    // Animate the navigation logo.
    opening.from(".top-nav .logo-link", {
        opacity: 0,
        y: -18,
        duration: 0.55,
        clearProps: "all"
    });

    // Animate the navigation links.
    opening.from(
        ".top-nav .nav-links a",
        {
            opacity: 0,
            y: -12,
            stagger: 0.09,
            duration: 0.42,
            clearProps: "all"
        },
        "-=0.25"
    );

    // Animate category page cards.
    if ($(".category-section")) {

        opening.from(
            ".category-card",
            {
                opacity: 0,
                y: 45,
                scale: 0.96,
                stagger: 0.13,
                duration: 0.75,
                clearProps: "all"
            },
            "-=0.1"
        );
    }

    // Animate guessing game heading.
    if ($(".game-heading")) {

        opening.from(
            ".game-heading h1, .game-heading p",
            {
                opacity: 0,
                y: 18,
                stagger: 0.14,
                duration: 0.5,
                clearProps: "all"
            },
            "-=0.1"
        );
    }



    // Find the page heading.
    const svgHeading =
        $(".game-heading h1") ||
        $(".page-heading h1") ||
        $(".conservation-intro h2");

    if (svgHeading) {

        // Create the SVG element.
        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        line.setAttribute("viewBox", "0 0 300 16");
        line.setAttribute("class", "motion-heading-line");
        line.setAttribute("aria-hidden", "true");

        // Create the curved path.
        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        // Set the path appearance.
        path.setAttribute(
            "d",
            "M 4 9 C 70 1, 115 14, 165 8 S 250 4, 296 8"
        );

        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "4");
        path.setAttribute("stroke-linecap", "round");

        // Add path into SVG.
        line.appendChild(path);

        // Place SVG beneath heading.
        svgHeading.insertAdjacentElement("afterend", line);

        // Measure the path length.
        const length = path.getTotalLength();

        // Hide the initial stroke.
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        // Animate the SVG drawing.
        opening.to(
            path,
            {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: "power2.inOut"
            },
            "-=0.25"
        );
    }


  

    // Animate headings and searches.
    if ($(".page-heading")) {

        // Animate the page heading.
        gsap.from(".page-heading h1", {
            opacity: 0,
            y: 18,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all"
        });

        // Animate the search bar.
        gsap.from(".page-heading .animal-search", {
            opacity: 0,
            y: 15,
            duration: 0.65,
            delay: 0.16,
            ease: "power2.out",
            clearProps: "all"
        });
    }



    // Find all search inputs.
    $$(".animal-search input, #guess-input").forEach(function (input) {

        // Enlarge input when focused.
        input.addEventListener("focus", function () {

            gsap.to(input, {
                scale: 1.015,
                duration: 0.2,
                ease: "power1.out",
                overwrite: true
            });
        });

        // Reset input when unfocused.
        input.addEventListener("blur", function () {

            gsap.to(input, {
                scale: 1,
                duration: 0.2,
                ease: "power1.out",
                overwrite: true
            });
        });
    });




    // Check Discover banner availability.
    if (hasScroll && $$(".discover-banner").length) {

        // Animate each category banner.
        $$(".discover-banner").forEach(function (banner) {

            // Find banner child elements.
            const photo = banner.querySelector(".banner-photo");
            const heading = banner.querySelector(".banner-title");

            // Set the slide direction.
            const direction = banner.classList.contains("banner-right")
                ? 55
                : -55;

            // Create scroll animation timeline.
            const reveal = gsap.timeline({

                scrollTrigger: {
                    trigger: banner,
                    start: "top 94%",
                    end: "top 50%",
                    scrub: 1
                }
            });

            // Reveal banner while scrolling.
            reveal.fromTo(
                banner,
                {
                    opacity: 0.35,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    ease: "none",
                    duration: 1
                }
            );

            // Zoom the banner photograph.
            reveal.fromTo(
                photo,
                {
                    scale: 1.13
                },
                {
                    scale: 1,
                    ease: "none",
                    duration: 1
                },
                0
            );

            // Slide the banner heading.
            reveal.fromTo(
                heading,
                {
                    x: direction
                },
                {
                    x: 0,
                    ease: "none",
                    duration: 1
                },
                0
            );
        });
    }




    // Check conservation section availability.
    if ($(".conservation-section")) {

        // Find the conservation content.
        const intro = $(".conservation-intro");
        const organisations = $$(".organisation");

        if (hasScroll) {

            // Reveal the conservation introduction.
            gsap.from(intro, {
                opacity: 0,
                y: 32,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "all",

                scrollTrigger: {
                    trigger: intro,
                    start: "top 90%",
                    once: true
                }
            });

            // Reveal the organisation cards.
            gsap.from(organisations, {
                opacity: 0,
                y: 25,
                stagger: 0.13,
                duration: 0.65,
                ease: "power2.out",
                clearProps: "all",

                scrollTrigger: {
                    trigger: ".organisation-panel",
                    start: "top 90%",
                    once: true
                }
            });
        }
    }


  

    // Find all animal cards.
    $$(".animal-card").forEach(function (card) {

        // Lift card when hovered.
        card.addEventListener("mouseenter", function () {

            gsap.to(card, {
                y: -7,
                scale: 1.018,
                duration: 0.26,
                ease: "power2.out",
                overwrite: true
            });
        });

        // Reset card after hover.
        card.addEventListener("mouseleave", function () {

            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        });

        // Lift card when focused.
        card.addEventListener("focusin", function () {

            gsap.to(card, {
                y: -5,
                duration: 0.2,
                overwrite: true
            });
        });

        // Reset card after focus.
        card.addEventListener("focusout", function () {

            gsap.to(card, {
                y: 0,
                duration: 0.2,
                overwrite: true
            });
        });
    });




    // Find all Discover banners.
    $$(".discover-banner").forEach(function (banner) {

        // Find the banner elements.
        const photo = banner.querySelector(".banner-photo");
        const title = banner.querySelector(".banner-title");

        // Animate banner hover effects.
        function hover(active) {

            // Zoom the banner photograph.
            gsap.to(photo, {
                scale: active ? 1.055 : 1,
                duration: 0.45,
                ease: "power2.out",
                overwrite: true
            });

            // Move the banner heading.
            gsap.to(title, {
                x: active
                    ? (banner.classList.contains("banner-right") ? -7 : 7)
                    : 0,
                duration: 0.35,
                ease: "power2.out",
                overwrite: true
            });
        }

        // Activate animation on hover.
        banner.addEventListener("mouseenter", function () {
            hover(true);
        });

        // Reset animation after hover.
        banner.addEventListener("mouseleave", function () {
            hover(false);
        });

        // Activate animation on focus.
        banner.addEventListener("focus", function () {
            hover(true);
        });

        // Reset animation after focus.
        banner.addEventListener("blur", function () {
            hover(false);
        });
    });



    // Check guessing game availability.
    if ($(".game-page")) {

        // Animate the game sections.
        gsap.from(
            ".game-left, .game-center, .game-right",
            {
                opacity: 0,
                y: 25,
                duration: 0.75,
                stagger: 0.12,
                delay: 0.12,
                ease: "power2.out",
                clearProps: "all"
            }
        );

        // Find the game buttons.
        $$(".game-actions button, .give-up, .play-again").forEach(
            function (button) {

                // Enlarge button when hovered.
                button.addEventListener("mouseenter", function () {

                    if (!button.disabled) {

                        gsap.to(button, {
                            scale: 1.045,
                            duration: 0.18,
                            overwrite: true
                        });
                    }
                });

                // Reset button after hover.
                button.addEventListener("mouseleave", function () {

                    gsap.to(button, {
                        scale: 1,
                        duration: 0.18,
                        overwrite: true
                    });
                });
            }
        );
    }

})();
