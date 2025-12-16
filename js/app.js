import { initAnimations } from './animations.js';

document.addEventListener("DOMContentLoaded", async () => {
    
    const loadComponent = async (id, file) => {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            const html = await response.text();
            document.getElementById(id).innerHTML = html;
        } catch (error) {
            console.error(error);
        }
    };

    // Load all HTML fragments
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
        loadComponent('footer-root', 'components/footer.html')
    ]);

    // Give browser a split second to paint DOM, then run GSAP
    setTimeout(() => {
        initAnimations();
    }, 100);
});