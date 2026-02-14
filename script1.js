  // Update copyright year automatically
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Custom Cursor (Desktop only)
        if (window.innerWidth > 768) {
            const cursor = document.querySelector('.cursor');
            const follower = document.querySelector('.cursor-follower');

            document.addEventListener('mousemove', (e) => {
                cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
                follower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
            });

            // Magnetic effect for buttons
            document.querySelectorAll('.cta-button, .nav-links a, .glass-card').forEach(button => {
                button.addEventListener('mouseenter', () => {
                    cursor.style.transform += ' scale(2)';
                    cursor.style.background = 'rgba(77, 212, 212, 0.3)';
                });
                button.addEventListener('mouseleave', () => {
                    cursor.style.background = 'transparent';
                });
            });
        }

        // Language Toggle
        const langToggle = document.getElementById('langToggle');
        let currentLang = 'ar';

        function applyLanguage(lang) {
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

            // Update all translatable elements
            document.querySelectorAll('[data-ar][data-en]').forEach(element => {
                element.textContent = element.getAttribute(`data-${lang}`);
            });

            // Ensure certain elements render RTL when Arabic is selected
            document.querySelectorAll('.dir-rtl-on-ar').forEach(el => {
                el.dir = lang === 'ar' ? 'rtl' : 'ltr';
            });
        }

        // Apply initial language on load
        applyLanguage(currentLang);

        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            applyLanguage(currentLang);
        });

        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        let isDark = true;

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            document.body.classList.toggle('light-mode');
            themeToggle.textContent = isDark ? '🌙' : '☀️';
        });

        // Hamburger Menu
        const hamburger = document.querySelector('.hamburger');
        const navCenter = document.querySelector('.nav-center');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navCenter.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navCenter.classList.remove('active');
            });
        });

        // Scroll Reveal Animation
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add glowing effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const nav = document.querySelector('nav');
            
            if (scrolled > 100) {
                nav.style.boxShadow = '0 10px 40px rgba(77, 212, 212, 0.2)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });

        // CTA Button Actions
        document.querySelectorAll('.cta-button').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.textContent.trim();
                if (text.includes('اكتشف') || text.includes('Discover')) {
                    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                } else if (text.includes('تواصل') || text.includes('Contact')) {
                    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Add particle effect on mouse move (Desktop only)
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', (e) => {
                if (Math.random() > 0.95) {
                    const particle = document.createElement('div');
                    particle.style.position = 'fixed';
                    particle.style.width = '4px';
                    particle.style.height = '4px';
                    particle.style.borderRadius = '50%';
                    particle.style.background = 'rgba(77, 212, 212, 0.5)';
                    particle.style.left = e.clientX + 'px';
                    particle.style.top = e.clientY + 'px';
                    particle.style.pointerEvents = 'none';
                    particle.style.zIndex = '9998';
                    particle.style.animation = 'particleFade 1s ease-out forwards';
                    document.body.appendChild(particle);
                    
                    setTimeout(() => particle.remove(), 1000);
                }
            });
        }

        // Add stagger animation to cards
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // 3D tilt effect for cards (Desktop only)
        if (window.innerWidth > 768) {
            document.querySelectorAll('.glass-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
                              });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                });
            });
        }