/**
 * Tiny language engine.
 *
 * HTML conventions:
 *   data-language="key"                     -> replaces the element's text
 *   data-language-html="key"                -> replaces innerHTML (for text containing <b>, <i>, ...)
 *   data-language-attr="attr:key;attr:key"  -> sets attributes (aria-label, placeholder, href, data-*, ...)
 *
 * The language itself is decided by the tiny inline script in <head>
 * (URL ?lang=  >  saved choice  >  English) and written to <html lang="...">.
 */
(function () {
  const FALLBACK_LANG = 'en';
  const dictionaries = window.LANGUAGE || {};
  const lang = dictionaries[document.documentElement.lang]
    ? document.documentElement.lang
    : FALLBACK_LANG;

  const warned = new Set();

  function lookup(dictionary, key) {
    return key.split('.').reduce(
      (node, part) => (node && node[part] !== undefined ? node[part] : undefined),
      dictionary
    );
  }

  /** Returns the translation for `key`; falls back to English; warns when missing. */
  function t(key) {
    const value = lookup(dictionaries[lang], key);
    if (value !== undefined) {
      return value;
    }

    const fallback = lookup(dictionaries[FALLBACK_LANG], key);
    if (!warned.has(key)) {
      warned.add(key);
      if (fallback !== undefined) {
        console.warn(`[language] Missing "${lang}" translation for "${key}" - showing English instead.`);
      } else {
        console.error(`[language] Key "${key}" does not exist in any language.`);
      }
    }
    return fallback !== undefined ? fallback : key;
  }

  function applyTranslations(root = document) {
    root.querySelectorAll('[data-language]').forEach((element) => {
      element.textContent = t(element.dataset.language);
    });

    root.querySelectorAll('[data-language-html]').forEach((element) => {
      element.innerHTML = t(element.dataset.languageHtml);
    });

    root.querySelectorAll('[data-language-attr]').forEach((element) => {
      element.dataset.languageAttr.split(';').forEach((pair) => {
        const separator = pair.indexOf(':');
        if (separator < 1) {
          return;
        }
        const attribute = pair.slice(0, separator).trim();
        const key = pair.slice(separator + 1).trim();
        element.setAttribute(attribute, t(key));
      });
    });
  }

  /** Marks the current language in the dropdown and shows its flag on the button. */
  function syncLanguageSwitchers() {
    document.querySelectorAll('.lang-switcher').forEach((switcher) => {
      switcher.querySelectorAll('.lang-option').forEach((option) => {
        option.classList.toggle('active', option.dataset.lang === lang);
      });

      const current = switcher.querySelector(`.lang-option[data-lang="${lang}"] img`);
      const buttonFlag = switcher.querySelector('.lang-btn img');
      if (current && buttonFlag) {
        buttonFlag.src = current.src;
        buttonFlag.alt = current.alt;
      }
    });
  }

  /** Keeps the address bar shareable: index.html?lang=sk */
  function syncUrl() {
    try {
      const url = new URL(window.location.href);
      const hasParam = url.searchParams.has('lang');
      if (url.searchParams.get('lang') !== lang && (lang !== FALLBACK_LANG || hasParam)) {
        url.searchParams.set('lang', lang);
        window.history.replaceState(null, '', url);
      }
    } catch (error) {
      /* e.g. file:// previews - not important */
    }
  }

  applyTranslations();
  syncLanguageSwitchers();
  syncUrl();
  document.documentElement.classList.remove('language-pending');

  window.t = t;
  window.language = { lang, t, applyTranslations };
})();
