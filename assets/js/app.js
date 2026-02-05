/* app.js — lichte interactiviteit
   Plaats op /assets/js/app.js en laad met <script src="/assets/js/app.js" defer></script>
   Functies:
   - sticky header schaduw bij scroll
   - mobile menu toggle (als je .mobile-toggle gebruikt)
   - reveal-animaties via IntersectionObserver
*/

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.site-header');
  const revealItems = document.querySelectorAll('.reveal');

  // 1) Sticky header: toggle .scrolled
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2) Optional mobile nav toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.site-nav');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // 3) Reveal animations (IntersectionObserver)
  if ('IntersectionObserver' in window && revealItems.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // reveal once
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(el => obs.observe(el));
  } else {
    // fallback: show all
    revealItems.forEach(el => el.classList.add('visible'));
  }

  // Small accessibility: close mobile nav on outside click (optional)
  document.addEventListener('click', (e) => {
    if (!nav || !mobileToggle) return;
    if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
      nav.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});
