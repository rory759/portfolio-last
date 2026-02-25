document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Disable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: 'forwards' });
        });

        // Add hover effect on interactive elements
        const interactives = document.querySelectorAll('a, button, .art-card, .skill-card, input, textarea');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // --- Loading Overlay Fade Out & Typing ---
    const loader = document.getElementById('loader');
    const loaderTextType = document.querySelector('.loader-text-type');

    if (loader && loaderTextType) {
        const textToType = "";
        let typeIndex = 0;

        let audioCtx;
        function playTypingSound() {
            try {
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (audioCtx.state === 'suspended') audioCtx.resume();

                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(400 + Math.random() * 200, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.05);
            } catch (e) {
                console.log('Audio autoplay blocked by browser', e);
            }
        }

        function typeChar() {
            if (typeIndex < textToType.length) {
                loaderTextType.textContent += textToType.charAt(typeIndex);
                typeIndex++;
                playTypingSound();
                setTimeout(typeChar, 80 + Math.random() * 60);
            } else {
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, 1000);
            }
        }

        setTimeout(typeChar, 300);

    } else if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2000);
    }

    // --- Navbar Scroll Effect & Active Link ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Navbar styling
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // --- Mobile Menu Toggle ---
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.onclick = () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');

                // Toggle icon
                const icon = mobileMenuBtn.querySelector('i');
                if (navLinks.classList.contains('active')) {
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            };

            // Close menu when clicking links
            const navLinksItems = document.querySelectorAll('.nav-link');
            navLinksItems.forEach(link => {
                link.onclick = () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.replace('fa-xmark', 'fa-bars');
                };
            });
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Toggle in-hero class for cursor color
        const hero = document.getElementById('video-sequence');
        if (hero) {
            const rect = hero.getBoundingClientRect();
            if (rect.bottom > 100) {
                document.body.classList.add('in-hero');
            } else {
                document.body.classList.remove('in-hero');
            }
        }
    });

    // Set initial hero state
    const hero = document.getElementById('video-sequence');
    if (hero && hero.getBoundingClientRect().bottom > 100) {
        document.body.classList.add('in-hero');
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Reveal Animations Settings ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Parallax Hero Effect ---
    const heroSection = document.querySelector('.hero-section');
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const floatEls = document.querySelectorAll('.float-el');

    if (heroSection && !isTouchDevice) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.clientX * 2) / 90;
            const y = (window.innerHeight - e.clientY * 2) / 90;

            // Move card
            parallaxElements.forEach(el => {
                el.style.transform = `rotateY(${-x}deg) rotateX(${y}deg)`;
            });

            // Move floating elements inverse
            floatEls.forEach((el, index) => {
                const multi = index === 0 ? 1.5 : -1.5;
                el.style.transform = `translate(${x * multi * 10}px, ${y * multi * 10}px)`;
            });

            // Move background glows slightly
            const bgX = (e.clientX / window.innerWidth) * 20;
            const bgY = (e.clientY / window.innerHeight) * 20;
            const orb1 = document.querySelector('.orb-1');
            if (orb1) orb1.style.transform = `translate(${bgX}px, ${bgY}px)`;
        });

        // Reset on leave
        heroSection.addEventListener('mouseleave', () => {
            parallaxElements.forEach(el => el.style.transform = `rotateY(0) rotateX(0)`);
            floatEls.forEach(el => el.style.transform = `translate(0, 0)`);
        });
    }

    // --- Hero HUD Interactions ---
    const hudActions = document.querySelectorAll('.btn-hud-main, .btn-hud-action, .btn-hud-outline');
    hudActions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('href');
            if (targetId && targetId === '#video-sequence') {
                // Do nothing, already at top
                return;
            }
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
        });
    }

    // --- Lightbox Media Viewer ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.art-card');
            const mediaType = card.getAttribute('data-media-type') || 'image';
            const title = card.querySelector('h4').textContent;
            lightbox.style.display = "block";
            lightboxCaption.innerHTML = ""; // No text, only media
            document.body.style.overflow = 'hidden';

            if (mediaType === 'video') {
                const videoSrc = card.getAttribute('data-video-src');
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = videoSrc;
                lightboxVideo.play();
            } else {
                const bgImage = card.querySelector('.art-image').style.backgroundImage;
                const imageUrl = bgImage.slice(5, -2);
                lightboxVideo.style.display = 'none';
                lightboxVideo.pause();
                lightboxImg.style.display = 'block';
                lightboxImg.src = imageUrl;
            }
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = "none";
        lightboxVideo.pause();
        lightboxVideo.src = "";
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });
    }


    // --- Show All Items logic (External Archive) ---
    const showAllBtn = document.querySelector('.view-all-wrap .btn-outline-glow');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('archive.html', '_blank');
        });
    }

    // --- Sidebar Videos Lightbox ---
    const sidebarCards = document.querySelectorAll('.sidebar-card');
    sidebarCards.forEach(card => {
        card.addEventListener('click', () => {
            const video = card.querySelector('video');
            if (video) {
                lightbox.style.display = "block";
                lightboxCaption.innerHTML = "";
                document.body.style.overflow = 'hidden';

                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = video.getAttribute('src');
                lightboxVideo.play();
            }
        });
    });
});