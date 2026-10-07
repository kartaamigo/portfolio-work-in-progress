(() => {
  const section = document.createElement('section');
  section.className = 'reform-site';
  section.setAttribute('aria-label', 'Reform - портфолио Марии Матвеевой');
  const frame = document.createElement('iframe');
  function loadReform() {
    if (!frame.getAttribute('src')) frame.src = 'reform-space/index.html?v=bilingual-95&lang=' + (document.documentElement.lang || 'ru');
  }
  frame.setAttribute('scrolling', 'no');
  frame.title = 'Reform: обо мне, проекты и контакты';
  section.append(frame);
  document.querySelector('.portfolio-content').prepend(section);
  function cleanOuterLabels(){
    document.querySelector('.world-reset').textContent='К папкам';
    for(const area of document.querySelectorAll('body>header,.choice-digital')){
      const walker=document.createTreeWalker(area,NodeFilter.SHOW_TEXT);let node;
      while(node=walker.nextNode())node.nodeValue=node.nodeValue.replace(/[↗↘↙↖↑↓←→↔]/g,'').trimEnd();
    }
  }
  cleanOuterLabels();
  window.addEventListener('world-preview',cleanOuterLabels);

  function syncViewport() {
    const bounds = frame.getBoundingClientRect();
    frame.contentWindow?.postMessage({type:'reform-viewport',top:Math.max(0,document.querySelector('body>header').getBoundingClientRect().height-bounds.top),height:Math.max(200,innerHeight-Math.max(document.querySelector('body>header').getBoundingClientRect().height,bounds.top))},location.origin);
  }
  window.addEventListener('scroll',syncViewport,{passive:true});
  window.addEventListener('resize',syncViewport);
  frame.addEventListener('load',syncViewport);
  window.addEventListener('message',event => {
    if(event.source!==frame.contentWindow || event.origin!==location.origin) return;
    if(event.data?.type==='reform-height' && Number.isFinite(event.data.height)) {
      frame.style.height=Math.ceil(Math.max(600,Math.min(100000,event.data.height)))+'px';
      syncViewport();
    }
    if(event.data?.type==='reform-scroll' && Number.isFinite(event.data.top)) {
      window.scrollTo({top:scrollY+frame.getBoundingClientRect().top+event.data.top-document.querySelector('body>header').getBoundingClientRect().height-12,behavior:'instant'});
      syncViewport();
    }
  });

  function open(sectionName = 'home') {
    loadReform();
    section.scrollIntoView({block:'start', behavior:'instant'});
    const navigate = () => frame.contentWindow.postMessage({type:'reform-navigate', section:sectionName}, location.origin);
    if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.URL.includes('reform-space/')) navigate();
    else frame.addEventListener('load', navigate, {once:true});
  }
  window.addEventListener('world-preview', event => {
    if (event.detail === 'digital') loadReform();
    if (event.detail === document.body.dataset.world) requestAnimationFrame(() => window.scrollTo({top:0,behavior:'instant'}));
  });
  document.querySelectorAll('header nav a').forEach(link => {
    link.addEventListener('click', event => {
      if(link.hasAttribute('data-header-contact')){
        event.preventDefault();event.stopImmediatePropagation();
        location.href=link.href;
        return;
      }
      if(link.dataset.headerWorld || link.hasAttribute('data-header-contact')){
        event.preventDefault();event.stopImmediatePropagation();
        if(link.dataset.headerWorld){
          const world=link.dataset.headerWorld;choose(world);
          requestAnimationFrame(()=>{
            window.scrollTo({top:0,behavior:'instant'});
          });
        }else{
          const world=document.body.dataset.world;
          if(world==='digital')open('contact');
          else if(world==='photography')document.querySelector('#photo-contacts')?.scrollIntoView({block:'start',behavior:'instant'});
          else{if(world==='neutral')choose('art');requestAnimationFrame(()=>document.querySelector('#contacts')?.scrollIntoView({block:'start',behavior:'instant'}));}
        }
        return;
      }
      if (document.body.dataset.world !== 'digital' && link.hash !== '#reform') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (document.body.dataset.world !== 'digital') choose('digital');
      const destination = {'#about':'home', '#projects':'projects', '#reform':'space', '#contacts':'contact'}[link.hash];
      requestAnimationFrame(() => open(destination || 'home'));
    }, true);
  });
  history.scrollRestoration = 'manual';
  window.scrollTo({top:0,behavior:'instant'});
})();
