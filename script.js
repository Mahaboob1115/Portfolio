/* ==========================================================================
   DEVELOPER PORTFOLIO - MAIN INTERACTIVE LOGIC
   Features: Interactive Particles, Typing Animation, Scroll Observer, 
             Theme Switching, Project Filtering, Form Validation & Success State
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. CONSTANTS & SYSTEM INITIALIZATION
    // --------------------------------------------------------------------------
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // --------------------------------------------------------------------------
    // 2. THEME SWITCHING (DARK / LIGHT MODE)
    // --------------------------------------------------------------------------
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply initial theme
    if (currentTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // --------------------------------------------------------------------------
    // 3. RESPONSIVE MOBILE NAVIGATION MENU
    // --------------------------------------------------------------------------
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navLinks.classList.contains('mobile-active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close menu when clicking nav links
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });

    // --------------------------------------------------------------------------
    // 4. INTERACTIVE BACKGROUND PARTICLES CANVAS
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const numberOfParticles = 70;
    const maxConnectionDistance = 120;
    
    // Mouse properties
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Canvas sizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle constructor
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
            this.baseSize = this.size;
        }

        update() {
            // Screen boundaries
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

            this.x += this.speedX;
            this.y += this.speedY;

            // Interactive mouse hover zoom effect
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.size = this.baseSize * (1 + (mouse.radius - distance) / 30);
                } else {
                    this.size = this.baseSize;
                }
            } else {
                this.size = this.baseSize;
            }
        }

        draw() {
            // Use CSS property colors for theme responsiveness
            const isDark = body.classList.contains('dark-theme');
            ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(99, 102, 241, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    // Draw connection lines between nearby particles
    function connectParticles() {
        const isDark = body.classList.contains('dark-theme');
        const lineColor = isDark ? '6, 182, 212' : '99, 102, 241';
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxConnectionDistance) {
                    let opacity = (1 - (distance / maxConnectionDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Re-initialize particles on screen resize to balance density
    window.addEventListener('resize', initParticles);

    // --------------------------------------------------------------------------
    // 5. DYNAMIC HERO SECTION TYPING ANIMATION
    // --------------------------------------------------------------------------
    const typingSpan = document.getElementById('typing-text');
    const phrases = ["Computer Science Graduate.", "Full Stack Developer.", "Spring Boot & React Developer.", "Machine Learning Enthusiast."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Deleting text
            typingSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            // Typing text
            typingSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // State changes
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 300; // Pause before typing new phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }
    // Start Typing
    setTimeout(typeEffect, 1000);

    // --------------------------------------------------------------------------
    // 6. SCROLL REVEAL & NAVIGATION HIGHLIGHTING (INTERSECTION OBSERVER)
    // --------------------------------------------------------------------------
    
    // Scrolled Navbar styling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Toggle back-to-top button visibility
        if (window.scrollY > 600) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });

    // Reveal Elements on Scroll
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    const revealSections = document.querySelectorAll('.scroll-reveal');
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // Active Nav Item highlighting based on section scroll
    const navObserverOptions = {
        root: null,
        threshold: 0.5, // 50% of the section must be visible
        rootMargin: '-50px 0px -50px 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${activeId}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --------------------------------------------------------------------------
    // 7. PROJECT FILTERING LOGIC
    // --------------------------------------------------------------------------
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active class on button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Animate filter transitions
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 8. CONTACT FORM VALIDATION & POPUP SUCCESS NOTIFICATION
    // --------------------------------------------------------------------------
    const successPopup = document.getElementById('popup-notification');
    const closePopupBtn = document.getElementById('popup-close-btn');

    // Email regex check helper
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Input blur event validation (instant feedback)
    const inputsToValidate = [
        { el: document.getElementById('form-name'), errEl: document.getElementById('name-error'), validation: val => val.trim().length > 0 },
        { el: document.getElementById('form-email'), errEl: document.getElementById('email-error'), validation: val => isValidEmail(val) },
        { el: document.getElementById('form-message'), errEl: document.getElementById('message-error'), validation: val => val.trim().length > 0 }
    ];

    inputsToValidate.forEach(item => {
        item.el.addEventListener('blur', () => {
            if (!item.validation(item.el.value)) {
                item.el.parentElement.classList.add('has-error');
            } else {
                item.el.parentElement.classList.remove('has-error');
            }
        });

        // Clear error styling on active typing
        item.el.addEventListener('input', () => {
            if (item.validation(item.el.value)) {
                item.el.parentElement.classList.remove('has-error');
            }
        });
    });

    // Form submit check
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let hasErrors = false;

        inputsToValidate.forEach(item => {
            if (!item.validation(item.el.value)) {
                item.el.parentElement.classList.add('has-error');
                hasErrors = true;
            } else {
                item.el.parentElement.classList.remove('has-error');
            }
        });

        if (!hasErrors) {
            // Form is valid! Simulate API post loading & show popup
            const submitBtn = document.getElementById('btn-submit');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');
            
            // Loading state
            submitBtn.disabled = true;
            submitBtnText.textContent = "Sending...";
            submitBtnIcon.className = "fas fa-spinner fa-spin";

            setTimeout(() => {
                // Success trigger
                successPopup.classList.add('show');
                contactForm.reset();
                
                // Clear active floating labels (not placeholders)
                document.querySelectorAll('.form-group').forEach(grp => {
                    grp.classList.remove('has-error');
                });
                
                // Reset submit button
                submitBtn.disabled = false;
                submitBtnText.textContent = "Send Message";
                submitBtnIcon.className = "fas fa-paper-plane";
            }, 1500);
        }
    });

    // Success Popup Close handlers
    closePopupBtn.addEventListener('click', () => {
        successPopup.classList.remove('show');
    });

    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            successPopup.classList.remove('show');
        }
    });
});
