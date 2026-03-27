/* ============================================================
   ANIMATIONS ENGINE - Motion Graphics & 3D Interactive Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ======= INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =======
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // For staggered children
                const staggerChildren = entry.target.querySelectorAll('[style*="--delay"], [style*="--card-delay"], [style*="--g-delay"], [style*="--f-delay"]');
                staggerChildren.forEach(child => {
                    child.classList.add('visible');
                });
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animTargets = [
        '.anim-section-header',
        '.anim-card-3d',
        '.anim-service-card',
        '.anim-gallery-item',
        '.anim-feature',
        '.news-card',
        '.newsletter-box',
        '.contact-info .info-item',
        '.contact-form',
        '.footer-section',
        '.social-links a'
    ];

    animTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            animObserver.observe(el);
        });
    });

    // ======= HERO PARTICLES =======
    function createParticles(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 6 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;
            container.appendChild(particle);
        }
    }

    createParticles('heroParticles', 30);

    // Why Us floating dots
    function createWhyUsParticles() {
        const container = document.getElementById('whyUsParticles');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const dot = document.createElement('div');
            dot.className = 'particle';
            const size = Math.random() * 4 + 2;
            dot.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                background: rgba(212, 175, 55, 0.2);
                animation-duration: ${Math.random() * 12 + 8}s;
                animation-delay: ${Math.random() * 8}s;
            `;
            container.appendChild(dot);
        }
    }

    createWhyUsParticles();

    // ======= SCROLL TO TOP BUTTON =======
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ======= NAVBAR SCROLL EFFECT =======
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ======= 3D TILT EFFECT ON CARDS =======
    function addTiltEffect(elements) {
        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;

                el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    addTiltEffect(document.querySelectorAll('.service-card'));
    addTiltEffect(document.querySelectorAll('.gallery-item'));

    // ======= PARALLAX EFFECT ON SCROLL =======
    function parallaxScroll() {
        const scrolled = window.scrollY;

        // Hero parallax
        const heroContent = document.querySelector('.hero-content');
        const hero3d = document.querySelector('.hero-3d-scene');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
            if (hero3d) {
                hero3d.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        }

        // Floating bg shapes parallax
        const shapes = document.querySelectorAll('.bg-shape');
        shapes.forEach((shape, i) => {
            const speed = 0.03 * (i + 1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    window.addEventListener('scroll', parallaxScroll);

    // ======= ANIMATED NUMBER COUNTER =======
    function animateCounters() {
        const counterEls = document.querySelectorAll('[data-counter]');
        counterEls.forEach(el => {
            const target = parseInt(el.getAttribute('data-counter'), 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Check if counters exist and animate when visible
    const counterElements = document.querySelectorAll('[data-counter]');
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        counterElements.forEach(el => counterObserver.observe(el));
    }

    // ======= SMOOTH REVEAL FOR STAGGERED ITEMS =======
    function staggerReveal(selector, delayBetween) {
        const items = document.querySelectorAll(selector);
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target;
                    const children = parent.children;
                    Array.from(children).forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, i * delayBetween);
                    });
                    staggerObserver.unobserve(parent);
                }
            });
        }, { threshold: 0.2 });

        items.forEach(el => staggerObserver.observe(el));
    }

    // ======= MAGNETIC BUTTON EFFECT =======
    const magneticBtns = document.querySelectorAll('.btn-animated');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ======= TEXT TYPING EFFECT FOR HERO =======
    const heroH2 = document.querySelector('.hero-content h2');
    if (heroH2) {
        const text = heroH2.textContent;
        heroH2.textContent = '';
        heroH2.style.opacity = '1';
        heroH2.style.borderLeft = '2px solid var(--secondary-color)';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroH2.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 60);
            } else {
                heroH2.style.borderLeft = 'none';
            }
        }

        setTimeout(typeWriter, 1200);
    }

    // ======= SMOOTH SECTION TRANSITIONS =======
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
            }
        });
    }, { threshold: 0.05 });

    sections.forEach(section => sectionObserver.observe(section));

    // ======= SOCIAL LINKS STAGGER =======
    const socialContainer = document.querySelector('.social-links');
    if (socialContainer) {
        const socialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const links = entry.target.querySelectorAll('a');
                    links.forEach((link, i) => {
                        setTimeout(() => {
                            link.classList.add('visible');
                        }, i * 150);
                    });
                    socialObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        socialObserver.observe(socialContainer);
    }

    // ======= INFO ITEMS STAGGER =======
    const infoItems = document.querySelectorAll('.contact-info .info-item');
    const infoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    infoItems.forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.15}s`;
        infoObserver.observe(item);
    });

    // ======= FOOTER SECTIONS STAGGER =======
    const footerSections = document.querySelectorAll('.footer-section');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    footerSections.forEach((section, i) => {
        section.style.transitionDelay = `${i * 0.2}s`;
        footerObserver.observe(section);
    });

    // ======= NEWS SECTION OBSERVER =======
    const newsSection = document.getElementById('news');
    if (newsSection) {
        const newsObserver = new MutationObserver(() => {
            const newsCards = newsSection.querySelectorAll('.news-card');
            newsCards.forEach((card, i) => {
                card.style.transitionDelay = `${i * 0.15}s`;
                animObserver.observe(card);
            });
        });
        newsObserver.observe(newsSection, { childList: true, subtree: true });

        // Also observe existing
        const existingCards = newsSection.querySelectorAll('.news-card');
        existingCards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.15}s`;
            animObserver.observe(card);
        });

        const newsletterBox = newsSection.querySelector('.newsletter-box');
        if (newsletterBox) {
            animObserver.observe(newsletterBox);
        }
    }

    // ======= GALLERY 3D HOVER DEPTH =======
    const galleryItems = document.querySelectorAll('.anim-gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            const rotateY = x * 12;
            const rotateX = y * -8;

            item.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    // ======= SERVICE CARD HOVER RIPPLE =======
    document.querySelectorAll('.anim-service-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                background: radial-gradient(circle, rgba(123,30,58,0.15) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleExpand 0.6s ease-out forwards;
                pointer-events: none;
            `;

            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleExpand {
            to { transform: scale(2.5); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ======= SMOOTH SCROLL PROGRESS BAR =======
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 10001;
        width: 0%;
        transition: width 0.1s;
        border-radius: 0 2px 2px 0;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

});
