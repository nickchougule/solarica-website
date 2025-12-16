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

    // ============================================================
    // 3. NAVBAR LOGIC
    // ============================================================
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

    subMenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parent = trigger.parentElement;
            const submenu = parent.querySelector('.submenu-list');
            const arrow = trigger.querySelector('.arrow-icon');
            if (submenu.style.height && submenu.style.height !== '0px') {
                gsap.to(submenu, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
                gsap.to(arrow, { rotation: 0, duration: 0.3 });
            } else {
                gsap.set(submenu, { height: "auto" });
                gsap.from(submenu, { height: 0, duration: 0.4, ease: "power2.inOut" });
                gsap.to(submenu, { opacity: 1, duration: 0.4, delay: 0.1 });
                gsap.to(arrow, { rotation: 180, duration: 0.3 });
            }
        });
    });

    const allLinks = document.querySelectorAll('.sub-link, .menu-link');
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(isMenuOpen) {
                isMenuOpen = false;
                menuBtn.classList.remove('active');
                menuOverlay.classList.remove('open');
            }
        });
    });

    // ============================================================
    // 4. CUSTOM CURSOR
    // ============================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, { left: e.clientX, top: e.clientY, duration: 0 });
            gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
        });
        const magneticBtns = document.querySelectorAll('a, button, .magnetic, .menu-toggle-btn');
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
    // 5. HERO ANIMATIONS
    // ============================================================
    const tl = gsap.timeline();
    const counter = { val: 0 };
    gsap.set('.hero-bg-wrapper', { clipPath: "circle(0% at 50% 50%)", autoAlpha: 1 });
    gsap.set('.hero-img', { scale: 1.4 });
    tl.to(counter, {
        val: 100, duration: 1.5, ease: "power2.inOut",
        onUpdate: () => {
            const el = document.querySelector('.counter');
            if(el) el.textContent = Math.floor(counter.val);
        }
    })
    .to('.loader-line', { width: '100%', duration: 1.5 }, "<")
    .to('.preloader', { y: "-100%", duration: 0.8, ease: "expo.inOut" })
    .to('.hero-bg-wrapper', { clipPath: "circle(150% at 50% 50%)", duration: 2, ease: "power4.inOut" }, "-=0.2")
    .to('.hero-img', { scale: 1, duration: 2.5, ease: "power2.out" }, "<")
    .to('.overlay', { opacity: 1, duration: 1.5 }, "<+=0.5")
    .to('.reveal-text', { y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" }, "-=1.0")
    .from('nav', { y: -20, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8")
    .to('.scroll-indicator', { opacity: 1, duration: 1 }, "<")
    .add(() => { startHeroSlideshow(); }, "-=1.0");

    function startHeroSlideshow() {
        const images = document.querySelectorAll('.hero-img');
        if (images.length > 1) {
            let currentIndex = 0;
            setInterval(() => {
                const nextIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.remove('active');
                images[nextIndex].classList.add('active');
                currentIndex = nextIndex;
            }, 3000);
        }
    }

    // ============================================================
    // 6. SCROLL ANIMATIONS
    // ============================================================
    
    gsap.utils.toArray('.stat-box .counter').forEach(count => {
        ScrollTrigger.create({
            trigger: count, start: "top 85%", once: true,
            onEnter: () => gsap.to(count, { innerHTML: count.getAttribute('data-val'), duration: 2, snap: { innerHTML: 1 }, modifiers: { innerHTML: value => Math.floor(value) + "+" } })
        });
    });

    const aboutLines = document.querySelectorAll('.about-reveal-text span');
    if (aboutLines.length > 0) {
        gsap.fromTo(aboutLines, 
            { y: "100%", opacity: 0 },
            {
                y: "0%", opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: "#about", start: "top 60%", toggleActions: "play none none reverse" }
            }
        );
    }

    gsap.from('.leader-card', {
        scrollTrigger: { trigger: '.leaders-grid', start: "top 80%" },
        y: 100, opacity: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)"
    });

    document.querySelectorAll('.stack-card').forEach((card, index, cards) => {
        gsap.to(card, {
            scrollTrigger: { trigger: card, start: "top top+=100", end: "bottom top", scrub: true },
            scale: 1 - (cards.length - index) * 0.05, opacity: 1
        });
    });

    const ring = document.querySelector('.carousel-ring');
    const items = document.querySelectorAll('.prod-card');
    if(ring && items.length > 0) {
        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 250 : 450; 
        items.forEach((item, i) => {
            const angle = (i / items.length) * 360;
            gsap.set(item, { rotationY: angle, z: radius, transformOrigin: `50% 50% -${radius}px`, backfaceVisibility: "hidden" });
        });
        gsap.to(ring, {
            scrollTrigger: { trigger: "#products", start: "top top", end: "+=4000", pin: true, scrub: 1, anticipatePin: 1 },
            rotationY: -360, ease: "none"
        });
    }

    gsap.from('.scheme-container', {
        scrollTrigger: { trigger: '.scheme-section', start: "top 80%" },
        y: 50, opacity: 0, duration: 1
    });

    gsap.to('.hero-bg-wrapper', {
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        yPercent: 30, ease: 'none'
    });

    // ============================================================
    // 7. FOOTER SPOTLIGHT MASK ANIMATION
    // ============================================================
    
    // A. Left Side Stagger Reveal
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

    // B. The Spotlight Mask Logic
    const spotlightContainer = document.querySelector('#spotlight-container');
    const brightLayer = document.querySelector('.layer-bright');

    if (spotlightContainer && brightLayer) {
        
        // Initial reveal of the text block itself (sliding in)
        gsap.fromTo('.text-stack', 
            { x: 100, opacity: 0 },
            { 
                x: 0, opacity: 1, duration: 1.5, ease: "power4.out",
                scrollTrigger: { trigger: "footer", start: "top 70%" }
            }
        );

        // MOUSE MOVE INTERACTION
        spotlightContainer.addEventListener('mousemove', (e) => {
            const rect = spotlightContainer.getBoundingClientRect();
            
            // Calculate mouse position relative to the container
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for the clip-path
            brightLayer.style.setProperty('--mask-x', `${x}px`);
            brightLayer.style.setProperty('--mask-y', `${y}px`);
            brightLayer.style.setProperty('--mask-size', `200px`); // Spotlight size
        });

        // MOUSE LEAVE (Hide the spotlight)
        spotlightContainer.addEventListener('mouseleave', () => {
            brightLayer.style.setProperty('--mask-size', `0%`); // Shrink to zero
        });
    }

    ScrollTrigger.refresh();
}