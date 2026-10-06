(() => {
 const canvas=document.querySelector('.left-bunny-eraser');
 if(!canvas)return;
 const context=canvas.getContext('2d');
 const source=canvas.parentElement.querySelector('img');
 let point=null,timer,fade,ready=false,layout;
 function draw(){
  if(!ready)return;
  const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
  const mobile=rect.width<=560;
  const scale=mobile?rect.width/source.naturalWidth:Math.max(rect.width/source.naturalWidth,rect.height/source.naturalHeight);
  const width=source.naturalWidth*scale,height=source.naturalHeight*scale;
  layout={scale:scale*dpr,x:(rect.width-width)/2*dpr,y:(mobile?45:(rect.height-height)*(rect.width<=800?.35:.5))*dpr,dpr};
  context.globalCompositeOperation='source-over';
  context.drawImage(source,layout.x,layout.y,width*dpr,height*dpr);
 }
 source.decode().then(()=>{ready=true;draw()});
 function reset(){
  clearTimeout(timer);fade?.cancel();point=null;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){draw();return}
  fade=canvas.animate([{opacity:1},{opacity:.2},{opacity:1}],{duration:450});
  timer=setTimeout(draw,225);
 }
 canvas.addEventListener('pointermove',event=>{
  if(!ready||event.pointerType==='touch')return;
  clearTimeout(timer);fade?.cancel();
  const rect=canvas.getBoundingClientRect();
  const next={x:(event.clientX-rect.left)*layout.dpr,y:(event.clientY-rect.top)*layout.dpr};
  const sx=(next.x-layout.x)/layout.scale,sy=(next.y-layout.y)/layout.scale;
  if(sx<200||sx>1480||sy<65||sy>920){point=null;return}
  context.globalCompositeOperation='destination-out';context.lineCap='round';context.lineJoin='round';
  context.lineWidth=42*layout.dpr;context.beginPath();context.moveTo(point?.x??next.x,point?.y??next.y);
  context.lineTo(next.x+.01,next.y+.01);context.stroke();point=next;
 });
 canvas.addEventListener('pointerleave',()=>{point=null;timer=setTimeout(reset,650)});
 canvas.addEventListener('click',()=>{
  if(!ready)return;
  context.globalCompositeOperation='destination-out';context.lineWidth=70*layout.scale;context.lineCap='round';
  context.beginPath();context.moveTo(layout.x+600*layout.scale,layout.y+550*layout.scale);
  context.lineTo(layout.x+1080*layout.scale,layout.y+410*layout.scale);context.stroke();
 });
 canvas.addEventListener('keydown',event=>{
  if(event.key==='Escape')reset();
  if(event.key==='Enter'||event.key===' '){event.preventDefault();canvas.click()}
 });
 canvas.addEventListener('blur',reset);
 new ResizeObserver(()=>{point=null;draw()}).observe(canvas);
 function update(){
  canvas.inert=document.body.dataset.preview!=='art';
  if(canvas.inert){clearTimeout(timer);fade?.cancel();point=null;draw()}
 }
 window.addEventListener('world-preview',update);update();
})();
