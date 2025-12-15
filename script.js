// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
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
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        gsap.to(cursorOutline, {
            x: posX, y: posY, duration: 0.15, ease: "power2.out"
        });
    });

    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, { scale: 2.5, borderColor: 'rgba(10, 77, 46, 0.1)', backgroundColor: 'rgba(10, 77, 46, 0.05)' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, { scale: 1, borderColor: 'rgba(10, 77, 46, 0.3)', backgroundColor: 'transparent' });
        });
    });


    // ============================================================
    // 4. PRELOADER & ENHANCED HERO ENTRY ANIMATION (UPDATED)
    // ============================================================
    const tl = gsap.timeline();
    const counter = { val: 0 };
    
    tl.to(counter, {
        val: 100, duration: 2, ease: "power2.inOut",
        onUpdate: () => {
            const countEl = document.querySelector('.counter');
            if(countEl) countEl.textContent = Math.floor(counter.val);
        }
    })
    .to('.loader-line', { width: '100%', duration: 2, ease: "power2.inOut" }, "<")
    .to('.preloader', {
        y: "-100%", duration: 1, ease: "expo.inOut", delay: 0.2
    })
    
    // --- NEW HERO ANIMATIONS START HERE ---
    
    // A. Image: Start zoomed in and blurry, then sharpen and zoom out
    .from('.hero-img', { 
        scale: 1.6, 
        filter: "blur(15px)", // Dramatic blur start
        duration: 2.5, 
        ease: "power3.out" 
    }, "-=0.8")
    
    // B. Overlay: "Sunrise effect" - starts dark, brightens up
    .from('.overlay', {
        backgroundColor: "rgba(0,0,0,0.8)", // Start very dark
        backdropFilter: "blur(0px)", // Start with no blur on overlay
        duration: 2.5,
        ease: "power3.out"
    }, "<")

    // C. Title Reveal: More pronounced skew and stagger
    .from('.hero-title .line span', {
        yPercent: 105, // Push slightly further down
        skewY: 10, // More dramatic angle
        duration: 1.5,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=2") // Overlap significantly with image reveal

    // D. Supports items stagger in
    .from('.hero-label, .hero-sub, .scroll-indicator', { 
        opacity: 0, 
        y: 50, // Larger slide up distance
        duration: 1.2, 
        stagger: 0.2, 
        ease: "power3.out" 
    }, "-=1");

    // --- END NEW HERO ANIMATIONS ---


    // 5. STATS COUNTER ANIMATION
    gsap.utils.toArray('.stat-box .counter').forEach(count => {
        ScrollTrigger.create({
            trigger: count, start: "top 85%", once: true,
            onEnter: () => {
                gsap.to(count, {
                    innerHTML: count.getAttribute('data-val'), duration: 2, snap: { innerHTML: 1 },
                    modifiers: { innerHTML: value => Math.floor(value) + "+" }
                });
            }
        });
    });

    // 6. ABOUT SECTION IMAGE TILT
    const tiltContainer = document.querySelector('.tilt-card');
    if(tiltContainer) {
        tiltContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = tiltContainer.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) / 25;
            const y = (e.clientY - top - height / 2) / 25;
            gsap.to(tiltContainer.querySelector('img'), {
                x: x, y: y, scale: 1.1, duration: 0.5, ease: "power2.out"
            });
        });
        tiltContainer.addEventListener('mouseleave', () => {
            gsap.to(tiltContainer.querySelector('img'), { x: 0, y: 0, scale: 1, duration: 0.5 });
        });
    }

    // 7. LEADERSHIP STAGGER ANIMATION
    gsap.from('.leader-card', {
        scrollTrigger: { trigger: '.leaders-grid', start: "top 80%" },
        y: 100, opacity: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)"
    });

    // 8. ECOSYSTEM STACKING CARDS
    const cards = document.querySelectorAll('.stack-card');
    cards.forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card, start: "top top+=100", end: "bottom top", scrub: true,
            },
            scale: 1 - (cards.length - index) * 0.05, opacity: 1
        });
    });

    // 9. PRODUCTS 3D CYLINDER ROTATION
    const ring = document.querySelector('.carousel-ring');
    const items = document.querySelectorAll('.prod-card');
    const radius = 400; 
    items.forEach((item, i) => {
        const angle = (i / items.length) * 360;
        gsap.set(item, {
            rotationY: angle, z: radius, transformOrigin: `50% 50% -${radius}px`
        });
    });
    gsap.to(ring, {
        scrollTrigger: { trigger: "#products", start: "top bottom", end: "bottom top", scrub: 1 },
        rotationY: 180, ease: "none"
    });

    // 10. GOVT SCHEME REVEAL
    gsap.from('.scheme-container', {
        scrollTrigger: { trigger: '.scheme-section', start: "top 80%" },
        y: 50, opacity: 0, duration: 1, ease: "power3.out"
    });


    // ============================================================
    // 11. NEW: HERO PARALLAX SCROLL EFFECT
    // ============================================================
    // As you scroll down, the background image moves slower than the text
    // creating a sense of depth.
    gsap.to('.hero-bg-wrapper', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true // Links animation progress to scrollbar
        },
        yPercent: 50, // Move the background down by 50% of its height
        ease: 'none'
    });

});