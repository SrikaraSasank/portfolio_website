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

// Cursor follow logic
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if(cursorDot && cursorOutline) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.transform = `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0)`;

        cursorOutline.animate({
            transform: `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0)`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for cursor
    const interactiveElements = document.querySelectorAll("a, .btn, .touch-ripple, .tilt-card, button");
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursorOutline.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            cursorOutline.classList.remove("cursor-hover");
        });
    });
}

// Ripple Effect for buttons and touch targets
const rippleButtons = document.querySelectorAll('.ripple-btn, .touch-ripple, a.nav-link');
rippleButtons.forEach(btn => {
    btn.addEventListener('pointerdown', function(e) {
        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;
        
        let ripples = document.createElement('span');
        ripples.classList.add('ripple');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        this.appendChild(ripples);
        
        setTimeout(() => {
            ripples.remove();
        }, 1000); // match animation duration + buffer
    });
});

// 3D Tilt Effect
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
    
    card.addEventListener('mousemove', e => {
        let rect = card.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        let midX = rect.width / 2;
        let midY = rect.height / 2;
        
        // Dampen the angle aggressively to prevent edge-slip
        let angleX = -(y - midY) / 25; 
        let angleY = (x - midX) / 25;
        
        // Enforce a hard maximum tilt limit
        angleX = Math.max(-6, Math.min(6, angleX));
        angleY = Math.max(-6, Math.min(6, angleY));
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1, 1, 1)`;
        card.style.zIndex = "10"; // Bring to front while tilting
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease';
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.zIndex = "1";
    });
});

// Page Transition & Scroll Navigation Logic
const mainContent = document.getElementById('main-content');
const links = document.querySelectorAll('a.nav-link');

const pagesOrder = [
    'index.html',
    'about.html',
    'skills.html',
    'projects.html',
    'experience.html'
];

let isNavigating = false;

function navigateToUrl(targetUrl) {
    if (isNavigating) return;
    isNavigating = true;
    
    if (mainContent) {
        mainContent.classList.remove('page-enter-active');
        mainContent.classList.add('page-exit-active');
    }
    
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 300); // Matches CSS transition duration
}

// Run entrance animation on DOM load
document.addEventListener('DOMContentLoaded', () => {
    if(mainContent) {
        mainContent.classList.add('page-enter');
        requestAnimationFrame(() => {
            mainContent.classList.add('page-enter-active');
        });
    }
});

// Intercept link clicks for exit animation
links.forEach(link => {
    link.addEventListener('click', e => {
        const targetUrl = link.href;
        if (targetUrl.includes('.html')) {
            e.preventDefault();
            navigateToUrl(targetUrl);
        }
    });
});

// Scroll intensity logic for tab switching
let scrollAccumulator = 0;
let lastScrollTime = Date.now();

window.addEventListener('wheel', (e) => {
    if (isNavigating) return;

    // Reset accumulator if there's a pause in scrolling
    const now = Date.now();
    if (now - lastScrollTime > 250) {
        scrollAccumulator = 0;
    }
    lastScrollTime = now;

    // Accumulate scroll intensity
    scrollAccumulator += e.deltaY;

    const isAtTop = window.scrollY <= 0;
    const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5;

    // Current page index
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';
    
    // Check if there's a hash or query param and strip it
    currentPath = currentPath.split('?')[0].split('#')[0];
    
    const currentIndex = pagesOrder.indexOf(currentPath);

    // If accumulated intensity is high enough, switch tabs
    const INTENSITY_THRESHOLD = 250; // Adjust for sensitivity
    
    if (scrollAccumulator > INTENSITY_THRESHOLD && isAtBottom && currentIndex !== -1 && currentIndex < pagesOrder.length - 1) {
        navigateToUrl(pagesOrder[currentIndex + 1]);
    } else if (scrollAccumulator < -INTENSITY_THRESHOLD && isAtTop && currentIndex > 0) {
        navigateToUrl(pagesOrder[currentIndex - 1]);
    }
}, { passive: true });

// Liquid glass orb follow cursor (optional hero visual effect if present)
const liquidOrb = document.querySelector('.liquid-glass-orb');
if(liquidOrb) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        liquidOrb.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });
}

// Contact Modal Logic
const contactModalHTML = `
<div id="contact-modal" class="modal-overlay">
    <div class="modal-content glass-panel tilt-card">
        <button class="modal-close" id="modal-close-btn"><i class="fas fa-times"></i></button>
        <h2 class="modal-title">Let's Connect!</h2>
        <p class="modal-desc">I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out directly.</p>
        <div class="contact-methods">
            <div class="contact-method-wrapper" style="display:flex; gap:10px;">
                <a href="tel:+918260914488" class="contact-method-card clay-card ripple-btn" style="flex:1;">
                    <i class="fas fa-phone-alt"></i>
                    <div class="method-details">
                        <span class="method-label">Call Me</span>
                        <span class="method-value">+91 8260914488</span>
                    </div>
                </a>
                <button class="copy-btn btn clay-card" data-copy="+91 8260914488" style="padding: 0 1.5rem; display:flex; align-items:center; justify-content:center; cursor: none;" title="Copy Phone Number"><i class="far fa-copy"></i></button>
            </div>
            <div class="contact-method-wrapper" style="display:flex; gap:10px;">
                <a href="mailto:srikarasasankv@gmail.com" class="contact-method-card clay-card ripple-btn" style="flex:1;">
                    <i class="fas fa-envelope"></i>
                    <div class="method-details">
                        <span class="method-label">Email Me</span>
                        <span class="method-value">srikarasasankv@gmail.com</span>
                    </div>
                </a>
                <button class="copy-btn btn clay-card" data-copy="srikarasasankv@gmail.com" style="padding: 0 1.5rem; display:flex; align-items:center; justify-content:center; cursor: none;" title="Copy Email"><i class="far fa-copy"></i></button>
            </div>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', contactModalHTML);

const modalOverlay = document.getElementById('contact-modal');
const closeBtn = document.getElementById('modal-close-btn');
const contactTriggers = document.querySelectorAll('.contact-modal-trigger');

contactTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('active');
    });
});

if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
}

if(modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

// Copy to clipboard logic
const copyBtns = document.querySelectorAll('.copy-btn');
copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const icon = btn.querySelector('i');
            icon.className = 'fas fa-check';
            icon.style.color = 'var(--accent-cyan)';
            setTimeout(() => {
                icon.className = 'far fa-copy';
                icon.style.color = '';
            }, 2000);
        });
    });
});

// Re-apply cursor hover logic for the new modal elements
const newInteractiveElements = modalOverlay.querySelectorAll("a, .btn, button");
newInteractiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
        if(typeof cursorOutline !== 'undefined' && cursorOutline) {
            cursorOutline.classList.add("cursor-hover");
        }
    });
    el.addEventListener("mouseleave", () => {
        if(typeof cursorOutline !== 'undefined' && cursorOutline) {
            cursorOutline.classList.remove("cursor-hover");
        }
    });
});
