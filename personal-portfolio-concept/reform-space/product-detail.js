(() => {
 const section=document.getElementById('life-detail');
 const original=section.innerHTML;
 const blaze={headline:'Виджеты для рабочего стола',features:[['▦','Личные виджеты','Виджеты и заметки на рабочем столе.'],['◷','Время и фокус','Таймер и статистика рабочего времени.'],['↗','Рабочие дни','Учёт активности, рабочих дней и цели месяца.']]};
 function render(project){
  if(project.id==='life')section.innerHTML=original;
  else{
   section.innerHTML='<div class="section-heading"><h2></h2></div><article class="life-intro"><span class="pill"></span><h3></h3><p></p><div class="life-points"></div></article><button class="screen-showcase" type="button"><div><span></span><b>Рассмотреть ↗</b></div><img><span class="screen-caption"></span></button><div class="project-footnote"><p></p></div>';
   section.querySelector('.life-intro h3').innerHTML=project.id==='blaze'?blaze.headline:'О проекте';
   const points=section.querySelector('.life-points');
   if(project.id==='blaze')blaze.features.forEach(([icon,title,description])=>{const item=document.createElement('div');const mark=document.createElement('span');mark.textContent=icon;const h=document.createElement('h4');h.textContent=title;const p=document.createElement('p');p.textContent=description;item.append(mark,h,p);points.append(item);});
   else points.remove();
  }
  section.querySelector('.section-heading h2').textContent='О '+project.title;
  section.querySelector('.pill').textContent=project.status;
  section.querySelector('.life-intro>p').textContent=project.detail||project.description;
  const screen=section.querySelector('.screen-showcase');screen.setAttribute('aria-label','Рассмотреть '+project.title);screen.querySelector('div>span').textContent=project.title+' / МАКЕТ';
  const image=screen.querySelector('img');image.src=project.image;image.alt=project.alt||project.title;
  screen.querySelector('.screen-caption').textContent='Нажми, чтобы рассмотреть макет '+project.title+' крупнее.';
  section.querySelector('.project-footnote p').textContent=project.id==='blaze'?'Дизайн интерфейса. Прототип для Windows в разработке.':project.description;
  // Replacing the section also replaces the button, so bind the current project.
  screen.addEventListener('click',()=>openProject(selectedProject));
 }
 window.addEventListener('project-selected',event=>render(event.detail));
 render(projectData[selectedProject]);
})();
