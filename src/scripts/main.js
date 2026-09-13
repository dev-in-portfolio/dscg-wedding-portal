import { CONFIG, isUrlConfigured } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initSmoothScroll();
  initDestinationButtons();
  initModal();
});

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
        const headerOffset = 80;
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
        targetTier = 'Tier ★ (Essential)';
        repoId = 'Site 2: Wedding Essential Demo';
      } else if (targetKey === 'website') {
        targetUrl = CONFIG.WEDDING_WEBSITE_DEMO_URL;
        targetName = 'Wedding Website Demo';
        targetTier = 'Tier ★★ (Standard Website)';
        repoId = 'Site 3: Wedding Website Demo';
      } else if (targetKey === 'destination') {
        targetUrl = CONFIG.WEEKEND_DESTINATION_DEMO_URL;
        targetName = 'Wedding Weekend / Destination Demo';
        targetTier = 'Tier ★★★ (Weekend & Destination)';
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
          desc: 'This demo experience showcases 1 fictional wedding across 5 selectable visual styles. Once the Site deployment URL is established, clicking this launch button will open the live Netlify demo directly.'
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