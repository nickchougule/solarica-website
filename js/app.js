import { initAnimations } from './animations.js';

document.addEventListener("DOMContentLoaded", async () => {
    
    const loadComponent = async (id, file) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found. Skipping ${file}.`);
            return;
        }
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load ${file}: ${response.statusText}`);
            const html = await response.text();
            element.innerHTML = html;
        } catch (error) {
            console.error(error);
        }
    };

    console.log("Loading Components...");

    // Load all HTML fragments (Added CTA component)
    await Promise.all([
        loadComponent('navbar-root', 'components/navbar.html'),
        loadComponent('hero-root', 'components/hero.html'),
        loadComponent('about-root', 'components/about.html'),
        loadComponent('leaders-root', 'components/leaders.html'),
        loadComponent('ecosystem-root', 'components/ecosystem.html'),
        loadComponent('finance-root', 'components/finance.html'),
        loadComponent('products-root', 'components/products.html'),
        loadComponent('testimonials-root', 'components/testimonials.html'),
        loadComponent('projects-root', 'components/projects.html'),
        loadComponent('cta-root', 'components/cta.html'), // Loaded Here
        loadComponent('footer-root', 'components/footer.html')
    ]);

    console.log("Components Loaded. Initializing Animations...");

    // Initialize Animations with a slight delay for DOM painting
    setTimeout(() => {
        initAnimations();
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 100);
});