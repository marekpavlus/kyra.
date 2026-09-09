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
    themeToggle.querySelector('i').className = darkMode ? 'fa-solid fa-lightbulb' : 'fa-solid fa-moon';
  });

  const greeting = document.querySelector('.typing-greeting');
  const roleTitle = document.querySelector('.role-title-text');
  const roles = ['SOFTWARE ENGINEER', 'WEB DEVELOPER', 'UI/UX DESIGNER'];
  const greetingText = "Hello, I'm Marek!";
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

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
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
