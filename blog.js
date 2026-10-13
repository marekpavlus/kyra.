// ==========================================
// HEADER ELEMENTS & CONTROLS
// ==========================================
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const siteSearch = document.querySelector('[data-site-search]');

// ==========================================
// MOBILE NAVIGATION
// ==========================================
function closeMobileMenu() {
  header.classList.remove('mobile-menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = window.t('ui.openMenu');
  menuToggle.querySelector('i').className = 'fa-solid fa-bars';
}

// ==========================================
// INITIAL THEME STATE
// ==========================================
const darkMode = document.body.classList.contains('dark-mode');
themeToggle.setAttribute('aria-label', darkMode ? window.t('ui.switchToLight') : window.t('ui.switchToDark'));
themeToggle.querySelector('i').className = darkMode
  ? 'fa-solid fa-lightbulb'
  : 'fa-regular fa-lightbulb';

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('mobile-menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('.sr-only').textContent = isOpen ? window.t('ui.closeMenu') : window.t('ui.openMenu');
  menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

// ==========================================
// LIGHT / DARK MODE TOGGLE
// ==========================================
themeToggle.addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  document.documentElement.classList.toggle('dark-mode', isDarkMode);
  themeToggle.setAttribute('aria-label', isDarkMode ? window.t('ui.switchToLight') : window.t('ui.switchToDark'));
  themeToggle.querySelector('i').className = isDarkMode
    ? 'fa-solid fa-lightbulb'
    : 'fa-regular fa-lightbulb';

  try {
    localStorage.setItem('kyra-theme', isDarkMode ? 'dark' : 'light');
  } catch (error) {
    console.error('Unable to save the selected color theme.', error);
  }
});

// ==========================================
// LANGUAGE DROPDOWN CONTROLS
// ==========================================
document.querySelectorAll('.lang-switcher').forEach((switcher) => {
  const button = switcher.querySelector('.lang-btn');
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = switcher.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

// ==========================================
// CLOSE LANGUAGE DROPDOWNS ON OUTSIDE CLICK
// ==========================================
document.addEventListener('click', (event) => {
  document.querySelectorAll('.lang-switcher.is-open').forEach((switcher) => {
    if (!switcher.contains(event.target)) {
      switcher.classList.remove('is-open');
      switcher.querySelector('.lang-btn').setAttribute('aria-expanded', 'false');
    }
  });
});

// ==========================================
// CLOSE MOBILE MENU AFTER NAVIGATION
// ==========================================
header.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

// ==========================================
// BLOG HEADER SEARCH
// ==========================================
if (siteSearch) {
  const searchInput = siteSearch.querySelector('.header-search-input');
  const searchToggle = siteSearch.querySelector('.header-search-toggle');
  const searchResults = siteSearch.querySelector('.header-search-results');
  const quickLinks = [...header.querySelectorAll('nav a.nav-item')];
  const homePage = `index.html?lang=${document.documentElement.lang}`;
  const projects = [
    'Personal Finance API',
    'Aurora Cliffs Hotel System',
    'KYRA. Bank System',
    'KYRA. Portfolio'
  ].map((label, index) => ({
    href: `${homePage}#${['project-finance-api', 'project-hotel', 'project-bank', 'project-kyra'][index]}`,
    label
  }));
  let searchPinnedOpen = false;

  function normalizeSearchText(value) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
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
    const matchingLinks = quickLinks.filter((link) => normalizeSearchText(
      `${link.textContent} ${link.dataset.searchTerms || ''}`
    ).includes(query));
    const matchingProjects = projects.filter((project) => normalizeSearchText(
      `${project.label} projects project portfolio`
    ).includes(query));

    searchResults.replaceChildren();
    renderSearchGroup(siteSearch.dataset.pagesLabel, matchingLinks.map((link) => ({
      href: link.getAttribute('href'),
      label: link.textContent.trim()
    })));
    renderSearchGroup(siteSearch.dataset.projectsLabel, matchingProjects);

    if (!matchingLinks.length && !matchingProjects.length) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'header-search-empty';
      emptyMessage.textContent = siteSearch.dataset.noResults;
      searchResults.append(emptyMessage);
    }
  }

  function updateSearchVisibility(isOpen) {
    siteSearch.classList.toggle('is-open', isOpen);
    searchToggle.setAttribute('aria-expanded', String(isOpen));
    searchToggle.setAttribute(
      'aria-label',
      isOpen ? siteSearch.dataset.closeLabel : siteSearch.dataset.openLabel
    );
  }

  // Match index.html: on phones and tablets the search opens only by click.
  // Desktop retains its original hover behavior.
  const desktopSearchHover = window.matchMedia('(min-width: 1680px) and (hover: hover) and (pointer: fine)');
  siteSearch.addEventListener('pointerenter', () => {
    if (desktopSearchHover.matches) updateSearchVisibility(true);
  });
  siteSearch.addEventListener('pointerleave', () => {
    if (desktopSearchHover.matches && !searchPinnedOpen && !siteSearch.contains(document.activeElement)) {
      updateSearchVisibility(false);
    }
  });
  siteSearch.addEventListener('focusin', () => {
    if (desktopSearchHover.matches) updateSearchVisibility(true);
  });
  siteSearch.addEventListener('focusout', (event) => {
    if (desktopSearchHover.matches && !searchPinnedOpen && !siteSearch.contains(event.relatedTarget)) {
      updateSearchVisibility(false);
    }
  });
  searchToggle.addEventListener('click', () => {
    searchPinnedOpen = !searchPinnedOpen;
    updateSearchVisibility(searchPinnedOpen);

    if (searchPinnedOpen) {
      searchInput.focus();
    } else {
      searchInput.blur();
    }
  });
  searchInput.addEventListener('input', updateSiteSearch);
  searchResults.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      searchPinnedOpen = false;
      updateSearchVisibility(false);
    }
  });
  document.addEventListener('click', (event) => {
    if (!siteSearch.contains(event.target)) {
      searchPinnedOpen = false;
      updateSearchVisibility(false);
    }
  });

  updateSiteSearch();
}

// ==========================================
// PRESERVE LANGUAGE ON HOME LINKS
// ==========================================
// Keep the selected language when navigating back to the main page.
document.querySelectorAll('a[href^="index.html?lang=en#"]').forEach((link) => {
  link.href = link.href.replace('lang=en', `lang=${document.documentElement.lang}`);
});

// Keep the blog navigation in sync with index.html when menus are dismissed.
function closeBlogDesktopDropdowns() {
  if (window.innerWidth < 1680) return;
  document.querySelectorAll('.lang-switcher.is-open, .projects-switcher.is-open').forEach(el => {
    el.classList.remove('is-open');
    el.querySelector('.lang-btn, .projects-chevron')?.setAttribute('aria-expanded', 'false');
  });
}
header.addEventListener('mouseleave', () => {
  if (window.scrollY > 40) closeBlogDesktopDropdowns();
});
document.addEventListener('pointermove', event => {
  if (window.innerWidth >= 1680 && window.scrollY > 40 && event.clientY > 100 && !header.matches(':hover')) {
    closeBlogDesktopDropdowns();
  }
});
menuToggle.addEventListener('click', () => {
  if (!header.classList.contains('mobile-menu-open') && siteSearch) {
    siteSearch.classList.remove('is-open');
    siteSearch.querySelector('.header-search-toggle')?.setAttribute('aria-expanded', 'false');
  }
});


/* KYRA shared navigation: close popovers when the desktop header hides. */
(function () {
  const navHeader = document.querySelector('header');
  if (!navHeader) return;
  function closePopovers() {
    if (window.innerWidth < 1680) return;
    navHeader.querySelectorAll('.projects-switcher.is-open, .lang-switcher.is-open').forEach((el) => {
      el.classList.remove('is-open');
      el.querySelector('.projects-chevron, .lang-btn')?.setAttribute('aria-expanded', 'false');
    });
  }
  navHeader.addEventListener('mouseleave', () => {
    if (window.scrollY > 40) closePopovers();
  });
  document.addEventListener('pointermove', (event) => {
    if (window.scrollY > 40 && event.clientY > 100 && !navHeader.matches(':hover')) closePopovers();
  }, {passive: true});
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40 && !document.body.classList.contains('header-peek')) closePopovers();
  }, {passive: true});
  document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    navHeader.querySelectorAll('.lang-switcher.is-open, .projects-switcher.is-open').forEach((el) => {
      el.classList.remove('is-open');
      el.querySelector('.lang-btn, .projects-chevron')?.setAttribute('aria-expanded','false');
    });
  });
})();

/* Close both desktop popovers on the very frame the scroll navbar hides. */
(() => {
  const nav = document.querySelector('header');
  if (!nav) return;
  const close = () => {
    if (window.innerWidth < 1680 || window.scrollY <= 40) return;
    nav.querySelectorAll('.projects-switcher.is-open, .lang-switcher.is-open').forEach((box) => {
      box.classList.remove('is-open');
      box.querySelector('.projects-chevron, .lang-btn')?.setAttribute('aria-expanded', 'false');
    });
  };
  const observer = new MutationObserver(() => {
    if (!document.body.classList.contains('header-peek')) close();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('scroll', () => {
    if (!document.body.classList.contains('header-peek')) close();
  }, { passive: true });
})();


/* Integrated Projects dropdown behavior (formerly projects-menu.js). */
/* Projects dropdown: click only on all devices. */
(() => {
  const desktop = window.matchMedia('(min-width: 1680px) and (hover: hover) and (pointer: fine)');
  document.querySelectorAll('.projects-switcher').forEach((box) => {
    const button = box.querySelector('.projects-chevron');
    const label = box.querySelector('.projects-trigger');
    const setOpen = (open) => {
      box.classList.remove('was-open');
      box.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Hide projects' : 'Show projects');
    };
    if (!button) return;
    button.addEventListener('click', (event) => {
      event.preventDefault(); event.stopPropagation();
      setOpen(!box.classList.contains('is-open'));
    });
    // Click only: hover never opens the project list.
    label.addEventListener('click', () => setOpen(false));
    document.addEventListener('click', (event) => { if (!box.contains(event.target)) setOpen(false); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
    desktop.addEventListener('change', () => setOpen(false));
    const hamburger = document.querySelector('.menu-toggle');
    hamburger?.addEventListener('click', () => setOpen(false));
  });
})();

/* Keep Projects and Language mutually exclusive without interrupting their fade transitions. */
(() => {
  document.addEventListener('click', (event) => {
    const projectsToggle = event.target.closest('.projects-chevron');
    const languageToggle = event.target.closest('.lang-btn');
    if (!projectsToggle && !languageToggle) return;
    const selector = projectsToggle ? '.lang-switcher.is-open' : '.projects-switcher.is-open';
    document.querySelectorAll(selector).forEach((box) => {
      box.classList.remove('is-open');
      const button = box.querySelector('.lang-btn, .projects-chevron');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  }, true);
})();

