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
    // We set a constant transition for smooth following
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
    
    card.addEventListener('mousemove', e => {
        let rect = card.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        let midX = rect.width / 2;
        let midY = rect.height / 2;
        
        // Dampen the angle aggressively to prevent edge-slip
        let angleX = -(y - midY) / 25; 
        let angleY = (x - midX) / 25;
        
        // Enforce a hard maximum tilt limit (e.g., 6 degrees)
        angleX = Math.max(-6, Math.min(6, angleX));
        angleY = Math.max(-6, Math.min(6, angleY));
        
        // Scale by 1.05 to ensure the card expands enough to counteract edge rotation
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.04, 1.04, 1.04)`;
        card.style.zIndex = "10"; // Bring to front while tilting
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease';
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.zIndex = "1";
        
        // Reset to fast tracking after it returns completely flat
        setTimeout(() => {
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
        }, 600);
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
