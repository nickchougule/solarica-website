// =========================================================
// 1. PAGE INITIALIZATION & FETCH LOGIC
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Page Logic Immediately (Hero, Cursor, etc.)
    initHeroSlideshow();
    initCustomCursor();

    // Initialize Animations that don't depend on Footer/Nav
    initPageAnimations();
    initWhoWeAreScrub(); // <--- NEW: High-end text scrubbing added here

    // Fetch and Inject Components (Navbar & Footer)
    loadComponents();
});


// Helper to fetch HTML files
async function loadComponents() {
    try {
        // Fetch Navbar
        const navRes = await fetch('components/navbar.html');
        if (navRes.ok) {
            document.getElementById('navbar-placeholder').innerHTML = await navRes.text();
            initNavbarLogic(); // Start Navbar JS after loading
        }

        // Fetch Footer
        const footRes = await fetch('components/footer.html');
        if (footRes.ok) {
            document.getElementById('footer-placeholder').innerHTML = await footRes.text();
            initFooterLogic(); // Start Footer JS after loading
        }
        
        // Refresh ScrollTrigger once DOM changes are done
        ScrollTrigger.refresh();

    } catch (err) {
        console.error("Error loading components:", err);
    }
}


// =========================================================
// 2. NAVBAR LOGIC (Called after fetch)
// =========================================================
function initNavbarLogic() {
    const menuBtn = document.querySelector('.menu-toggle-btn');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link.title');
    const subMenuTriggers = document.querySelectorAll('.has-submenu .menu-link-wrapper');
    let isMenuOpen = false;

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            menuBtn.classList.toggle('active');
            
            if (isMenuOpen) {
                menuOverlay.classList.add('open');
                // Stagger Animation for Links
                gsap.fromTo(menuLinks, 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power3.out" }
                );
            } else {
                menuOverlay.classList.remove('open');
            }
        });
    }

    // Submenu Accordion
    subMenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const submenu = trigger.parentElement.querySelector('.submenu-list');
            const arrow = trigger.querySelector('.arrow-icon');
            
            if (submenu.style.height && submenu.style.height !== '0px') {
                gsap.to(submenu, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
                if(arrow) gsap.to(arrow, { rotation: 0, duration: 0.3 });
            } else {
                gsap.set(submenu, { height: "auto" });
                gsap.from(submenu, { height: 0, duration: 0.4, ease: "power2.inOut" });
                gsap.to(submenu, { opacity: 1, duration: 0.4, delay: 0.1 });
                if(arrow) gsap.to(arrow, { rotation: 180, duration: 0.3 });
            }
        });
    });
}


// =========================================================
// 3. FOOTER LOGIC (Called after fetch)
// =========================================================
function initFooterLogic() {
    const spotlightContainer = document.querySelector('#spotlight-container'); // Ensure footer.html has this ID
    const brightLayer = document.querySelector('.layer-bright');

    // 1. Reveal Footer Content on Scroll
    const footerItems = document.querySelectorAll('.reveal-footer');
    if (footerItems.length > 0) {
        gsap.fromTo(footerItems, 
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { 
                    trigger: "footer", 
                    start: "top 80%", 
                    toggleActions: "play none none reverse" 
                }
            }
        );
    }

    // 2. Spotlight Interaction (If elements exist)
    if (spotlightContainer && brightLayer) {
        // Initial entrance
        gsap.fromTo('.text-stack', 
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: "footer", start: "top 70%" } }
        );

        spotlightContainer.addEventListener('mousemove', (e) => {
            const rect = spotlightContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            brightLayer.style.setProperty('--mask-x', `${x}px`);
            brightLayer.style.setProperty('--mask-y', `${y}px`);
            brightLayer.style.setProperty('--mask-size', `200px`);
        });

        spotlightContainer.addEventListener('mouseleave', () => {
            brightLayer.style.setProperty('--mask-size', `0%`);
        });
    }
}


// =========================================================
// 4. PAGE-SPECIFIC LOGIC (Hero & Sections)
// =========================================================

function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    if(slides.length === 0) return;

    setInterval(() => {
        // Reset current
        slides[currentSlide].classList.remove('active');
        if(dots[currentSlide]) dots[currentSlide].classList.remove('active');

        // Next index
        currentSlide = (currentSlide + 1) % slides.length;

        // Activate next
        slides[currentSlide].classList.add('active');
        if(dots[currentSlide]) dots[currentSlide].classList.add('active');
    }, 6000);
}

// ---------------------------------------------------------
// NEW: High-End Scrollytelling for "Who We Are"
// ---------------------------------------------------------
function initWhoWeAreScrub() {
    // 1. Select all the text spans (Make sure you updated HTML to use .highlight-span)
    const spans = document.querySelectorAll(".highlight-span");

    // 2. Animate each line individually as you scroll
    spans.forEach(span => {
        gsap.to(span, {
            opacity: 1,          // Turn fully visible
            filter: "blur(0px)", // Remove the blur
            y: 0,                // Move to natural position
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: span,
                start: "top 85%", // Start animating when line enters bottom of view
                end: "top 45%",   // Finish when line is near center
                scrub: 0.5,       // Smooth scrubbing linked to scrollbar
                toggleActions: "play reverse play reverse"
            }
        });
    });

    // 3. Animate the Header on the left side
    gsap.from(".who-header-col", {
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".who-we-are",
            start: "top 70%",
            toggleActions: "play reverse play reverse"
        }
    });
}

function initPageAnimations() {
    // A. Hero Text Reveal (Immediate)
    const tlHero = gsap.timeline();
    tlHero.from(".hero-content h1", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" })
          .from(".hero-content p", { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
          .from(".hero-btns", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");

    // B. Who We Are -- REMOVED OLD FADE-UP TO USE NEW SCRUB FUNCTION ABOVE

    // C. Vision, Promise & Concept (IMPROVED WITH PARALLAX)
    const stackCards = document.querySelectorAll('.vp-card');
    
    if (stackCards.length > 0) {
        // We iterate through all cards except the last one
        // (The last card doesn't need to scale down, it just sits on top)
        stackCards.forEach((card, i) => {
            
            // Logic for the image inside (Parallax effect)
            const img = card.querySelector('img');
            if(img) {
                gsap.fromTo(img, 
                    { scale: 1.2, yPercent: -10 },
                    { 
                        yPercent: 10, 
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        } 
                    }
                );
            }

            // Logic for the CARD itself (Scaling down as next one covers it)
            if (i !== stackCards.length - 1) {
                gsap.to(card.querySelector('.vp-card-inner'), {
                    scale: 0.9,       // Shrink slightly
                     // Darken
                    y: 50,            // Push down slightly
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top top", // When card hits top of screen
                        end: "bottom top", // When card leaves top of screen
                        scrub: true,
                        pin: false // The CSS 'sticky' handles the pinning, GSAP handles the visuals
                    }
                });
            }
        });
    }

    // D. Why Choose Us (Sticky Section Animations)
    const chooseSection = document.querySelector('.why-choose-us');
    
    if (chooseSection) {
        
        // 1. TIMELINE FILL ANIMATION (Scrub linked to scroll)
        gsap.to(".timeline-fill", {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".choose-list",
                start: "top 60%", // Start filling when list is near center
                end: "bottom 60%", // End when bottom of list is near center
                scrub: true
            }
        });

        // 2. PARALLAX IMAGE INSIDE STICKY BOX
        gsap.to(".parallax-inner", {
            y: -50, // Move image slightly up inside container
            ease: "none",
            scrollTrigger: {
                trigger: ".choose-layout",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // 3. CARD FOCUS EFFECT (The "Sexy" Part)
        const cards = document.querySelectorAll(".choose-card");
        
        cards.forEach((card) => {
            ScrollTrigger.create({
                trigger: card,
                start: "top 65%", // When card top hits 65% of viewport height
                end: "bottom 65%", // When card bottom passes that point
                
                // Toggle 'active' class for CSS transition (Scale/Opacity)
                onEnter: () => card.classList.add("active"),
                onLeave: () => card.classList.remove("active"),
                onEnterBack: () => card.classList.add("active"),
                onLeaveBack: () => card.classList.remove("active")
            });
        });
    }

    // E. CTA
    gsap.from(".cta-box", {
        y: 100, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".cta-section", start: "top 85%", toggleActions: "play reverse play reverse" }
    });
}

// =========================================================
// 5. CUSTOM CURSOR LOGIC
// =========================================================
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only run on non-touch devices
    if (!cursorDot || !cursorOutline || window.matchMedia("(pointer: coarse)").matches) return;

    // Center cursor initially to avoid jump
    gsap.set([cursorDot, cursorOutline], { xPercent: -50, yPercent: -50, x: window.innerWidth/2, y: window.innerHeight/2 });

    // Mouse Move Event
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // 1. Dot follows instantly
        gsap.to(cursorDot, {
            x: posX, y: posY, duration: 0.01, ease: "none"
        });

        // 2. Outline follows with lag
        gsap.to(cursorOutline, {
            x: posX, y: posY, duration: 0.15, ease: "power2.out"
        });
    });

    // Hover Effects (Delegated to handle Async Navbar/Footer elements)
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        // Check if hovering over interactive elements or their children
        if (target.matches('a, button, .menu-toggle-btn, .choose-card, .vp-image') || target.closest('a, button, .choose-card')) {
            document.body.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target;
        if (target.matches('a, button, .menu-toggle-btn, .choose-card, .vp-image') || target.closest('a, button, .choose-card')) {
            document.body.classList.remove('hovering');
        }
    });
}