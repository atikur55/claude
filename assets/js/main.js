/* ============================================
   SHARED CUSTOM CURSOR
   ============================================ */
(() => {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (!cursor || !ring) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateCursorRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursorRing);
  }

  animateCursorRing();
})();

/* ============================================
   SHARED MOBILE OFFCANVAS MENU
   ============================================ */
(() => {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const desktopNav = document.querySelector('.header .nav');
  const desktopActions = document.querySelector('.header .header-right');

  if (!header || !toggle || !desktopNav || !desktopActions) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-menu-backdrop';

  const menu = document.createElement('aside');
  menu.className = 'mobile-menu-panel';
  menu.setAttribute('aria-hidden', 'true');
  menu.innerHTML = `
    <div class="mobile-menu-head">
      <a href="#" class="logo">${document.querySelector('.header .logo')?.innerHTML || '<span class="logo-text">LUXBID</span>'}</a>
      <button class="btn btn--icon mobile-menu-close" type="button" aria-label="Close menu">&times;</button>
    </div>
    <nav class="mobile-menu-nav" aria-label="Mobile navigation">${desktopNav.innerHTML}</nav>
    <div class="mobile-menu-actions">${desktopActions.innerHTML}</div>
  `;

  document.body.append(backdrop, menu);

  const closeButton = menu.querySelector('.mobile-menu-close');
  const focusableSelector = 'a, button, select, input, textarea, [tabindex]:not([tabindex="-1"])';

  function openMenu() {
    document.body.classList.add('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menu.querySelector(focusableSelector)?.focus({ preventScroll: true });
  }

  function closeMenu() {
    document.body.classList.remove('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('mobile-menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  closeButton?.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('.mobile-menu-nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
      closeMenu();
    }
  });
})();
