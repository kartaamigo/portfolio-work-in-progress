(() => {
 const symbols=/[↗↘↙↖↑↓←→↔✳✧◈⌂▦⌘◷↝]/g;
 function clean(){
  const prev=document.querySelector('[data-gallery-step="-1"]');
  const next=document.querySelector('[data-gallery-step="1"]');
  if(prev.textContent!==(window.portfolioI18n?.t('Назад') || 'Назад'))prev.textContent=(window.portfolioI18n?.t('Назад') || 'Назад');
  if(next.textContent!==(window.portfolioI18n?.t('Далее') || 'Далее'))next.textContent=(window.portfolioI18n?.t('Далее') || 'Далее');
  const close=document.querySelector('#project-dialog .close');
  if(close.textContent!==(window.portfolioI18n?.t('Закрыть') || 'Закрыть'))close.textContent=(window.portfolioI18n?.t('Закрыть') || 'Закрыть');
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while(node=walker.nextNode()){
   if(node.parentElement.closest('script,style'))continue;
   const value=node.nodeValue.replace(symbols,'');
   if(value!==node.nodeValue)node.nodeValue=value;
  }
 }
 clean();
 new MutationObserver(clean).observe(document.body,{childList:true,characterData:true,subtree:true});
})();
