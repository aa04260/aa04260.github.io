// Keep evidence links usable even when their detailed record is collapsed.
function revealLinkedRecord() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  let element = target;
  let revealed = false;
  while (element) {
    if (element.tagName === 'DETAILS' && !element.open) {
      element.open = true;
      revealed = true;
    }
    element = element.parentElement;
  }
  if (revealed) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
window.addEventListener('hashchange', revealLinkedRecord);
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href^="#"]');
  if (anchor && anchor.hash === location.hash) revealLinkedRecord();
});
revealLinkedRecord();
