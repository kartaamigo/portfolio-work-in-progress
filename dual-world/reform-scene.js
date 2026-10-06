(() => {
  const scene = document.querySelector('.reform-playground');
  if (!scene) return;
  const dialog = scene.querySelector('[role="tooltip"]');
  const props = [...scene.querySelectorAll('.reform-prop')];
  let active = null;
  let pinned = null;
  let typingTimer;
  const paragraph=dialog.querySelector('p');
  const typed=document.createElement('span');
  typed.className='dialog-typed';
  typed.setAttribute('aria-hidden','true');
  paragraph.replaceChildren(typed);
  function type(message){
    clearTimeout(typingTimer);
    paragraph.dataset.full=message;
    paragraph.setAttribute('aria-label',message);
    typed.textContent='';
    dialog.classList.remove('is-typing');
    if(matchMedia('(prefers-reduced-motion:reduce)').matches){typed.textContent=message;return}
    dialog.classList.add('is-typing');
    const letters=Array.from(message);let index=0;
    function next(){
      typed.textContent+=letters[index++];
      if(index<letters.length)typingTimer=setTimeout(next,/[.!?]/.test(letters[index-1])?90:22);
      else dialog.classList.remove('is-typing');
    }
    next();
  }
  function show(button) {
    const fresh=active!==button||dialog.hidden;
    active = button;
    props.forEach(prop => prop.setAttribute('aria-expanded', String(prop === button)));
    if(fresh)type(button.dataset.message);
    dialog.hidden = false;
    if (matchMedia('(min-width:681px)').matches) {
      const left = parseFloat(getComputedStyle(button).left) / scene.clientWidth * 100;
      dialog.style.left = `${Math.max(2, Math.min(68, left + 10))}%`;
      dialog.style.top = `${Math.min(56, Math.max(18, parseFloat(getComputedStyle(button).top) / scene.clientHeight * 100 + 14))}%`;
    } else {
      dialog.style.removeProperty('left');
      dialog.style.removeProperty('top');
    }
  }
  function hide() {
    clearTimeout(typingTimer);
    dialog.classList.remove('is-typing');
    active = null;
    dialog.hidden = true;
    props.forEach(prop => prop.setAttribute('aria-expanded', 'false'));
  }
  props.forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch' && !pinned) show(button); });
    button.addEventListener('pointerleave', () => { if (!pinned && document.activeElement !== button) hide(); });
    button.addEventListener('focus', () => { if (!pinned) show(button); });
    button.addEventListener('blur', () => { if (!pinned) hide(); });
    button.addEventListener('click', () => {
      if (pinned === button) { pinned = null; hide(); }
      else { pinned = button; show(button); }
    });
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.reform-prop')) { pinned = null; hide(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { pinned = null; hide(); }
  });
  window.addEventListener('resize', () => { if (active) show(active); });
  window.addEventListener('world-preview',()=>{if(document.body.dataset.preview!=='digital'){pinned=null;hide()}});
  new IntersectionObserver(([entry]) => {
    scene.classList.toggle('scene-paused', !entry.isIntersecting);
    if (!entry.isIntersecting) { pinned = null; hide(); }
  }).observe(scene);
})();
