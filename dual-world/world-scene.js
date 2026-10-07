(() => {
 const frame=document.querySelector('.digital-frame');
 const dialog=frame.querySelector('[role="tooltip"]');
 const returnButton=document.createElement('button');
 returnButton.className='world-center-return';
 returnButton.type='button';
 returnButton.textContent='↩ Вернуться в центр';
 returnButton.hidden=true;
 returnButton.addEventListener('click',()=>document.querySelector('.world-reset').click());
 document.body.append(returnButton);
 const mist=document.createElement('div');
 mist.className='world-mist';
 mist.setAttribute('aria-hidden','true');
 document.querySelector('.hero-artwork').append(mist);
 let previous=document.body.dataset.preview;
 let mistAnimation;
 let revealAnimation;
 let revealing;
 function cancelReveal(){
  revealAnimation?.cancel();
  revealing?.classList.remove('spray-revealing');
 }
 function reveal(incoming,duration){
  cancelReveal();
  revealing=incoming;
  const animation=incoming.animate([
   {opacity:0},
   {opacity:1}
  ],{duration,easing:'ease-in-out'});
  revealAnimation=animation;
  animation.onfinish=()=>incoming.classList.remove('spray-revealing');
 }
 function update(){
  const world=document.body.dataset.preview;
  const shown=world==='digital';
  returnButton.hidden=document.body.dataset.world==='neutral';
  frame.inert=!shown;
  if(!shown)dialog.hidden=true;
  if(world!==previous){
   document.body.classList.add('world-entered');
   mistAnimation?.cancel();
   cancelReveal();
  }
  if(world!==previous&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
   const opacity=parseFloat(getComputedStyle(mist).opacity)||0;
   const incoming=document.querySelector({art:'.artwork-art',neutral:'.artwork-neutral',digital:'.digital-frame'}[world]);
   reveal(incoming,800);
   mistAnimation=mist.animate([
    {opacity},
    {opacity:.34,offset:.42},
    {opacity:0}
   ],{duration:1150,easing:'ease-in-out'});
  }
  previous=world;
 }
 window.addEventListener('world-preview',update);
 update();
 document.body.classList.add('world-entered');
 const fonts=document.createElement('link');
 fonts.rel='stylesheet';
 fonts.href=new URL('../shared-fonts/fonts.css',document.currentScript.src).href;
 fonts.media='print';
 fonts.onload=()=>{fonts.media='all'};
 document.head.append(fonts);
})();
