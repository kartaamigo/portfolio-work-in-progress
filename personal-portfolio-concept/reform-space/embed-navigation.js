function reportHeight() {
  const world=document.querySelector('.world');
  parent.postMessage({type:'reform-height',height:world.offsetTop+world.offsetHeight+2},location.origin);
}
new ResizeObserver(reportHeight).observe(document.querySelector('.world'));
window.addEventListener('load',reportHeight);
function navigate(section) {
  const target=document.getElementById(section);
  if(target) parent.postMessage({type:'reform-scroll',top:section==='home'?0:target.getBoundingClientRect().top},location.origin);
}
document.addEventListener('click',event => {
  const link=event.target.closest('a[href^="#"]');
  if(!link || !document.getElementById(link.hash.slice(1))) return;
  event.preventDefault();
  navigate(link.hash.slice(1));
});
window.addEventListener('message',event => {
  if(event.source!==parent || event.origin!==location.origin) return;
  if(event.data?.type==='reform-navigate') navigate(event.data.section);
  if(event.data?.type==='reform-viewport') {
    window.reformViewportTop=event.data.top;
    document.documentElement.style.setProperty('--view-top',event.data.top+'px');
    document.documentElement.style.setProperty('--view-height',event.data.height+'px');
    const main=document.querySelector('.app-shell main');
    for(const rail of document.querySelectorAll('.rail,.activity')) {
      const shift=Math.max(0,Math.min(event.data.top,main.offsetHeight-rail.offsetHeight));
      rail.style.transform='translateY('+shift+'px)';
    }
    window.dispatchEvent(new Event('scroll'));
  }
});
