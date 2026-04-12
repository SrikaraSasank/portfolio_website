// Navigation styling on scroll
const nav = document.querySelector('.glass-nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.05)';
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.03)';
        nav.style.boxShadow = 'none';
    }
});

// Scroll Reveal Animation via Intersection Observer
const revealElements = document.querySelectorAll('.glass-panel, .clay-card, .glass-card, .section-header');

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => {
    el.classList.add('hidden-state');
    revealOnScroll.observe(el);
});

// Cursor follow liquid effect (Optional - attached to hero visual if desired)
const liquidOrb = document.querySelector('.liquid-glass-orb');
if(liquidOrb) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        liquidOrb.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });
}
