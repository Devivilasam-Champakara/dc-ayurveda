// Extracted JS from index.html (main logic)
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

// 0. Video Playlist Logic
const heroVideo = document.getElementById('hero-video');
const videoPlaylist = ['assets/videos/background.mp4', 'assets/videos/background2.mp4'];
let currentVideoIndex = 0;

if (heroVideo) {
    heroVideo.addEventListener('ended', () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
        heroVideo.src = videoPlaylist[currentVideoIndex];
        heroVideo.play();
    });
}

// 1. Loading Screen Animation (The Curtain)
const loader = document.getElementById('global-loader');

function transitionToPage(pageId) {
    // Check if already on page
    if(document.getElementById(pageId).classList.contains('active')) return;

    // Slide Curtain Down
    gsap.to(loader, { 
        y: 0, 
        duration: 0.8, 
        ease: "power4.inOut",
        onStart: () => {
            // Reset Loader Text
            gsap.set(".loader-text", { opacity: 0, y: 20 });
            gsap.set(".loader-sub", { opacity: 0, y: 10 });
            gsap.set(".loader-line", { width: 0 });
        },
        onComplete: () => {
            // 1. Animate Loader Content (Simulate Load)
            const tl = gsap.timeline();
            tl.to(".loader-text", { opacity: 1, y: 0, duration: 0.5 })
              .to(".loader-sub", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
              .to(".loader-line", { width: "100px", duration: 0.6, ease: "power2.inOut" }, "-=0.3")
              .to(".loader-content", { opacity: 0, y: -20, duration: 0.4, delay: 0.4 }); // Fade out text

            // 2. Switch Pages Logic (Hidden behind curtain)
            setTimeout(() => {
                document.querySelectorAll('.page-section').forEach(el => {
                    el.classList.remove('active');
                    el.style.display = 'none';
                });
                const next = document.getElementById(pageId);
                next.style.display = 'block';
                next.classList.add('active');
                window.scrollTo(0,0);
                
                // 3. Slide Curtain Up (Reveal)
                gsap.to(loader, { 
                    y: "-100%", 
                    duration: 1, 
                    ease: "power4.inOut",
                    delay: 0.2, // Small pause for drama
                    onComplete: () => {
                        gsap.set(loader, { y: "100%" }); // Reset to bottom for next slide up
                        ScrollTrigger.refresh();
                    }
                });
            }, 2000); // Wait for loader animation text
        }
    });
}

// Initial Load
window.addEventListener('load', () => {
    // Initial transition logic manually
    gsap.fromTo(loader, { y: 0 }, {
        y: "-100%", duration: 1.2, delay: 1.5, ease: "power4.inOut"
    });
    gsap.to(".loader-text", { opacity: 1, y: 0, duration: 0.8 });
    gsap.to(".loader-sub", { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
    gsap.to(".loader-line", { width: "100px", duration: 1, delay: 0.4 });
    
    // Hero Text Reveal (After Loader)
    setTimeout(() => {
        gsap.to(".line-reveal span", { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" });
        gsap.to(".reveal-text", { opacity: 1, y: 0, duration: 1, delay: 0.5 });
    }, 2200);
});

// 2. Audio Logic
const audioBtn = document.getElementById('audio-btn');
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0; // Start silent

// Auto-play attempt (may be blocked by browser)
setTimeout(() => {
    audioBtn.click(); // Simulate button click
}, 2500); // After loading screen

audioBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                gsap.to(bgMusic, { volume: 0.15, duration: 3 }); // Fade In
                audioBtn.classList.remove('paused');
            }).catch(error => console.log("Audio Error:", error));
        }
    } else {
        gsap.to(bgMusic, { 
            volume: 0, 
            duration: 1, 
            onComplete: () => { bgMusic.pause(); audioBtn.classList.add('paused'); } 
        });
    }
});

// 2b. Mobile Menu Functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');
    const icon = menuToggle.querySelector('svg');
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
    } else {
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');
    const icon = menuToggle.querySelector('svg');
    
    mobileMenu.classList.remove('active');
    icon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
}

// 3. Smooth Booking Scroll
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

function smoothScrollToBooking() {
    const home = document.getElementById('home');
    if (!home.classList.contains('active')) {
        transitionToPage('home');
        // Wait for curtain to lift (approx 3.2s total based on delays)
        setTimeout(() => {
            lenis.scrollTo('#booking', { duration: 2.5 });
        }, 3500);
    } else {
        lenis.scrollTo('#booking', { duration: 2.5 });
    }
}

// 4. Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');

// Detect if device supports hover (not a touch device)
const isTouchDevice = () => {
    return (
        (typeof window !== 'undefined' && navigator.maxTouchPoints > 0) ||
        (typeof window !== 'undefined' && navigator.msMaxTouchPoints > 0)
    );
};

// Initialize custom cursor based on device type
if (!isTouchDevice()) {
    // Desktop: show on mousemove
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });
    
    document.querySelectorAll('a, button, .hover-trigger').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
    
    // Keep cursors visible on desktop
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorCircle) cursorCircle.style.opacity = '1';
} else {
    // Mobile: start hidden, show on touch
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorCircle) cursorCircle.style.opacity = '0';
    
    // Show cursor on touch
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        gsap.to(cursorDot, { x: touch.clientX, y: touch.clientY, opacity: 1, duration: 0.2 });
        gsap.to(cursorCircle, { x: touch.clientX, y: touch.clientY, opacity: 1, duration: 0.3 });
    });
    
    // Update cursor position during touch
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        gsap.to(cursorDot, { x: touch.clientX, y: touch.clientY, duration: 0.1 });
        gsap.to(cursorCircle, { x: touch.clientX, y: touch.clientY, duration: 0.3 });
    });
    
    // Hide cursor when touch ends
    document.addEventListener('touchend', () => {
        gsap.to(cursorDot, { opacity: 0, duration: 0.3 });
        gsap.to(cursorCircle, { opacity: 0, duration: 0.3 });
    });
}

// Booking modal controls (with GSAP animations)
const bookingModal = document.getElementById('bookingModal');
const bookingPanel = document.getElementById('bookingPanel');
const modalOverlay = document.getElementById('modalOverlay');
const bookingStatus = document.getElementById('bookingStatus');
const bookingError = document.getElementById('bookingError');

function openBookingModal() {
    bookingStatus.classList.add('hidden');
    bookingError.classList.add('hidden');
    // show container
    bookingModal.classList.remove('hidden');
    bookingModal.classList.add('flex');
    // prevent background scroll
    document.body.style.overflow = 'hidden';

    // initial states
    gsap.set(modalOverlay, { opacity: 0 });
    gsap.set(bookingPanel, { y: 30, opacity: 0, scale: 0.98 });

    // animate in overlay + panel
    const tl = gsap.timeline();
    tl.to(modalOverlay, { opacity: 1, duration: 0.24, ease: 'power1.out' })
      .to(bookingPanel, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }, '-=0.12');
}

function closeBookingModal() {
    // animate out, then hide
    const tl = gsap.timeline({ onComplete: () => {
        bookingModal.classList.remove('flex');
        bookingModal.classList.add('hidden');
        document.body.style.overflow = '';
        gsap.set(modalOverlay, { opacity: 0 });
        gsap.set(bookingPanel, { opacity: 0 });
    }});

    tl.to(bookingPanel, { y: 30, opacity: 0, scale: 0.98, duration: 0.28, ease: 'power3.in' })
      .to(modalOverlay, { opacity: 0, duration: 0.2, ease: 'power1.in' }, '-=0.18');
}

document.getElementById('closeBookingModal').addEventListener('click', closeBookingModal);
document.getElementById('modalOverlay').addEventListener('click', closeBookingModal);

// Formspree async submit (no page reload)
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    bookingStatus.classList.add('hidden');
    bookingError.classList.add('hidden');

    const action = bookingForm.action;
    const data = new FormData(bookingForm);

    fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            bookingStatus.classList.remove('hidden');
            bookingForm.reset();
            setTimeout(() => { closeBookingModal(); }, 2000);
        } else {
            response.json().then(err => {
                bookingError.classList.remove('hidden');
            }).catch(() => bookingError.classList.remove('hidden'));
        }
    }).catch(() => {
        bookingError.classList.remove('hidden');
    });
});

// Expose functions used by inline onclicks
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.transitionToPage = transitionToPage;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.smoothScrollToBooking = smoothScrollToBooking;
