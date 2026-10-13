/* KYRA. minimal navigation progress indicator. */
(() => {
  const bar = document.createElement('div');
  bar.className = 'kyra-page-progress';
  document.documentElement.appendChild(bar);
  const finish = () => {
    bar.classList.add('kyra-progress-done');
    setTimeout(() => bar.classList.remove('kyra-progress-active','kyra-progress-done'), 480);
  };
  if (sessionStorage.getItem('kyra-navigating') === '1') {
    sessionStorage.removeItem('kyra-navigating');
    bar.classList.add('kyra-progress-active');
    bar.style.width = '82%';
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, {once:true});
  }
  document.addEventListener('click', (event) => {
    const a = event.target.closest('a[href]');
    if (!a || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || a.hasAttribute('download') || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname && url.search === location.search) return;
    if (!/\.html$/i.test(url.pathname) && !url.pathname.endsWith('/')) return;
    sessionStorage.setItem('kyra-navigating','1');
    bar.style.width = '0%';
    bar.classList.add('kyra-progress-active');
    requestAnimationFrame(() => { bar.style.width = '72%'; });
  }, {capture:true});
  window.addEventListener('pageshow', (e) => { if(e.persisted) finish(); });
})();
