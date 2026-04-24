/* ============================================
   ADEIVAN & WESLEY — ADVOGADOS ASSOCIADOS
   Landing Page — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Header background on scroll
        if (scrollY > 80) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    let overlay = null;

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeMenu);
    }

    function openMenu() {
        hamburger.classList.add('active');
        nav.classList.add('open');
        if (!overlay) createOverlay();
        requestAnimationFrame(() => overlay.classList.add('show'));
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on link click
    document.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== SCROLL REVEAL ANIMATION (IntersectionObserver) =====
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ===== FORM VALIDATION =====
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            // Clear previous errors
            form.querySelectorAll('.contato__form-group').forEach(group => {
                group.classList.remove('error');
            });

            requiredFields.forEach(field => {
                const group = field.closest('.contato__form-group');
                
                if (!field.value.trim()) {
                    isValid = false;
                    group.classList.add('error');
                }

                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        group.classList.add('error');
                    }
                }

                // Phone validation (at least 10 digits)
                if (field.type === 'tel' && field.value.trim()) {
                    const digits = field.value.replace(/\D/g, '');
                    if (digits.length < 10) {
                        isValid = false;
                        group.classList.add('error');
                    }
                }
            });

            // LGPD consent check
            const lgpdCheckbox = document.getElementById('lgpdConsent');
            if (lgpdCheckbox && !lgpdCheckbox.checked) {
                isValid = false;
                const lgpdGroup = lgpdCheckbox.closest('.contato__form-group');
                if (lgpdGroup) lgpdGroup.classList.add('error');
            }

            if (isValid) {
                // Build WhatsApp message from form data
                const nome     = form.querySelector('#nome').value.trim();
                const email    = form.querySelector('#email').value.trim();
                const telefone = form.querySelector('#telefone').value.trim();
                const assunto  = form.querySelector('#assunto');
                const assuntoTexto = assunto.options[assunto.selectedIndex].text !== 'Selecione uma área'
                    ? assunto.options[assunto.selectedIndex].text
                    : 'Não informado';
                const mensagem = form.querySelector('#mensagem').value.trim();

                const texto = `Olá! Vim pelo site e gostaria de atendimento.\n\n` +
                    `*Nome:* ${nome}\n` +
                    `*E-mail:* ${email}\n` +
                    `*Telefone:* ${telefone}\n` +
                    `*Área:* ${assuntoTexto}\n\n` +
                    `*Mensagem:*\n${mensagem}`;

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecionando...';

                setTimeout(() => {
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
                    formSuccess.classList.add('show');
                    setTimeout(() => formSuccess.classList.remove('show'), 6000);

                    // Open WhatsApp with the message
                    const urlWA = `https://wa.me/5531988407802?text=${encodeURIComponent(texto)}`;
                    window.open(urlWA, '_blank');
                }, 800);
            }
        });

        // Remove error on input
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', () => {
                const group = field.closest('.contato__form-group');
                if (group) group.classList.remove('error');
            });
        });
    }

    // ===== PHONE MASK =====
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 7) {
                this.value = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7)}`;
            } else if (value.length > 3) {
                this.value = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3)}`;
            } else if (value.length > 2) {
                this.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else {
                this.value = value;
            }
        });
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    
    function activateNavLink() {
        const scrollY = window.scrollY + header.offsetHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.header__link').forEach(link => {
                    link.classList.remove('header__link--active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('header__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', activateNavLink, { passive: true });

    // ===== WHATSAPP FLOAT ANIMATION =====
    const whatsappFloat = document.getElementById('whatsappFloat');
    
    // Show WhatsApp button after scroll
    function toggleWhatsapp() {
        if (window.scrollY > 300) {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.transform = 'scale(1)';
        } else {
            whatsappFloat.style.opacity = '0.7';
            whatsappFloat.style.transform = 'scale(0.9)';
        }
    }

    window.addEventListener('scroll', toggleWhatsapp, { passive: true });

    // ===== COUNTER ANIMATION (Estatísticas) =====
    const counters = document.querySelectorAll('.estatisticas__number[data-target]');

    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function update() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        update();
    }

    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ===== PRELOADER (optional enhancement) =====
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

});
