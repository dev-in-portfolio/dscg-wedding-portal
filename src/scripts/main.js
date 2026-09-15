import { CONFIG, isUrlConfigured } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  initStarlightCanvas();
  initHeaderScroll();
  initMobileNav();
  initSmoothScroll();
  initDestinationButtons();
  initStyleTransformer();
  initModal();
});

/**
 * 1. Dark Star Starlight & Volumetric Ambient Canvas
 * High performance, elegant floating stardust particles & champagne glows
 */
function initStarlightCanvas() {
  const canvas = document.getElementById('starlight-canvas');
  if (!canvas) return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Stardust Particle Class
  class Stardust {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
      
      const rand = Math.random();
      if (rand < 0.6) {
        this.color = '212, 175, 55'; // Champagne Gold
      } else if (rand < 0.85) {
        this.color = '245, 230, 180'; // Warm Pearl
      } else {
        this.color = '165, 175, 200'; // Moonlight
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulsePhase += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.2;

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0.1, this.alpha)})`;
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = `rgba(${this.color}, 0.5)`;
      ctx.fill();
    }
  }

  // Volumetric Glow Orb Class
  class GlowOrb {
    constructor(color, radius, speed) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = radius;
      this.color = color;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -this.radius || this.x > width + this.radius) this.vx *= -1;
      if (this.y < -this.radius || this.y > height + this.radius) this.vy *= -1;
    }

    draw() {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particleCount = Math.min(width > 768 ? 65 : 30, 80);
  const particles = Array.from({ length: particleCount }, () => new Stardust());
  const orbs = [
    new GlowOrb('rgba(212, 175, 55, 0.07)', 380, 0.2),
    new GlowOrb('rgba(28, 38, 58, 0.15)', 450, 0.15),
    new GlowOrb('rgba(212, 175, 55, 0.05)', 320, 0.25)
  ];

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient volumetric glows
    orbs.forEach(orb => {
      orb.update();
      orb.draw();
    });

    // Draw stardust particles
    ctx.shadowBlur = 0;
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw delicate constellation links between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 90) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * Adds shadow & blurred backdrop to header on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn');

  if (!toggle || !drawer) return;

  const setDrawerState = (open) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      drawer.classList.add('is-open');
      drawer.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('is-open');
      drawer.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setDrawerState(!isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      setDrawerState(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setDrawerState(false);
      toggle.focus();
    }
  });
}

/**
 * Smooth anchor scrolling with active state tracking
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 85;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active link observer
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(navLink => {
            if (navLink.getAttribute('href') === '#' + id) {
              navLink.classList.add('active');
            } else {
              navLink.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

/**
 * Dynamic routing for Demos & Intake based on centralized CONFIG
 */
function initDestinationButtons() {
  const demoButtons = document.querySelectorAll('[data-demo-target]');
  const intakeButtons = document.querySelectorAll('[data-intake-target]');

  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetKey = btn.getAttribute('data-demo-target');
      let targetUrl = '';
      let targetName = '';
      let targetTier = '';
      let repoId = '';

      if (targetKey === 'essential') {
        targetUrl = CONFIG.ESSENTIAL_DEMO_URL;
        targetName = 'Wedding Essential Demo';
        targetTier = 'Tier ★★★ (Essential)';
        repoId = 'Site 2: Wedding Essential Demo';
      } else if (targetKey === 'website') {
        targetUrl = CONFIG.WEDDING_WEBSITE_DEMO_URL;
        targetName = 'Wedding Website Demo';
        targetTier = 'Tier ★★★★ (Standard Website)';
        repoId = 'Site 3: Wedding Website Demo';
      } else if (targetKey === 'destination') {
        targetUrl = CONFIG.WEEKEND_DESTINATION_DEMO_URL;
        targetName = 'Wedding Weekend / Destination Demo';
        targetTier = 'Tier ★★★★★ (Weekend & Destination)';
        repoId = 'Site 4: Wedding Weekend / Destination Demo';
      }

      if (isUrlConfigured(targetUrl)) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        e.preventDefault();
        openModal({
          title: targetName,
          tier: targetTier,
          repoId: repoId,
          desc: 'This demo experience showcases 1 fictional wedding across 5 selectable visual style variations. Once the Site deployment URL is established, clicking this launch button will open the live Netlify demo directly.'
        });
      }
    });
  });

  intakeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (isUrlConfigured(CONFIG.WEDDING_INTAKE_URL)) {
        window.open(CONFIG.WEDDING_INTAKE_URL, '_blank', 'noopener,noreferrer');
      } else {
        e.preventDefault();
        openModal({
          title: 'DSCG Wedding Intake',
          tier: 'Client Intake Application',
          repoId: 'Site 5: DSCG Wedding Intake',
          desc: 'The dedicated client intake application collects project details, preferred service tier, visual style preferences, and wedding specifics. Once deployed, clicking this button directs clients straight into the intake portal.'
        });
      }
    });
  });
}

/**
 * Interactive Design Transformer Hover / Selection in Style Explainer
 */
function initStyleTransformer() {
  const cards = document.querySelectorAll('.styles-factor-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.style.borderColor = 'rgba(255, 255, 255, 0.08)');
      card.style.borderColor = 'var(--color-accent)';
    });
  });
}

/**
 * Accessible informational modal for placeholder links
 */
let activeModal = null;
let lastActiveElement = null;

function initModal() {
  const backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) return;

  const closeButtons = backdrop.querySelectorAll('[data-modal-close]');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      closeModal();
    }
  });
}

function openModal({ title, tier, repoId, desc }) {
  const backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) return;

  lastActiveElement = document.activeElement;

  const modalTitle = backdrop.querySelector('#modal-title');
  const modalDesc = backdrop.querySelector('#modal-desc');
  const modalTier = backdrop.querySelector('#modal-tier');
  const modalRepo = backdrop.querySelector('#modal-repo');

  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;
  if (modalTier) modalTier.textContent = tier;
  if (modalRepo) modalRepo.textContent = repoId;

  backdrop.classList.add('is-active');
  backdrop.removeAttribute('hidden');
  activeModal = backdrop;
  document.body.style.overflow = 'hidden';

  const closeBtn = backdrop.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  const backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) return;

  backdrop.classList.remove('is-active');
  backdrop.setAttribute('hidden', '');
  activeModal = null;
  document.body.style.overflow = '';

  if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
    lastActiveElement.focus();
  }
}
