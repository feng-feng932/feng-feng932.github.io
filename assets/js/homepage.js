(() => {
  const links = [...document.querySelectorAll('.site-navigation a')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if (!sections.length) return;
  let selectedHash = location.hash || null;

  const update = () => {
    const headerHeight = document.querySelector('.masthead').offsetHeight;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= headerHeight + 100) active = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
      active = sections[sections.length - 1];
    }
    const selected = sections.find(section => '#' + section.id === selectedHash);
    if (selected) active = selected;
    for (const link of links) {
      const current = link.hash === '#' + active.id;
      link.classList.toggle('is-active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  for (const link of links) {
    link.addEventListener('click', () => { selectedHash = link.hash; update(); });
  }
  window.addEventListener('hashchange', () => { selectedHash = location.hash || null; update(); });
  window.addEventListener('wheel', () => { selectedHash = null; }, { passive: true });
  window.addEventListener('touchmove', () => { selectedHash = null; }, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) selectedHash = null;
  });
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { update(); scheduled = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
