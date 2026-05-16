// SuperMKT Uganda — Multi-page UI

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const demoForm = document.getElementById('demoForm');
const demoPlan = document.getElementById('demoPlan');
const cursorGlow = document.getElementById('cursorGlow');
const liveSales = document.getElementById('liveSales');

// Highlight active tab from body data-page
const currentPage = document.body.dataset.page;
document.querySelectorAll('.page-tab').forEach((tab) => {
    if (tab.dataset.page === currentPage) tab.classList.add('active');
});

// Header scroll
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });
}

// Mobile menu (tabs stay visible; toggle reserved for future)
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
    });
}

// Cursor glow
if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// Modal
function openModal(plan) {
    if (!modalOverlay) return;
    if (plan && demoPlan) demoPlan.value = plan;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.plan || null));
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('demoName')?.value || '';
        const phone = document.getElementById('demoPhone')?.value || '';
        const email = document.getElementById('demoEmail')?.value || '';
        const city = document.getElementById('demoCity')?.value || '';
        const plan = demoPlan?.value || 'Professional';
        const msg = document.getElementById('demoMsg')?.value || '';
        const text = encodeURIComponent(
            `SuperMKT Demo Request\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nCity: ${city}\nPlan: ${plan}\n\n${msg || 'Interested in a free demo.'}`
        );
        window.open(`https://wa.me/256779654710?text=${text}`, '_blank');
        closeModal();
        demoForm.reset();
    });
}

// Reveal on scroll / page load
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
    // Show above-fold content quickly
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
});

// Counters
function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.target.dataset.animated) return;
            const target = parseInt(entry.target.dataset.count, 10);
            const el =
                entry.target.querySelector('.metric-num') ||
                (entry.target.classList.contains('pc-val') ? entry.target : null);
            if (el && target) {
                entry.target.dataset.animated = '1';
                animateCounter(el, target);
            }
            counterObserver.unobserve(entry.target);
        });
    },
    { threshold: 0.4 }
);
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// Live sales (home only)
if (liveSales) {
    let salesVal = 1847500;
    liveSales.textContent = 'UGX ' + salesVal.toLocaleString();
    setInterval(() => {
        salesVal += Math.floor(Math.random() * 40000) + 8000;
        liveSales.textContent = 'UGX ' + salesVal.toLocaleString();
    }, 3200);
}

// Testimonial slider (contact page)
const tCards = document.querySelectorAll('.t-card');
const tDots = document.querySelectorAll('.t-dot');
let slideIndex = 0;
let slideTimer;

function goToSlide(i) {
    if (!tCards.length) return;
    slideIndex = i;
    tCards.forEach((c, idx) => c.classList.toggle('active', idx === i));
    tDots.forEach((d, idx) => d.classList.toggle('active', idx === i));
}

function nextSlide() {
    goToSlide((slideIndex + 1) % tCards.length);
}

tDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.slide, 10));
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 6000);
    });
});

if (tCards.length) slideTimer = setInterval(nextSlide, 6000);

// Bento tilt
document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Ring progress (tracking page)
const ring = document.querySelector('.ring-progress');
if (ring) {
    ring.style.strokeDashoffset = '534';
    const ringObs = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                ring.style.strokeDashoffset = '0';
                ringObs.disconnect();
            }
        },
        { threshold: 0.4 }
    );
    const parent = ring.closest('.track-ring');
    if (parent) ringObs.observe(parent);
}
