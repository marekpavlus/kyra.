/**
 * ==========================================
 * 01. HEADER VISIBILITY & SCROLL BEHAVIOR
 * ==========================================
 */
const header = document.querySelector('header');
const topHoverZone = 100;

function updateHeaderVisibility() {
  document.body.classList.toggle('is-scrolled', window.scrollY > 40);

  if (window.scrollY <= 40) {
    document.body.classList.remove('header-peek');
  }
}

window.addEventListener('scroll', updateHeaderVisibility, { passive: true });

document.addEventListener('pointermove', (event) => {
  if (window.scrollY <= 40) {
    return;
  }

  if (event.clientY <= topHoverZone) {
    document.body.classList.add('header-peek');
  } else if (!header.matches(':hover')) {
    document.body.classList.remove('header-peek');
  }
});

header.addEventListener('mouseleave', () => {
  if (window.scrollY > 40) {
    document.body.classList.remove('header-peek');
  }
});

updateHeaderVisibility();


/**
 * ==========================================
 * 02. MOBILE MENU & THEME TOGGLE
 * ==========================================
 */
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');

function closeMobileMenu() {
  header.classList.remove('mobile-menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('span').textContent = 'Open menu';
  menuToggle.querySelector('i').className = 'fa-solid fa-bars';
}

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('mobile-menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('span').textContent = isOpen ? 'Close menu' : 'Open menu';
  menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

themeToggle.addEventListener('click', () => {
  const darkMode = document.body.classList.toggle('dark-mode');
  themeToggle.setAttribute('aria-label', darkMode ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('i').className = darkMode ? 'fa-solid fa-lightbulb' : 'fa-regular fa-lightbulb';
});


/**
 * ==========================================
 * 03. HERO ANIMATIONS (TYPING & ROLE CYCLE)
 * ==========================================
 */
const greeting = document.querySelector('.typing-greeting');
const roleTitle = document.querySelector('.role-title-text');
const roles = ['SOFTWARE ENGINEER', 'WEB DEVELOPER', 'UI/UX DESIGNER'];

const greetingsByLang = {
  en: "Hello, I'm Marek!",
  sk: "Ahoj, ja som Marek!",
  da: "Hej, jeg er Marek!"
};

const pageLang = document.documentElement.lang;
const greetingText = greetingsByLang[pageLang] || greetingsByLang.en;

let greetingIndex = 0;
let roleIndex = 0;
let deletingGreeting = false;

function typeGreeting() {
  greeting.textContent = greetingText.slice(0, greetingIndex);

  if (!deletingGreeting && greetingIndex < greetingText.length) {
    greetingIndex += 1;
    window.setTimeout(typeGreeting, 105);
    return;
  }

  if (!deletingGreeting && greetingIndex === greetingText.length) {
    deletingGreeting = true;
    window.setTimeout(typeGreeting, 5000);
    return;
  }

  if (deletingGreeting && greetingIndex > 0) {
    greetingIndex -= 1;
    window.setTimeout(typeGreeting, 65);
    return;
  }

  deletingGreeting = false;
  window.setTimeout(typeGreeting, 1000);
}

function renderRole(role) {
  const firstSpace = role.indexOf(' ');
  const primaryRole = role.slice(0, firstSpace);
  const accentRole = role.slice(firstSpace);
  roleTitle.innerHTML = `<span class="role-title-primary">${primaryRole}</span><span class="role-title-accent">${accentRole}</span>`;
}

function cycleRole() {
  roleTitle.classList.remove('role-title-visible');

  window.setTimeout(() => {
    renderRole(roles[roleIndex]);
    roleTitle.classList.add('role-title-visible');
    roleIndex = (roleIndex + 1) % roles.length;
    window.setTimeout(cycleRole, 5000);
  }, 450);
}

function startAnimations() {
  typeGreeting();
  cycleRole();
}

startAnimations();

/**
 * ==========================================
 * 04. NAVIGATION & SMOOTH SCROLLING
 * ==========================================
 */
const navLinks = document.querySelectorAll('nav a.nav-item');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(navLink => navLink.classList.remove('is-active'));
    link.classList.add('is-active');
    closeMobileMenu();
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/**
 * ==========================================
 * 05. SECTION REVEAL INTERSECTION OBSERVER
 * ==========================================
 */
const revealSections = document.querySelectorAll('.full-section, #hero');

if (revealSections.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.25 });

  revealSections.forEach(section => revealObserver.observe(section));
} else {
  revealSections.forEach(section => section.classList.add('in-view'));
}


/**
 * ==========================================
 * 06. CONTACT FORM MAILTO HANDLER
 * ==========================================
 */
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = contactForm.firstName.value.trim();
    const lastName = contactForm.lastName.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim() || `Správa od ${firstName} ${lastName}`;
    const message = contactForm.message.value.trim();

    const body =
      `Meno: ${firstName} ${lastName}\n` +
      `Email: ${email}\n\n` +
      `${message}`;

    const mailtoUrl =
      `mailto:info@kyra.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  });
}

/**
 * ==========================================
 * 07. LANGUAGE SWITCHER DROPDOWN
 * ==========================================
 */
const langSwitchers = document.querySelectorAll('.lang-switcher');

langSwitchers.forEach(switcher => {
  const btn = switcher.querySelector('.lang-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('is-open');
    });
  }
});

document.addEventListener('click', (e) => {
  langSwitchers.forEach(switcher => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove('is-open');
    }
  });
});