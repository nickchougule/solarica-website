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
    
    // Safety check if cursor elements exist
    if (cursorDot && cursorOutline) {
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
    }

    // ============================================================
    // 4. PRELOADER & HERO ANIMATIONS
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
    
    // --- HERO ENTRY ---
    .from('.hero-img', { 
        scale: 1.6, 
        filter: "blur(15px)", 
        duration: 2.5, 
        ease: "power3.out" 
    }, "-=0.8")
    
    .from('.overlay', {
        backgroundColor: "rgba(0,0,0,0.8)", 
        backdropFilter: "blur(0px)", 
        duration: 2.5,
        ease: "power3.out"
    }, "<")

    .from('.hero-title .line span', {
        yPercent: 105, 
        skewY: 10, 
        duration: 1.5,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=2") 

    .from('.hero-label, .hero-sub, .scroll-indicator', { 
        opacity: 0, 
        y: 50, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: "power3.out" 
    }, "-=1");


    // 5. STATS COUNTER ANIMATION
    gsap.utils.toArray('.stat-box .counter').forEach(count => {
        ScrollTrigger.create({
            trigger: count, start: "top 85%", once: true,
            onEnter: () => {
                const rawVal = count.getAttribute('data-val');
                const finalVal = parseInt(rawVal);
                gsap.to(count, {
                    innerHTML: finalVal, duration: 2, snap: { innerHTML: 1 },
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

    // ============================================================
    // 9. PRODUCTS 3D CYLINDER ROTATION (CORRECTED & RESPONSIVE)
    // ============================================================
    const ring = document.querySelector('.carousel-ring');
    const items = document.querySelectorAll('.prod-card');
    
    if(ring && items.length > 0) {
        // RESPONSIVE RADIUS: 
        // If mobile (less than 768px), use smaller radius so cards fit on screen
        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 250 : 450; 
        
        // 1. POSITION ITEMS IN A PERFECT CIRCLE
        items.forEach((item, i) => {
            const angle = (i / items.length) * 360;
            gsap.set(item, {
                rotationY: angle,
                z: radius,
                // Pivot around the center of the ring
                transformOrigin: `50% 50% -${radius}px`,
                backfaceVisibility: "hidden" 
            });
        });

        // 2. ANIMATE THE RING (FULL 360 ROTATION)
        gsap.to(ring, {
            scrollTrigger: {
                trigger: "#products",
                start: "top top",      
                end: "+=4000",         // Long scroll distance for smooth rotation
                pin: true,             // Pin section
                scrub: 1,              
                anticipatePin: 1
            },
            rotationY: -360,           // Full circle rotation
            ease: "none"
        });
    }

    // 10. GOVT SCHEME REVEAL
    gsap.from('.scheme-container', {
        scrollTrigger: { trigger: '.scheme-section', start: "top 80%" },
        y: 50, opacity: 0, duration: 1, ease: "power3.out"
    });


    // ============================================================
    // 11. HERO PARALLAX SCROLL EFFECT
    // ============================================================
    gsap.to('.hero-bg-wrapper', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true 
        },
        yPercent: 50, // Move background slower than text
        ease: 'none'
    });

});