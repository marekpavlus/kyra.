/**
 * ==========================================
 * 01. HEADER VISIBILITY & SCROLL BEHAVIOR
 * ==========================================
 */
const header = document.querySelector('header');
const topHoverZone = 100;

function updateHeaderVisibility() {
  const isScrolled = window.scrollY > 40;
  document.body.classList.toggle('is-scrolled', isScrolled);

  if (!isScrolled) {
    document.body.classList.remove('header-peek');
  } else if (header.matches(':hover')) {
    document.body.classList.add('header-peek');
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
 * 02. SCROLL PROGRESS INDICATOR
 * ==========================================
 */
// Measure the fixed navbar so the mobile/tablet progress track starts beneath it.
const progressNavbar = document.querySelector('header');

function updateProgressNavbarHeight() {
  if (progressNavbar) {
    document.documentElement.style.setProperty(
      '--kyra-navbar-height', `${progressNavbar.getBoundingClientRect().height}px`
    );
  }
}

updateProgressNavbarHeight();
window.addEventListener('resize', updateProgressNavbarHeight);

const scrollProgress = document.querySelector('.scroll-progress');

if (scrollProgress) {
  const scrollProgressFill = scrollProgress.querySelector('.scroll-progress-fill');
  let scrollProgressFrame = 0;

  function updateScrollProgress() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0
      ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
      : 0;
    const percentage = Math.round(progress * 100);

    scrollProgressFill.style.transform = `scaleY(${progress})`;
    scrollProgress.setAttribute('aria-valuenow', String(percentage));
    scrollProgressFrame = 0;
  }

  function scheduleScrollProgressUpdate() {
    if (!scrollProgressFrame) {
      scrollProgressFrame = window.requestAnimationFrame(updateScrollProgress);
    }
  }

  document.documentElement.classList.add('has-custom-scrollbar');
  window.addEventListener('scroll', scheduleScrollProgressUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollProgressUpdate);
  updateScrollProgress();
}

/**
 * ==========================================
 * 03. MOBILE MENU & THEME TOGGLE
 * ==========================================
 */
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const isDarkMode = document.body.classList.contains('dark-mode');

themeToggle.setAttribute('aria-label', isDarkMode ? t('ui.switchToLight') : t('ui.switchToDark'));
themeToggle.querySelector('i').className = isDarkMode
  ? 'fa-solid fa-lightbulb'
  : 'fa-regular fa-lightbulb';

function closeMobileMenu() {
  header.classList.remove('mobile-menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('span').textContent = t('ui.openMenu');
  menuToggle.querySelector('i').className = 'fa-solid fa-bars';
}

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('mobile-menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('span').textContent = isOpen ? t('ui.closeMenu') : t('ui.openMenu');
  menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

themeToggle.addEventListener('click', () => {
  const darkMode = document.body.classList.toggle('dark-mode');
  document.documentElement.classList.toggle('dark-mode', darkMode);
  themeToggle.setAttribute('aria-label', darkMode ? t('ui.switchToLight') : t('ui.switchToDark'));
  themeToggle.querySelector('i').className = darkMode ? 'fa-solid fa-lightbulb' : 'fa-regular fa-lightbulb';
  try {
    localStorage.setItem('kyra-theme', darkMode ? 'dark' : 'light');
  } catch (error) {
    console.error('Unable to save the selected color theme.', error);
  }
});

/**
 * ==========================================
 * 04. HERO ANIMATIONS (TYPING & ROLE CYCLE)
 * ==========================================
 */
const greeting = document.querySelector('.typing-greeting');
const roleTitle = document.querySelector('.role-title-text');
const roles = t('hero.roles');
const greetingText = t('hero.greeting');

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
 * 05. ABOUT BIO EXPANSION
 * ==========================================
 */
const aboutMoreToggle = document.querySelector('.about-more-toggle');

if (aboutMoreToggle) {
  const aboutBio = aboutMoreToggle.closest('.about-bio');
  const aboutMoreContentId = aboutMoreToggle.getAttribute('aria-controls');
  const aboutMoreContent = aboutMoreContentId
    ? document.getElementById(aboutMoreContentId)
    : null;

  if (aboutBio && aboutMoreContent) {
    aboutMoreToggle.addEventListener('click', () => {
      const isExpanded = aboutMoreToggle.getAttribute('aria-expanded') === 'true';
      const shouldExpand = !isExpanded;

      aboutMoreToggle.setAttribute('aria-expanded', String(shouldExpand));
      aboutMoreToggle.textContent = aboutMoreToggle.dataset[shouldExpand ? 'lessLabel' : 'moreLabel'];
      aboutMoreContent.setAttribute('aria-hidden', String(!shouldExpand));
      aboutMoreContent.inert = !shouldExpand;
      aboutBio.classList.toggle('is-expanded', shouldExpand);
    });
  }
}

/**
 * ==========================================
 * 06. NAVIGATION & SMOOTH SCROLLING
 * ==========================================
 */
const navLinks = document.querySelectorAll('nav a.nav-item');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

const trackedSections = [...navLinks]
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(section => section instanceof HTMLElement);

const skillsSnapPoint = document.querySelector('#skills');
const aboutNextArrow = document.querySelector('#about .section-next:not(.section-prev)');
const aboutPreviousArrow = document.querySelector('#about .section-prev');

let activeSectionFrame = 0;

function getMobileSkillSnapOffset() {
  if (window.innerWidth > 1199) {
    return 0;
  }

  const header = document.querySelector('header');
  const phoneExtraOffset = window.innerWidth <= 430 ? 35 : 0;
  return header instanceof HTMLElement
    ? Math.ceil(header.getBoundingClientRect().bottom + 12 + phoneExtraOffset)
    : 0;
}

function updateActiveNavigation() {
  const activationLine = window.innerHeight * 0.4;
  let activeSection = trackedSections[0];

  for (const section of trackedSections) {
    if (section.getBoundingClientRect().top <= activationLine) {
      activeSection = section;
    } else {
      break;
    }
  }

  // Show navigation arrows only for the current section. Since the arrows
  // use position: fixed, keeping arrows from multiple in-view sections visible
  // would stack them on top of each other at section boundaries.
  trackedSections.forEach(section => {
    section.classList.toggle('section-arrow-active', section === activeSection);
  });

  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${activeSection.id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (skillsSnapPoint instanceof HTMLElement
    && aboutNextArrow instanceof HTMLAnchorElement
    && aboutPreviousArrow instanceof HTMLAnchorElement) {
    const skillsRect = skillsSnapPoint.getBoundingClientRect();
    const canCenterSkills = skillsRect.height <= window.innerHeight
      && window.innerWidth > 1199;
    const firstSkillCategory = skillsSnapPoint.querySelector('.skill-category');
    skillsSnapPoint.style.scrollSnapAlign = canCenterSkills ? 'center' : 'none';

    if (firstSkillCategory instanceof HTMLElement) {
      firstSkillCategory.style.scrollSnapAlign = canCenterSkills ? 'none' : 'start';
      firstSkillCategory.style.scrollMarginTop = `${getMobileSkillSnapOffset()}px`;
    }

    const snapPoint = canCenterSkills || !(firstSkillCategory instanceof HTMLElement)
      ? skillsSnapPoint
      : firstSkillCategory;
    const snapRect = snapPoint.getBoundingClientRect();
    const skillsSnapLine = canCenterSkills
      ? (window.innerHeight - skillsRect.height) / 2
      : getMobileSkillSnapOffset();
    const skillsReached = snapRect.top <= skillsSnapLine + 1;
    aboutNextArrow.href = skillsReached ? '#portfolio' : '#skills';
    aboutPreviousArrow.href = skillsReached ? '#about' : '#hero';
    aboutNextArrow.setAttribute('aria-label', skillsReached
      ? aboutNextArrow.dataset.labelAfter
      : aboutNextArrow.dataset.labelBefore);
    aboutPreviousArrow.setAttribute('aria-label', skillsReached
      ? aboutPreviousArrow.dataset.labelAfter
      : aboutPreviousArrow.dataset.labelBefore);
  }

  activeSectionFrame = 0;
}

function scheduleActiveNavigationUpdate() {
  if (!activeSectionFrame) {
    activeSectionFrame = window.requestAnimationFrame(updateActiveNavigation);
  }
}

window.addEventListener('scroll', scheduleActiveNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleActiveNavigationUpdate);
updateActiveNavigation();

let sectionArrowScrollFrame = 0;
let sectionArrowScrollBehavior = '';
let sectionArrowScrollSnapType = '';

function cancelSectionArrowScroll() {
  if (!sectionArrowScrollFrame) {
    return;
  }

  window.cancelAnimationFrame(sectionArrowScrollFrame);
  sectionArrowScrollFrame = 0;
  document.documentElement.style.scrollBehavior = sectionArrowScrollBehavior;
  document.documentElement.style.scrollSnapType = sectionArrowScrollSnapType;
}

function getSectionArrowTargetY(targetElement, startY) {
  const skillsHeight = skillsSnapPoint?.getBoundingClientRect().height;
  const firstSkillCategory = skillsSnapPoint?.querySelector('.skill-category');
  const snapTarget = targetElement === skillsSnapPoint
    && (skillsHeight > window.innerHeight || window.innerWidth <= 1199)
    && firstSkillCategory instanceof HTMLElement
    ? firstSkillCategory
    : targetElement;
  const targetRect = snapTarget.getBoundingClientRect();
  const snapAlign = getComputedStyle(snapTarget).scrollSnapAlign.split(' ')[0];
  const snapMarginTop = Number.parseFloat(getComputedStyle(snapTarget).scrollMarginTop) || 0;
  const snapOffset = snapAlign === 'center' && targetRect.height <= window.innerHeight
    ? (window.innerHeight - targetRect.height) / 2
    : snapMarginTop;
  const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

  return Math.min(
    maxScrollY,
    Math.max(0, startY + targetRect.top - snapOffset)
  );
}

function scrollToSectionFromArrow(targetElement) {
  cancelSectionArrowScroll();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const root = document.documentElement;
    const originalScrollBehavior = root.style.scrollBehavior;
    const startY = window.scrollY;
    const targetY = getSectionArrowTargetY(targetElement, startY);
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, targetY);
    root.style.scrollBehavior = originalScrollBehavior;
    return;
  }

  const root = document.documentElement;
  sectionArrowScrollBehavior = root.style.scrollBehavior;
  sectionArrowScrollSnapType = root.style.scrollSnapType;
  root.style.scrollBehavior = 'auto';
  root.style.scrollSnapType = 'none';

  const startY = window.scrollY;
  const targetY = getSectionArrowTargetY(targetElement, startY);
  const duration = 800;
  let startTime;

  function animateScroll(timestamp) {
    startTime ??= timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = progress < 0.5
      ? 4 * progress ** 3
      : 1 - ((-2 * progress + 2) ** 3) / 2;

    window.scrollTo(0, startY + (targetY - startY) * easedProgress);

    if (progress < 1) {
      sectionArrowScrollFrame = window.requestAnimationFrame(animateScroll);
      return;
    }

    sectionArrowScrollFrame = 0;
    root.style.scrollBehavior = sectionArrowScrollBehavior;
    root.style.scrollSnapType = sectionArrowScrollSnapType;
  }

  sectionArrowScrollFrame = window.requestAnimationFrame(animateScroll);
}

window.addEventListener('wheel', cancelSectionArrowScroll, { passive: true });
window.addEventListener('touchstart', cancelSectionArrowScroll, { passive: true });
window.addEventListener('pointerdown', cancelSectionArrowScroll, { passive: true });
window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
    cancelSectionArrowScroll();
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      if (this.matches('.section-next')) {
        scrollToSectionFromArrow(targetElement);
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/**
 * ==========================================
 * 07. DESKTOP SITE SEARCH
 * ==========================================
 */
const siteSearch = document.querySelector('[data-site-search]');

if (siteSearch) {
  const searchInput = siteSearch.querySelector('.header-search-input');
  const searchToggle = siteSearch.querySelector('.header-search-toggle');
  const searchResults = siteSearch.querySelector('.header-search-results');
  const projectCards = [...document.querySelectorAll(
    '#portfolio .project-card, #portfolio .project-showcase'
  )];
  const projectEmptyMessage = document.querySelector('.project-search-empty');
  const quickLinks = [...document.querySelectorAll('nav a.nav-item')];
  let searchPinnedOpen = false;

  function normalizeSearchText(value) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  }

  function updateSearchVisibility(isOpen) {
    siteSearch.classList.toggle('is-open', isOpen);
    searchToggle.setAttribute('aria-expanded', String(isOpen));
    searchToggle.setAttribute(
      'aria-label',
      isOpen ? siteSearch.dataset.closeLabel : siteSearch.dataset.openLabel
    );
  }

  function closeSiteSearch() {
    searchPinnedOpen = false;
    if (siteSearch.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    updateSearchVisibility(false);
  }

  function renderSearchGroup(title, items) {
    if (!items.length) {
      return;
    }

    const group = document.createElement('section');
    group.className = 'header-search-group';

    const heading = document.createElement('h4');
    heading.textContent = title;
    group.append(heading);

    const list = document.createElement('ul');
    items.forEach((item) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      listItem.append(link);
      list.append(listItem);
    });

    group.append(list);
    searchResults.append(group);
  }

  function updateSiteSearch() {
    const query = normalizeSearchText(searchInput.value.trim());
    const matchingProjects = projectCards.filter((card) => {
      const searchableText = normalizeSearchText(
        `${card.textContent} projects project portfolio`
      );
      const matches = !query || searchableText.includes(query);
      card.hidden = !matches;
      return matches;
    });

    if (projectEmptyMessage) {
      projectEmptyMessage.hidden = matchingProjects.length > 0;
    }

    const matchingLinks = quickLinks.filter((link) => {
      const searchableText = normalizeSearchText(
        `${link.textContent} ${link.dataset.searchTerms || ''}`
      );
      return !query || searchableText.includes(query);
    });

    searchResults.replaceChildren();
    renderSearchGroup(siteSearch.dataset.pagesLabel, matchingLinks.map((link) => ({
      href: link.getAttribute('href'),
      label: link.textContent.trim()
    })));
    renderSearchGroup(siteSearch.dataset.projectsLabel, matchingProjects.map((card) => ({
      href: `#${card.id}`,
      label: card.querySelector('h3').textContent.trim()
    })));

    if (!matchingLinks.length && !matchingProjects.length) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'header-search-empty';
      emptyMessage.textContent = siteSearch.dataset.noResults;
      searchResults.append(emptyMessage);
    }

    document.querySelectorAll('.project-search-empty').forEach((message) => {
      message.textContent = siteSearch.dataset.projectsEmpty;
    });
  }

  siteSearch.addEventListener('pointerenter', () => updateSearchVisibility(true));
  siteSearch.addEventListener('pointerleave', () => {
    if (!searchPinnedOpen && !siteSearch.contains(document.activeElement)) {
      updateSearchVisibility(false);
    }
  });
  siteSearch.addEventListener('focusin', () => updateSearchVisibility(true));
  siteSearch.addEventListener('focusout', (event) => {
    if (!searchPinnedOpen && !siteSearch.contains(event.relatedTarget)) {
      updateSearchVisibility(false);
    }
  });
  header.addEventListener('mouseleave', () => {
    if (window.scrollY > 40) {
      closeSiteSearch();
    }
  });
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40 && !document.body.classList.contains('header-peek')) {
      closeSiteSearch();
    }
  }, { passive: true });

  searchToggle.addEventListener('click', () => {
    searchPinnedOpen = !searchPinnedOpen;

    if (searchPinnedOpen) {
      updateSearchVisibility(true);
      searchInput.focus();
    } else {
      searchInput.blur();
      searchToggle.blur();
      updateSearchVisibility(false);
    }
  });

  searchInput.addEventListener('input', updateSiteSearch);
  searchResults.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) {
      return;
    }

    searchPinnedOpen = false;
    searchInput.blur();
    link.blur();
    updateSearchVisibility(false);
  });

  document.addEventListener('click', (event) => {
    if (!siteSearch.contains(event.target)) {
      closeSiteSearch();
    }
  });

  updateSiteSearch();
}

/**
 * ==========================================
 * 08. SECTION REVEAL INTERSECTION OBSERVER
 * ==========================================
 */
const revealSections = document.querySelectorAll('.full-section, #hero');
const skillGroups = document.querySelector('#skills');
const projectCards = document.querySelectorAll('#portfolio .project-showcase');

projectCards.forEach((card) => {
  card.addEventListener('pointerleave', () => {
    card.style.transitionDelay = '0s';
  });
});

if (skillGroups instanceof HTMLElement) {
  skillGroups.querySelectorAll('.skill-category').forEach((category) => {
    category.addEventListener('pointerleave', () => {
      category.style.transitionDelay = '0s';
    });
  });
}

if (revealSections.length && 'IntersectionObserver' in window) {
  // Check the visible share many times while scrolling (0%, 1%, 2% ... 100%),
  // so tall sections are noticed too.
  const revealThresholds = Array.from({ length: 101 }, (_, index) => index / 100);

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const viewportHeight = entry.rootBounds
        ? entry.rootBounds.height
        : window.innerHeight;

      // A section counts as "in view" when a quarter of it is visible OR when
      // it fills at least 30 % of the screen. The second rule is for tall
      // sections (Projects on a phone is ~3000px tall): a phone screen can
      // never show 25 % of it, so the section would stay invisible forever.
      const isInView = entry.isIntersecting && (
        entry.intersectionRatio >= 0.25
        || entry.intersectionRect.height >= viewportHeight * 0.3
      );

      entry.target.classList.toggle('in-view', isInView);
      if (entry.target.id === 'portfolio' && !entry.isIntersecting) {
        projectCards.forEach((card) => {
          card.style.removeProperty('transition-delay');
        });
      }
    });
  }, { threshold: revealThresholds });

  revealSections.forEach(section => revealObserver.observe(section));
} else {
  revealSections.forEach(section => section.classList.add('in-view'));
}

if (skillGroups instanceof HTMLElement && 'IntersectionObserver' in window) {
  const skillRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('skills-in-view', entry.isIntersecting);
      if (!entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-category').forEach((category) => {
          category.style.removeProperty('transition-delay');
        });
      }
    });
  }, { threshold: 0.08 });

  skillRevealObserver.observe(skillGroups);
} else if (skillGroups instanceof HTMLElement) {
  skillGroups.classList.add('skills-in-view');
}


/**
 * ==========================================
 * 09. CONTACT FORM MAILTO HANDLER
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
 * 10. LANGUAGE SWITCHER DROPDOWN
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

/**
 * ==========================================
 * 11. PROJECT SCREENSHOT CAROUSELS
 * ==========================================
 */
const projectCarousels = document.querySelectorAll('.project-carousel');

projectCarousels.forEach((carousel) => {
  const images = carousel.querySelectorAll('.project-carousel-image');
  const dots = carousel.querySelectorAll('.project-carousel-dot');
  let currentIndex = 0;
  let carouselInterval;

  function showSlide(index) {
    images.forEach(image => image.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    images[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function showNextSlide() {
    const nextIndex = (currentIndex + 1) % images.length;
    showSlide(nextIndex);
  }

  function startCarousel() {
    carouselInterval = window.setInterval(showNextSlide, 4000);
  }

  function restartCarousel() {
    window.clearInterval(carouselInterval);
    startCarousel();
  }

  carousel.addEventListener('project-carousel:show-slide', (event) => {
    const { index } = event.detail;
    if (Number.isInteger(index) && index >= 0 && index < images.length) {
      showSlide(index);
      restartCarousel();
    }
  });

  carousel.addEventListener('project-carousel:pause', () => {
    window.clearInterval(carouselInterval);
  });

  carousel.addEventListener('project-carousel:resume', restartCarousel);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      restartCarousel();
    });
  });

  startCarousel();
});

/**
 * ==========================================
 * 12. PROJECT IMAGE LIGHTBOX
 * ==========================================
 */
const projectLightbox =
  document.getElementById('project-lightbox');

if (projectLightbox) {
  const lightboxImage =
    projectLightbox.querySelector('.project-lightbox-image');
  const lightboxClose =
    projectLightbox.querySelector('.project-lightbox-close');
  const lightboxPrevious =
    projectLightbox.querySelector('.project-lightbox-previous');
  const lightboxNext =
    projectLightbox.querySelector('.project-lightbox-next');
  let activeCarousel = null;
  let activeSlideIndex = -1;

  function openLightbox(image) {
    activeCarousel = image.closest('.project-carousel');
    const images = activeCarousel
      ? [...activeCarousel.querySelectorAll('.project-carousel-image')]
      : [];
    activeSlideIndex = images.indexOf(image);

    if (!activeCarousel || activeSlideIndex < 0) {
      console.error('Unable to find the selected screenshot in its carousel.');
      return;
    }

    activeCarousel.dispatchEvent(new CustomEvent('project-carousel:pause'));
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    projectLightbox.classList.add('is-open');
    projectLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    projectLightbox.classList.remove('is-open');
    projectLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    activeCarousel?.dispatchEvent(new CustomEvent('project-carousel:resume'));
    activeCarousel = null;
    activeSlideIndex = -1;

    window.setTimeout(() => {
      lightboxImage.src = '';
      lightboxImage.alt = '';
    }, 300);
  }

  function navigateLightbox(direction) {
    if (!activeCarousel) {
      return;
    }

    const images = [...activeCarousel.querySelectorAll('.project-carousel-image')];
    if (!images.length) {
      return;
    }

    activeSlideIndex = (activeSlideIndex + direction + images.length) % images.length;
    const image = images[activeSlideIndex];

    activeCarousel.dispatchEvent(new CustomEvent('project-carousel:show-slide', {
      detail: { index: activeSlideIndex }
    }));
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
  }

  document.querySelectorAll('.project-carousel-image').forEach((image) => {
    image.addEventListener('click', () => {
      openLightbox(image);
    });
  });

  lightboxClose.addEventListener('click', () => {
    closeLightbox();
  });

  lightboxPrevious.addEventListener('click', () => {
    navigateLightbox(-1);
  });

  lightboxNext.addEventListener('click', () => {
    navigateLightbox(1);
  });

  projectLightbox.addEventListener('click', (event) => {
    if (event.target === projectLightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!projectLightbox.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateLightbox(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateLightbox(1);
    }
  });
}
