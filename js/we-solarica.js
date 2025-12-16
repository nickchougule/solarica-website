// =========================================================
// 1. PAGE INITIALIZATION & FETCH LOGIC
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Page Logic Immediately
    initHeroSlideshow();
    initPageAnimations();

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
    }, 5000);
}

function initPageAnimations() {
    // A. Hero Text Reveal (Immediate)
    gsap.from(".hero-content h1", { y: 50, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from(".hero-content p", { y: 50, opacity: 0, duration: 1, delay: 0.7 });

    // B. Who We Are
    gsap.from(".who-we-are .fade-up", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: ".who-we-are", start: "top 75%" }
    });

    // C. Vision & Promise
    const rows = document.querySelectorAll('.vp-row');
    rows.forEach(row => {
        const text = row.querySelector('.vp-text');
        const img = row.querySelector('.vp-image');
        
        if(text) {
            gsap.from(text, {
                x: -50, opacity: 0, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: row, start: "top 75%" }
            });
        }
        if(img) {
            gsap.from(img, {
                x: 50, opacity: 0, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: row, start: "top 75%" }
            });
        }
    });

    // D. Why Choose Us
    gsap.from(".choose-img", {
        x: -50, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".choose-grid", start: "top 75%" }
    });

    gsap.from(".choose-item", {
        x: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".choose-list", start: "top 80%" }
    });

    // E. CTA
    gsap.from(".cta-box", {
        scale: 0.9, opacity: 0, duration: 1, ease: "elastic.out(1, 0.75)",
        scrollTrigger: { trigger: ".cta-section", start: "top 85%" }
    });
}