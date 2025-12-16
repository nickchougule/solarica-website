export function initAnimations() {
    // 1. REGISTER GSAP PLUGINS
    gsap.registerPlugin(ScrollTrigger);

    // 2. INITIALIZE LENIS SMOOTH SCROLL
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        direction: 'vertical',
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. CUSTOM CURSOR LOGIC
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Safety check if cursor elements exist
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            // Immediate movement for dot
            gsap.to(cursorDot, { left: posX, top: posY, duration: 0 });
            // Laggy movement for outline
            gsap.to(cursorOutline, { x: posX, y: posY, duration: 0.15, ease: "power2.out" });
        });

        // Add magnetic effect to links and buttons
        const magneticBtns = document.querySelectorAll('a, button, .magnetic');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(cursorOutline, { scale: 2.5, borderColor: 'rgba(10, 77, 46, 0.1)', backgroundColor: 'rgba(10, 77, 46, 0.05)' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(cursorOutline, { scale: 1, borderColor: 'rgba(10, 77, 46, 0.3)', backgroundColor: 'transparent' });
            });
        });
    }

    // ============================================================
    // 4. PRELOADER & HERO REVEAL (CINEMATIC IRIS WIPE)
    // ============================================================
    const tl = gsap.timeline();
    const counter = { val: 0 };

    // A. Initial Set: Hide Hero Image behind a tiny circle mask
    gsap.set('.hero-bg-wrapper', { 
        clipPath: "circle(0% at 50% 50%)", 
        autoAlpha: 1 
    });
    // Start zoomed in to creating "depth" when revealing
    gsap.set('.hero-img', { scale: 1.4 });

    // B. Preloader Counter Animation
    tl.to(counter, {
        val: 100, duration: 1.5, ease: "power2.inOut",
        onUpdate: () => {
            const el = document.querySelector('.counter');
            if(el) el.textContent = Math.floor(counter.val);
        }
    })
    .to('.loader-line', { width: '100%', duration: 1.5 }, "<")
    
    // C. Slide Preloader Away
    .to('.preloader', { 
        y: "-100%", duration: 0.8, ease: "expo.inOut" 
    })

    // D. The Reveal: Expand Circle to Full Screen
    .to('.hero-bg-wrapper', {
        clipPath: "circle(150% at 50% 50%)", // 150% ensures it covers corners
        duration: 2,
        ease: "power4.inOut" // Premium easing
    }, "-=0.2")

    // E. Zoom Out Image (Parallax Feel)
    .to('.hero-img', {
        scale: 1, 
        duration: 2.5,
        ease: "power2.out"
    }, "<")

    // F. Fade in Overlay
    .to('.overlay', { opacity: 1, duration: 1.5 }, "<+=0.5")

    // G. Reveal Text Content (Staggered Slide Up)
    .to('.reveal-text', {
        y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=1.0")

    // H. Reveal Navbar & Scroll Indicator
    .from('nav', { 
        y: -20, opacity: 0, duration: 1, ease: "power2.out" 
    }, "-=0.8")
    .to('.scroll-indicator', { 
        opacity: 1, duration: 1 
    }, "<");


    // ============================================================
    // 5. SCROLL-TRIGGERED ANIMATIONS FOR OTHER SECTIONS
    // ============================================================

    // A. Stats Counter
    gsap.utils.toArray('.stat-box .counter').forEach(count => {
        ScrollTrigger.create({
            trigger: count, start: "top 85%", once: true,
            onEnter: () => {
                gsap.to(count, {
                    innerHTML: count.getAttribute('data-val'),
                    duration: 2,
                    snap: { innerHTML: 1 },
                    modifiers: { innerHTML: value => Math.floor(value) + "+" }
                });
            }
        });
    });

    // B. Leaders Cards (Staggered Entrance)
    gsap.from('.leader-card', {
        scrollTrigger: { trigger: '.leaders-grid', start: "top 80%" },
        y: 100, opacity: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)"
    });

    // C. Ecosystem Stack (Parallax Cards)
    document.querySelectorAll('.stack-card').forEach((card, index, cards) => {
        gsap.to(card, {
            scrollTrigger: { 
                trigger: card, start: "top top+=100", end: "bottom top", scrub: true 
            },
            scale: 1 - (cards.length - index) * 0.05, opacity: 1
        });
    });

    // D. Products 3D Ring
    const ring = document.querySelector('.carousel-ring');
    const items = document.querySelectorAll('.prod-card');
    
    if(ring && items.length > 0) {
        // Responsive Radius Check
        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 250 : 450; 
        
        // Position items in circle
        items.forEach((item, i) => {
            const angle = (i / items.length) * 360;
            gsap.set(item, { 
                rotationY: angle, 
                z: radius, 
                transformOrigin: `50% 50% -${radius}px`, 
                backfaceVisibility: "hidden" 
            });
        });

        // Rotate on scroll
        gsap.to(ring, {
            scrollTrigger: { 
                trigger: "#products", start: "top top", end: "+=4000", pin: true, scrub: 1, anticipatePin: 1 
            },
            rotationY: -360, ease: "none"
        });
    }

    // E. Finance Reveal
    gsap.from('.scheme-container', {
        scrollTrigger: { trigger: '.scheme-section', start: "top 80%" },
        y: 50, opacity: 0, duration: 1
    });

    // F. Parallax Hero Effect (After Reveal)
    // Moves the hero image slightly slower than scroll speed
    gsap.to('.hero-bg-wrapper', {
        scrollTrigger: { 
            trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true 
        },
        yPercent: 30, 
        ease: 'none'
    });

    // Refresh to ensure calculations are correct after loading
    ScrollTrigger.refresh();
}