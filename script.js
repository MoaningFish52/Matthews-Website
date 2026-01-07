const DOM = {
    preloader: document.getElementById('preloader'),
    body: document.body,
    mobileMenu: document.getElementById('mobile-menu'),
    menuButton: document.getElementById('mobile-menu-button'),
    mainContent: document.getElementById('main-content-pages'),
    projectFormPage: document.getElementById('project-form-page'),
    scrollTopButton: document.getElementById('scroll-to-top'),
    timeElement: document.getElementById('current-time'),
    contactForm: document.getElementById('contact-form'),
    successMessage: document.getElementById('success-message'),
    header: document.querySelector('.glass-header'),
    contactBtn: document.getElementById('contact-btn'),
    copyToast: document.getElementById('copy-toast'),
    headerSocials: document.getElementById('header-socials'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section'),
    settingsToggle: document.getElementById('settings-toggle'),
    settingsPanel: document.getElementById('settings-panel'),
    settingsOverlay: document.getElementById('settings-overlay'),
    closeSettings: document.getElementById('close-settings'),
    settingsContent: document.getElementById('settings-content'),
    resetSettings: document.getElementById('reset-settings'),
    themeBtns: document.querySelectorAll('.theme-btn'),
    effectBtns: document.querySelectorAll('.effect-btn'),
    effectsContainer: document.getElementById('effects-container')
};

const THEMES = {
    blue: { 
        400: '96 165 250', 500: '59 130 246', 600: '37 99 235',
        grad: ['#60a5fa', '#818cf8', '#c084fc'] 
    },
    purple: { 
        400: '192 132 252', 500: '168 85 247', 600: '147 51 234',
        grad: ['#c084fc', '#e879f9', '#f472b6'] 
    },
    emerald: { 
        400: '52 211 153', 500: '16 185 129', 600: '5 150 105',
        grad: ['#34d399', '#6ee7b7', '#a7f3d0'] 
    }
};

const handleScrollToSection = (targetHref) => {
    const targetElement = document.querySelector(targetHref);
    if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
};

const initScrollSpy = () => {
    window.addEventListener('scroll', () => {
        let current = '';
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
            current = 'contact';
        } else {
            DOM.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });
        }
        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
};

const toggleProjectPage = (showForm) => {
    if (showForm) {
        DOM.mainContent.classList.add('hidden');
        DOM.projectFormPage.classList.remove('hidden');
        window.scrollTo(0, 0);
        document.querySelectorAll('#project-form-page .scroll-animate').forEach(el => {
            el.classList.remove('is-visible');
            setTimeout(() => el.classList.add('is-visible'), 50);
        });
        DOM.scrollTopButton.classList.remove('show');
    } else {
        DOM.projectFormPage.classList.add('hidden');
        DOM.mainContent.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
};

const startClock = () => {
    const updateClock = () => {
        if (!DOM.timeElement) return;
        const now = new Date();
        DOM.timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateClock();
    const now = new Date();
    setTimeout(() => {
        updateClock();
        setInterval(updateClock, 60000);
    }, (60 - now.getSeconds()) * 1000);
};

const initAnimations = () => {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;
                const container = targetEl.parentElement;
                if (container) {
                    const siblings = Array.from(container.children).filter(c => c.classList.contains('scroll-animate'));
                    const index = siblings.indexOf(targetEl);
                    if (index > 0) targetEl.style.animationDelay = `${index * 0.1}s`;
                }
                targetEl.classList.add('is-visible');
                obs.unobserve(targetEl);
            }
        });
    }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.15 });
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
};

const initMarquee = () => {
    const marqueeContent = document.getElementById('draggable-marquee');
    if (!marqueeContent) return;
    
    const originalContent = marqueeContent.innerHTML;
    marqueeContent.innerHTML += originalContent + originalContent;
    
    let scrollPos = 0;
    let isDragging = false;
    let startX = 0;
    const baseSpeed = 0.5;
    
    const animate = () => {
        if (!isDragging) {
            scrollPos -= baseSpeed;
        }
        const totalWidth = marqueeContent.scrollWidth;
        const oneSetWidth = totalWidth / 3;
        if (scrollPos <= -oneSetWidth) scrollPos += oneSetWidth;
        if (scrollPos > 0) scrollPos -= oneSetWidth;
        
        marqueeContent.style.transform = `translateX(${scrollPos}px)`;
        requestAnimationFrame(animate);
    };

    const startDrag = (e) => {
        isDragging = true;
        startX = (e.pageX || e.touches[0].pageX);
        marqueeContent.style.cursor = 'grabbing';
    };

    const moveDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = (e.pageX || e.touches[0].pageX);
        scrollPos += (currentX - startX);
        startX = currentX;
    };

    const stopDrag = () => {
        isDragging = false;
        marqueeContent.style.cursor = 'grab';
    };

    marqueeContent.addEventListener('mousedown', startDrag);
    marqueeContent.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    
    animate();
};

const setTheme = (colorName) => {
    const themeData = THEMES[colorName];
    if (!themeData) return;
    
    document.documentElement.style.setProperty('--brand-400', themeData[400]);
    document.documentElement.style.setProperty('--brand-500', themeData[500]);
    document.documentElement.style.setProperty('--brand-600', themeData[600]);
    
    document.documentElement.style.setProperty('--gradient-1', themeData.grad[0]);
    document.documentElement.style.setProperty('--gradient-2', themeData.grad[1]);
    document.documentElement.style.setProperty('--gradient-3', themeData.grad[2]);

    DOM.themeBtns.forEach(btn => {
        if(btn.dataset.color === colorName) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    localStorage.setItem('site_theme', colorName);
};

const setEffect = (effectName) => {
    DOM.effectsContainer.innerHTML = ''; 
    
    if (effectName === 'spores') initSpores();
    else if (effectName === 'snow') initSnow();
    else if (effectName === 'rain') initRain();

    DOM.effectBtns.forEach(btn => {
        if(btn.dataset.effect === effectName) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    localStorage.setItem('site_effect', effectName);
};

const initSpores = () => {
    const count = 50;
    for (let i = 0; i < count; i++) {
        const spore = document.createElement('div');
        spore.classList.add('spore');
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 20;
        const drift = (Math.random() - 0.5) * 100 + 'px';
        
        spore.style.width = `${size}px`;
        spore.style.height = `${size}px`;
        spore.style.left = `${left}%`;
        spore.style.animation = `float-spore ${duration}s linear infinite`;
        spore.style.animationDelay = `-${delay}s`;
        spore.style.setProperty('--drift', drift);
        DOM.effectsContainer.appendChild(spore);
    }
};

const initSnow = () => {
    const count = 40;
    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.innerHTML = '<i class="fa-regular fa-snowflake"></i>';
        
        const size = Math.random() * 10 + 10; 
        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5; 
        const delay = Math.random() * 5;
        const sway = (Math.random() - 0.5) * 50 + 'px';
        
        flake.style.fontSize = `${size}px`;
        flake.style.left = `${left}%`;
        flake.style.animation = `fall ${duration}s linear infinite`;
        flake.style.animationDelay = `-${delay}s`;
        flake.style.setProperty('--sway', sway);
        DOM.effectsContainer.appendChild(flake);
    }
};

const initRain = () => {
    const count = 80;
    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        const height = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 1 + 0.5;
        const delay = Math.random() * 2;
        
        drop.style.height = `${height}px`;
        drop.style.left = `${left}%`;
        drop.style.animation = `rain-fall ${duration}s linear infinite`;
        drop.style.animationDelay = `-${delay}s`;
        DOM.effectsContainer.appendChild(drop);
    }
};

const initCustomization = () => {
    const togglePanel = (show) => {
        if(show) {
            DOM.settingsPanel.classList.remove('hidden');
            void DOM.settingsPanel.offsetWidth;
            DOM.settingsPanel.classList.remove('opacity-0');
            DOM.settingsContent.classList.remove('scale-95');
        } else {
            DOM.settingsPanel.classList.add('opacity-0');
            DOM.settingsContent.classList.add('scale-95');
            setTimeout(() => DOM.settingsPanel.classList.add('hidden'), 300);
        }
    };

    DOM.settingsToggle.addEventListener('click', () => togglePanel(true));
    DOM.closeSettings.addEventListener('click', () => togglePanel(false));
    DOM.settingsOverlay.addEventListener('click', () => togglePanel(false));

    DOM.themeBtns.forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.color));
    });

    DOM.effectBtns.forEach(btn => {
        btn.addEventListener('click', () => setEffect(btn.dataset.effect));
    });

    DOM.resetSettings.addEventListener('click', () => {
        setTheme('blue');
        setEffect('grid');
    });

    const savedTheme = localStorage.getItem('site_theme');
    const savedEffect = localStorage.getItem('site_effect');
    
    if(savedTheme && THEMES[savedTheme]) setTheme(savedTheme);
    else setTheme('blue');

    if(savedEffect) setEffect(savedEffect);
    else setEffect('grid');
};

const validateField = (field, errorMessageId, rules = {}) => {
    const errorElement = document.getElementById(errorMessageId);
    const value = field.value.trim();
    
    errorElement.textContent = '';
    field.classList.remove('border-red-500', 'focus:ring-red-500');
    field.classList.add('border-white/10', 'focus:ring-blue-500/50');
    
    let isValid = true;
    let msg = '';

    if (!value) {
        msg = 'This field is required.';
        isValid = false;
    } else if (rules.minLength && value.length < rules.minLength) {
        msg = `Must be at least ${rules.minLength} characters.`;
        isValid = false;
    } else if (rules.pattern && !rules.pattern.test(value.toLowerCase())) {
        msg = 'Please enter a valid email address.';
        isValid = false;
    }

    if (!isValid) {
        errorElement.textContent = msg;
        field.classList.add('border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-white/10', 'focus:ring-blue-500/50');
    }
    return isValid;
};

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const fields = [
        { id: 'name', errorId: 'name-error', rules: { minLength: 2 } },
        { id: 'email', errorId: 'email-error', rules: { pattern: /^[^@]+@[^@]+\.[^@]+$/ } },
        { id: 'project-type', errorId: 'project-type-error', rules: { minLength: 3 } },
        { id: 'message', errorId: 'message-error', rules: { minLength: 10 } }
    ];

    let isFormValid = true;
    fields.forEach(f => {
        const fieldEl = document.getElementById(f.id);
        if (!validateField(fieldEl, f.errorId, f.rules)) isFormValid = false;
    });

    if (!isFormValid) return;

    const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
    const originalBtnContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loader" style="width:20px;height:20px;border-width:2px;"></span>';
    submitButton.classList.add('opacity-80', 'cursor-not-allowed');

    try {
        const response = await fetch(DOM.contactForm.action, {
            method: DOM.contactForm.method,
            body: new FormData(DOM.contactForm),
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            DOM.contactForm.reset();
            DOM.contactForm.classList.add('hidden');
            DOM.successMessage.classList.remove('hidden');
            DOM.successMessage.scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        alert('Oops! There was an issue submitting your request. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalBtnContent;
        submitButton.classList.remove('opacity-80', 'cursor-not-allowed');
        lucide.createIcons();
    }
};

const setupCopyEmail = () => {
    if (DOM.contactBtn) {
        DOM.contactBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText('moaningtortoise@gmail.com');
                DOM.copyToast.classList.remove('opacity-0', 'translate-y-24');
                DOM.copyToast.classList.add('opacity-100', 'translate-y-0');
                
                setTimeout(() => {
                    DOM.copyToast.classList.remove('opacity-100', 'translate-y-0');
                    DOM.copyToast.classList.add('opacity-0', 'translate-y-24');
                }, 3000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    }
};

const initialize = () => {
    window.addEventListener('load', () => {
        document.fonts.ready.then(() => {
            DOM.preloader.style.opacity = '0';
            setTimeout(() => {
                DOM.preloader.style.visibility = 'hidden';
                DOM.body.classList.remove('no-scroll');
                initAnimations();
                initMarquee();
                initScrollSpy();
                initCustomization();
            }, 500);
        });
    });

    lucide.createIcons();
    startClock();
    setupCopyEmail();

    const skillCards = document.querySelectorAll('.animated-border-card');
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const color = getComputedStyle(document.documentElement).getPropertyValue('--brand-500').trim();
            card.style.background = `radial-gradient(400px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgb(${color} / 0.4), transparent 60%), rgba(255, 255, 255, 0.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(255, 255, 255, 0.03)';
        });
    });

    const allCards = document.querySelectorAll('.animated-border-card, .tilt-card');
    allCards.forEach(card => {
        card.addEventListener('touchstart', () => {
            allCards.forEach(c => c.classList.remove('active-touch'));
            card.classList.add('active-touch');
        }, { passive: true });
    });
    
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.animated-border-card') && !e.target.closest('.tilt-card')) {
            allCards.forEach(c => c.classList.remove('active-touch'));
        }
    }, { passive: true });
    
    DOM.menuButton.addEventListener('click', () => {
        const isHidden = DOM.mobileMenu.classList.contains('hidden');
        if (isHidden) {
            DOM.mobileMenu.classList.remove('hidden');
            DOM.body.classList.add('no-scroll');
            DOM.menuButton.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        } else {
            DOM.mobileMenu.classList.add('hidden');
            DOM.body.classList.remove('no-scroll');
            DOM.menuButton.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        }
        lucide.createIcons();
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetHref = this.getAttribute('href');
            
            if (targetHref === '#project') {
                toggleProjectPage(true);
            } else if (targetHref === '#home' && !DOM.projectFormPage.classList.contains('hidden')) {
                toggleProjectPage(false);
            } else {
                if (!DOM.projectFormPage.classList.contains('hidden')) {
                    toggleProjectPage(false);
                    setTimeout(() => handleScrollToSection(targetHref), 50);
                } else {
                    handleScrollToSection(targetHref);
                }
            }
            if (!DOM.mobileMenu.classList.contains('hidden')) {
                DOM.mobileMenu.classList.add('hidden');
                DOM.menuButton.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
                lucide.createIcons();
                DOM.body.classList.remove('no-scroll');
            }
        });
    });

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const isHome = DOM.mainContent.classList.contains('hidden');
                const showButton = window.scrollY > 400 && !isHome;
                if (showButton) DOM.scrollTopButton.classList.add('show');
                else DOM.scrollTopButton.classList.remove('show');
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    DOM.scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    DOM.contactForm.addEventListener('submit', handleFormSubmit);
};

document.addEventListener('DOMContentLoaded', initialize);