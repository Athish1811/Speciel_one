/**
 * main.js - Global Logic Context
 * Handles Page Loader, Scroll Animations, Gallery Rendering, and Interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. GLOBAL LOADER
    const loader = document.getElementById("global-loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.remove(), 500); // Fully remove after fade out
        }, 800); // Minimal display time
    }

    // 2. SCROLL ANIMATIONS (Intersection Observer)
    const fadeElements = document.querySelectorAll(".fade-up");
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        fadeElements.forEach(el => observer.observe(el));
    }

    // 3. RENDER GALLERY (For memories.html)
    const grid = document.getElementById("photoGrid");
    if (grid) {
        initGallery(grid);
    }

    // 4. MUSIC CONTROLS (For promise.html)
    initMusicControls();
    
    // 5. RENDER BACKGROUND HEARTS (For index.html and promise.html)
    initFloatingHearts();
});

/* ================= GALLERY LOGIC ================= */
function initGallery(gridElement) {
    const photos = [
        "img 1.jpeg","2.jpeg","3.jpeg","4.jpeg","5.jpeg","6.jpeg","7.jpeg","8.jpeg","9.jpeg","10.jpeg",
        "11.jpeg","12.jpeg","13.jpeg","14.jpeg","15.jpeg","16.jpeg","17.jpeg","18.jpeg","19.jpeg","20.jpeg",
        "21.jpeg","22.jpeg","23.jpeg","24.jpeg","25.jpeg","26.jpeg","27.jpeg","28.jpeg","29.jpeg","30.jpeg",
        "31.jpeg","32.jpeg","33.jpeg","34.jpeg","35.jpeg","36.jpeg","37.jpeg","38.jpeg","39.jpeg","40.jpeg",
        "41.jpeg","42.jpeg","43.jpeg","44.jpeg","45.jpeg","46.jpeg","47.jpeg","48.jpeg","49.jpeg","50.jpeg",
        "51.jpeg","52.jpeg","53.jpeg","54.jpeg","55.jpeg","56.jpeg","57.jpeg","58.jpeg","59.jpeg","60.jpeg",
        "61.jpeg","62.jpeg","63.jpeg","64.jpeg","65.jpeg","66.jpeg","67.jpeg","68.jpeg","69.jpeg","70.jpeg",
        "71.jpeg","72.jpeg","73.jpeg","74.jpeg","75.jpeg","76.jpeg","77.jpeg","78.jpeg","79.jpeg"
    ];

    const videos = [
        "80.mp4", "81.mp4", "82.mp4", "83.mp4", "84.mp4", "85.mp4", "86.mp4", "87.mp4"
    ];

    const uniquePhotos = [...new Set(photos)];
    const uniqueVideos = [...new Set(videos)];

    // Document fragment for better performance rendering instead of multiple appends
    const fragment = document.createDocumentFragment();

    uniquePhotos.forEach((src, index) => {
        const div = document.createElement("article");
        div.className = "media-item fade-up";
        // Lazy load for performance!
        div.innerHTML = `<img src="${src}" alt="Memory ${index + 1}" loading="lazy">`;
        fragment.appendChild(div);
    });

    uniqueVideos.forEach((src) => {
        const div = document.createElement("article");
        div.className = "media-item fade-up";
        div.innerHTML = `<video src="${src}" controls preload="metadata"></video>`;
        fragment.appendChild(div);
    });

    gridElement.appendChild(fragment);
}

/* ================= INTERACTIVITY ================= */
// Used by the button in memories.html
window.sayNo = function() {
    const noBtn = document.getElementById("noBtn");
    if (!noBtn) return;
    
    // Prevent button from going completely off screen
    const safeMargin = 50; 
    const maxX = window.innerWidth - noBtn.offsetWidth - safeMargin;
    const maxY = window.innerHeight - noBtn.offsetHeight - safeMargin;
    
    noBtn.style.position = "fixed";
    noBtn.style.left = Math.max(safeMargin, Math.random() * maxX) + "px";
    noBtn.style.top = Math.max(safeMargin, Math.random() * maxY) + "px";
};

window.sayYes = function() {
    window.location.href = "promise.html";
};

window.goBack = function() {
    window.location.href = "memories.html";
};

/* ================= BACKGROUND HEARTS ================= */
function initFloatingHearts() {
    // For index.html
    const pinkHeartsContainer = document.querySelector('.hearts-bg');
    if (pinkHeartsContainer) {
        const emojis = ['❤️', '💕', '💖', '💗', '💝'];
        for (let i = 0; i < 15; i++) {
            const h = document.createElement('div');
            h.className = 'floating-heart';
            h.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            h.style.left = Math.random() * 100 + "%";
            h.style.animationDelay = (Math.random() * 5) + "s";
            h.style.animationDuration = (8 + Math.random() * 6) + "s";
            pinkHeartsContainer.appendChild(h);
        }
    }

    // For promise.html
    if (document.body.classList.contains("page-promise")) {
        for(let i=0; i<30; i++) {
            const heart = document.createElement("div");
            heart.classList.add("blue-heart");
            heart.innerHTML = "💙";
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.fontSize = (15 + Math.random()*25) + "px";
            heart.style.animationDuration = (4 + Math.random()*4) + "s";
            heart.style.animationDelay = (Math.random() * 4) + "s";
            document.body.appendChild(heart);
        }
    }
}

/* ================= MUSIC CONTROLS ================= */
function initMusicControls() {
    const musicContainer = document.getElementById("music-container");
    const audioEl = document.getElementById("bgMusic");
    
    if (musicContainer && audioEl) {
        const songs = [
            "5.mpeg", "1.mpeg", "2.mpeg", "3.mpeg", "4.mpeg", "6.mpeg", "7.mpeg", "9.mpeg"
        ];
        
        // Retrieve and increment song index
        let index = parseInt(localStorage.getItem("songIndex")) || 0;
        index = (index + 1) % songs.length;
        localStorage.setItem("songIndex", index);
        
        audioEl.src = songs[index];
        
        // Attempt autoplay
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.log("Autoplay blocked. User interaction required.");
            });
        }

        let isPlaying = !audioEl.paused;

        // Create UI
        musicContainer.innerHTML = `
            <div class="music-controls">
                <button id="toggleMusic" class="music-btn" title="Play/Pause">
                    ${isPlaying ? '⏸️' : '▶️'}
                </button>
                <button id="nextMusic" class="music-btn" title="Next Song">
                    ⏭️
                </button>
            </div>
        `;

        const toggleBtn = document.getElementById("toggleMusic");
        const nextBtn = document.getElementById("nextMusic");

        // UI Event Listeners
        toggleBtn.addEventListener('click', () => {
            if (audioEl.paused) {
                audioEl.play();
                toggleBtn.innerText = '⏸️';
            } else {
                audioEl.pause();
                toggleBtn.innerText = '▶️';
            }
        });

        nextBtn.addEventListener('click', () => {
            index = (index + 1) % songs.length;
            localStorage.setItem("songIndex", index);
            audioEl.src = songs[index];
            audioEl.play();
            toggleBtn.innerText = '⏸️';
        });

        // Ensure button resets if audio ends without loop
        audioEl.addEventListener('ended', () => {
            nextBtn.click(); // Auto play next song
        });
    }
}
