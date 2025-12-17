// =========================================================
// 1. PAGE INITIALIZATION
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Custom Cursor
    initCustomCursor();

    // Start Page Animations
    initJourneyAnimations();

    // Fetch and Inject Components (Navbar & Footer)
    loadComponents();
});


// =========================================================
// 2. FETCH LOGIC
// =========================================================
async function loadComponents() {
    try {
        const navRes = await fetch('components/navbar.html');
        if (navRes.ok) {
            document.getElementById('navbar-placeholder').innerHTML = await navRes.text();
            initNavbarLogic(); // Activate navbar scripts
        }

        const footRes = await fetch('components/footer.html');
        if (footRes.ok) {
            document.getElementById('footer-placeholder').innerHTML = await footRes.text();
            initFooterLogic(); // Activate footer scripts
        }
        
        setTimeout(() => ScrollTrigger.refresh(), 500);

    } catch (err) {
        console.error("Error loading components:", err);
    }
}


// =========================================================
// 3. ANIMATION LOGIC
// =========================================================
function initJourneyAnimations() {
    
    // A. Hero Fade In
    gsap.from(".hero-container > .fade-up", {
        y: 60, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.2
    });

    // B. Central Track (Fills green as you scroll)
    gsap.to(".track-fill", {
        height: "100%", ease: "none",
        scrollTrigger: {
            trigger: ".journey-section",
            start: "top center",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // C. Timeline Rows (Split Animation)
    const rows = document.querySelectorAll('.timeline-row');
    
    rows.forEach((row) => {
        const hugeYear = row.querySelector('.huge-year');
        const card = row.querySelector('.text-card');
        const imgMask = row.querySelector('.img-mask');
        const img = row.querySelector('img');
        const badge = row.querySelector('.img-badge');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: "top 70%", // Start earlier
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });

        tl
        // 1. Huge Year Parallax Fade In
        .from(hugeYear, { x: -50, opacity: 0, duration: 1, ease: "power3.out" })
        
        // 2. Image Reveal (Mask Width 0 -> 100)
        .from(imgMask, { width: 0, duration: 1.2, ease: "power4.inOut" }, "-=0.8")
        
        // 3. Card Pop Up
        .from(card, { y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.5)" }, "-=0.6")
        
        // 4. Badge Pop
        .from(badge, { scale: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" }, "-=0.4");


        // Parallax Effect for the Huge Year (Moves slightly on scroll)
        gsap.to(hugeYear, {
            y: 50, // Moves down slowly
            ease: "none",
            scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
        
        // Parallax for Image (Scale down slightly)
        gsap.to(img, {
            scale: 1, // Starts at 1.3 defined in CSS
            ease: "none",
            scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });
}


// =========================================================
// 4. CUSTOM CURSOR LOGIC
// =========================================================
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline || window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set([cursorDot, cursorOutline], { xPercent: -50, yPercent: -50, x: window.innerWidth/2, y: window.innerHeight/2 });

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.01, ease: "none" });
        gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .text-card, .img-mask')) {
            document.body.classList.add('hovering');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .text-card, .img-mask')) {
            document.body.classList.remove('hovering');
        }
    });
}


// =========================================================
// 5. NAVBAR LOGIC
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
// 6. FOOTER LOGIC
// =========================================================
function initFooterLogic() {
    const spotlightContainer = document.querySelector('#spotlight-container'); 
    const brightLayer = document.querySelector('.layer-bright');

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

    if (spotlightContainer && brightLayer) {
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