document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav && !hamburger.dataset.bound) {
    hamburger.dataset.bound = 'true';
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }

  const currentPath = window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-target]').forEach((link) => {
    const target = link.getAttribute('data-nav-target');
    if (!target) return;
    const isHome = target === 'index.html' && (currentPath === '' || currentPath === 'index.html');
    const isMatch = currentPath === target || isHome;
    link.classList.toggle('active', isMatch);
  });

  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
});
