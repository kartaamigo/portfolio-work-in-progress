(() => {
 const symbols=/[↗↘↙↖↑↓←→↔✳✧◈⌂▦⌘◷↝]/g;
 function clean(){
  const prev=document.querySelector('[data-gallery-step="-1"]');
  const next=document.querySelector('[data-gallery-step="1"]');
  if(prev.textContent!=='Назад')prev.textContent='Назад';
  if(next.textContent!=='Далее')next.textContent='Далее';
  const close=document.querySelector('#project-dialog .close');
  if(close.textContent!=='Закрыть')close.textContent='Закрыть';
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while(node=walker.nextNode()){
   if(node.parentElement.closest('script,style'))continue;
   const value=node.nodeValue.replace(symbols,'').trimEnd();
   if(value!==node.nodeValue)node.nodeValue=value;
  }
 }
 clean();
 new MutationObserver(clean).observe(document.body,{childList:true,characterData:true,subtree:true});
})();
