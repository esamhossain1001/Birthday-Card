// --- CONFIGURATION ---
gsap.registerPlugin(ScrollTrigger);

// --- 0. AUDIO MANAGEMENT ---
const bgMusic = document.getElementById('bg-music');
const cakeAudio = document.getElementById('cake-audio');
const cameraAudio = document.getElementById('camera-audio');
const soundBtn = document.getElementById('sound-btn');
let isMusicPlaying = false;

// Function to play sound effects safely
function playSfx(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0; // Reset to start
        audioElement.play().catch(e => console.warn("SFX Playback failed:", e));
    }
}

// Background Music Toggle
if (soundBtn && bgMusic) {
    soundBtn.addEventListener('click', () => {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                soundBtn.style.opacity = '1';
                soundBtn.style.transform = "scale(1.1)";
            }).catch(e => console.warn("Music Playback failed:", e));
        } else {
            bgMusic.pause();
            isMusicPlaying = false;
            soundBtn.style.opacity = '0.7';
            soundBtn.style.transform = "scale(1)";
        }
    });
}

// --- 1. LOADER & INITIALIZATION ---
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');

    // Fade out loader
    gsap.to(loader, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            loader.style.display = 'none';
            initMainAnimations(); // Start the show
        }
    });
});

// --- 2. MAIN ANIMATIONS ---
function initMainAnimations() {

    // Continuous Gentle Hover (Bobbing)
    gsap.to('.walker-img', {
        y: -10,
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    // A. Hero Fade In
    gsap.from('.hero-content', { opacity: 0, y: 50, duration: 1.5, delay: 0.5 });

    // B. Journey Scroll Sequence
    const journey = document.getElementById('journey');
    const track = document.querySelector('.journey-track');

    if (journey && track) {
        // Calculate horizontal scroll distance
        const totalScroll = track.scrollWidth - window.innerWidth;

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: journey,
                pin: true,
                scrub: 1,
                start: "top top",
                end: "+=4000",
            }
        });

        // Move the world left
        tl.to(track, { x: -totalScroll, ease: "none", duration: 10 });

        // Move the road texture (infinite illusion)
        tl.to('.road-texture', { backgroundPositionX: "-2000px", ease: "none", duration: 10 }, "<");

        // --- CHARACTER ANIMATION SEQUENCE ---

        // 1. Girl Walks (Default state is visible)

        // 2. Year 2019 (approx time 6.0/10): Swap Girl -> Couple
        tl.to('.girl-walker', { opacity: 0, duration: 0.5 }, 6.0);
        tl.to('.couple-walker', { opacity: 1, duration: 0.5 }, 6.0);

        // 3. Finale (approx time 8.5/10): Couple walks off screen
        tl.to('.couple-walker', { x: '120vw', duration: 2.0, ease: "power1.in" }, 8.5);

        // 4. Reveal "Click to Capture" Trigger interactively
        tl.to('#photo-trigger', { opacity: 1, pointerEvents: 'all', scale: 1, duration: 0.5, ease: 'back.out' }, 9.5);
    }
}

// --- 3. INTERACTIONS ---

// A. Message Cards (Flip)
document.querySelectorAll('.msg-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// B. Make a Wish (Cake)
const cakeContainer = document.getElementById('cake-container');
const flame = document.querySelector('.flame');
const wishText = document.querySelector('.wish-text');

if (cakeContainer && flame) {
    cakeContainer.addEventListener('click', () => {
        if (!flame.classList.contains('out')) {
            // Visuals
            flame.classList.add('out');
            if (wishText) wishText.innerHTML = "Your wish has been made! <br> May it come true... ✨";

            // Audio
            playSfx(cakeAudio);

            // Confetti
            if (typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            }

            // Reveal Surprise Characters (Naruto & Tanjiro)
            document.querySelectorAll('.surprise-char').forEach(char => {
                char.classList.add('revealed');
            });
        }
    });
}

// C. Finale (Camera Shutter)
const photoTrigger = document.getElementById('photo-trigger');
const overlay = document.getElementById('celebration-overlay');
const shutterTop = document.querySelector('.shutter-top');
const shutterBottom = document.querySelector('.shutter-bottom');

if (photoTrigger && overlay) {
    photoTrigger.addEventListener('click', () => {
        // 1. Play Sound
        playSfx(cameraAudio);

        // 2. Animate Shutter CLOSE
        document.body.classList.add('shutter-closed');

        // 2b. Auto-Scroll to ensure full view
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        // 3. Wait for close, then reveal content and open
        setTimeout(() => {
            // Show Overlay (behind shutter)
            overlay.classList.remove('hidden');
            overlay.classList.add('visible');

            // Hide Trigger
            gsap.set(photoTrigger, { opacity: 0, display: 'none' });

            // Confetti
            if (typeof confetti === 'function') {
                confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
            }

            // 4. BIG REVEAL (Shutter Open)
            setTimeout(() => {
                document.body.classList.remove('shutter-closed');
            }, 300); // Short pause while closed

        }, 400); // Sync with CSS transition time (0.4s)
    });
}
