document.addEventListener("DOMContentLoaded", () => {
    
    // 1. INIT LIBRARIES
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. LOAD COMPONENTS (Navbar/Footer)
    loadComponents();

    // 3. RUN PAGE ANIMATIONS
    initJourneyAnimations();
});

// --- FETCH LOGIC ---
async function loadComponents() {
    try {
        const navRes = await fetch('components/navbar.html');
        if (navRes.ok) document.getElementById('navbar-root').innerHTML = await navRes.text();
        
        const footRes = await fetch('components/footer.html');
        if (footRes.ok) document.getElementById('footer-placeholder').innerHTML = await footRes.text();
        
        // Refresh GSAP after DOM injection
        setTimeout(() => ScrollTrigger.refresh(), 500);
    } catch (err) { console.error(err); }
}

// --- ANIMATION LOGIC ---
function initJourneyAnimations() {
    
    // 1. Hero Fade In
    gsap.from(".hero-container > *", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5
    });

    // 2. Progress Line (Draws down as you scroll)
    gsap.to(".timeline-line-progress", {
        height: "100%", ease: "none",
        scrollTrigger: {
            trigger: ".journey-section",
            start: "top center",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // 3. Timeline Items (The "Cool" Part)
    const items = document.querySelectorAll('.timeline-item');
    
    items.forEach((item) => {
        const content = item.querySelector('.js-scroll-reveal');
        const imgWrapper = item.querySelector('.js-image-reveal');
        const img = imgWrapper.querySelector('img');
        const marker = item.querySelector('.timeline-marker');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });

        tl
        // Pop Marker
        .from(marker, { scale: 0, rotation: -90, duration: 0.6, ease: "back.out(1.7)" })
        
        // Slide Content
        .to(content, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        
        // Unmask Image
        .to(imgWrapper, { 
            clipPath: item.classList.contains('reverse') ? "inset(0 0% 0 0)" : "inset(0 0 0 0%)", 
            duration: 1.2, ease: "power4.inOut" 
        }, "<")
        
        // Parallax Image inside wrapper
        .to(img, { scale: 1, duration: 1.5, ease: "power2.out" }, "<+=0.2");
        
        // Active Glow on Marker
        gsap.to(marker, {
            boxShadow: "0 0 40px rgba(16, 185, 129, 1)",
            borderColor: "#fff",
            scrollTrigger: {
                trigger: item,
                start: "top center",
                end: "bottom center",
                toggleActions: "play reverse play reverse"
            }
        });
    });
}