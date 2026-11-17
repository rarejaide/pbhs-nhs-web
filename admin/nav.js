(() => {
  // Resolve every link relative to nav.js itself, so it works from any page depth or host
  const scriptUrl = document.currentScript.src;
  const resolve = (path) => new URL(path, scriptUrl);

  const links = [
    { label: 'Back to Home',    href: '../index.html' },
    { label: 'Dashboard',       href: 'dashboard/index.html' },
    { label: 'Submit Hours',    href: 'submit-hours/index.html' },
    { label: 'Approve Hours',   href: 'approve-hours/index.html' },
    { label: 'Meeting Logs',    href: 'meetings/index.html' },
    { label: 'Version History', href: 'changelog/index.html' },
  ];

  // "/admin/dashboard/index.html" and "/admin/dashboard/" should count as the same page
  const normalize = (path) => path.replace(/index\.html$/, '').replace(/\/$/, '');
  const currentPath = normalize(location.pathname);

  const aside = document.createElement('aside');
  aside.className = 'nav';
  aside.innerHTML = `
    <h3 style="margin-top:0px;">
      <span class="important-heading" style="color:var(--gold);">PBHS NHS </span><br>
      <span style="color:var(--slate);font-family:'Work Sans';font-weight:500; font-size:10px; letter-spacing:2px;">ADMIN PORTAL</span>
    </h3>
    <div class="profile"></div>
  `;

  links.forEach(({ label, href }) => {
    const url = resolve(href);
    const a = document.createElement('a');
    a.className = 'nav-button';
    a.href = url.href;
    if (normalize(url.pathname) === currentPath) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
    a.innerHTML = `<p>${label}</p>`;
    aside.appendChild(a);
  });

  document.querySelector('.all-cont').prepend(aside);
})();