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

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
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
    card.addEventListener('mousemove', e => {
        let rect = card.getBoundingClientRect();
        let x = e.clientX - rect.left; // x position within the element.
        let y = e.clientY - rect.top;  // y position within the element.
        
        // Calculate tilt
        let midX = rect.width / 2;
        let midY = rect.height / 2;
        // Limit the angle degree to a max of maybe 15 degrees
        let angleX = -(y - midY) / 10; 
        let angleY = (x - midX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none'; // remove transition during hover
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // restore transition
    });
});

// Page Transition Logic
const mainContent = document.getElementById('main-content');
const links = document.querySelectorAll('a.nav-link');

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
        // We only do the animation if it's linking to our own pages
        if (targetUrl.includes('.html')) {
            e.preventDefault();
            
            // Remove enter active, trigger exit active
            if(mainContent) {
                mainContent.classList.remove('page-enter-active');
                mainContent.classList.add('page-exit-active');
            }
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600); // 0.6s matches CSS transition duration
        }
    });
});

// Liquid glass orb follow cursor (optional hero visual effect if present)
const liquidOrb = document.querySelector('.liquid-glass-orb');
if(liquidOrb) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        liquidOrb.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });
}
