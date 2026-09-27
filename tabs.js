(() => {
  const bar = document.querySelector('.content-tabs');
  const tabs = [...bar.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  panels.forEach((panel, index) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[index].id);
    panel.tabIndex = 0;
  });

  function select(index) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  }

  function reveal(hash, scroll = false) {
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return; }
    const index = panels.findIndex(panel => panel === target || panel.contains(target));
    if (index < 0) return;
    select(index);
    if (scroll) requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
  }

  function activate(index) {
    select(index);
    const hash = '#' + panels[index].id;
    if (location.hash !== hash) history.pushState(null, '', hash);
    document.querySelector('.work-details').scrollIntoView({block: 'start'});
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      activate(next);
    });
  });

  // Reveal a hidden panel before native fragment navigation calculates its position.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey)
      reveal(link.getAttribute('href'));
  });
  window.addEventListener('hashchange', () => {
    if (!location.hash) select(0);
    else reveal(location.hash, true);
  });

  select(0);
  bar.hidden = false;
  reveal(location.hash, true);
})();
