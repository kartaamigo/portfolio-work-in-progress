(() => {
 const canvas=document.querySelector('.bunny-eraser');
 if(!canvas)return;
 const ctx=canvas.getContext('2d');
 const bunny=new Image();bunny.src='assets/eraser/bunny.png';
 const frames=[1,2,3,4].map(i=>{const img=new Image();img.src=`assets/eraser/${i}.png`;return img});
 let last=null,restoreTimer,fade,step=0,ready=false;
 function draw(image=bunny){
  if(!image.complete||!image.naturalWidth)return;
  canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  ctx.globalCompositeOperation='source-over';ctx.drawImage(image,0,0);step=0;
 }
 bunny.decode().then(()=>{ready=true;draw()});
 function restore(){
  clearTimeout(restoreTimer);fade?.cancel();last=null;step=0;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){draw();return}
  fade=canvas.animate([{opacity:1},{opacity:.2},{opacity:1}],{duration:500});
  restoreTimer=setTimeout(()=>draw(),250);
 }
 canvas.addEventListener('pointermove',event=>{
  if(!ready||event.pointerType==='touch'||document.body.dataset.preview!=='neutral')return;
  clearTimeout(restoreTimer);fade?.cancel();
  const rect=canvas.getBoundingClientRect();
  const point={x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};
  // The person is a separate untouched layer. Erasing applies only to the bunny canvas.
  ctx.globalCompositeOperation='destination-out';ctx.lineWidth=38*canvas.width/rect.width;
  ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
  ctx.moveTo(last?.x??point.x,last?.y??point.y);ctx.lineTo(point.x+.01,point.y+.01);ctx.stroke();
  last=point;
 });
 canvas.addEventListener('pointerleave',()=>{last=null;restoreTimer=setTimeout(restore,650)});
 canvas.addEventListener('click',()=>{
  const next=(step%4)+1;draw(frames[next-1]);step=next;
 });
 canvas.addEventListener('keydown',event=>{
  if(event.key==='Escape'){restore();return}
  if(event.key==='Enter'||event.key===' '){event.preventDefault();canvas.click()}
 });
 canvas.addEventListener('blur',restore);
 canvas.inert=document.body.dataset.preview!=='neutral';
 window.addEventListener('world-preview',()=>{
  canvas.inert=document.body.dataset.preview!=='neutral';
  if(document.body.dataset.preview!=='neutral'){clearTimeout(restoreTimer);fade?.cancel();last=null;draw()}
 });
})();
