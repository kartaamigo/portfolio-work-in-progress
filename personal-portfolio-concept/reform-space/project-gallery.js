(() => {
 const storageKey='reform-project-folders-v1';
 const defaults=projectData.map(project=>({...project,category:project.id==='life'?'ДЛЯ ЖИЗНИ':'РАБОЧИЙ РИТМ',cover:project.id==='life'?'assets/life-cover.jpg':project.image}));
 function validImage(value){return typeof value==='string' && (/^assets\/[\w.-]+$/.test(value)||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value));}
 function validate(list){
  if(!Array.isArray(list)||!list.length||list.length>100)throw Error('В файле должно быть от 1 до 100 проектов.');
  return list.map((p,i)=>{
   if(!p||typeof p.title!=='string'||!p.title.trim()||!validImage(p.image)||!validImage(p.cover||p.image))throw Error('Проверь название и изображения проекта '+(i+1)+'.');
   const url=typeof p.url==='string'?p.url:'';
   if(url&&!/^https?:\/\//i.test(url))throw Error('Ссылка должна начинаться с https:// или http://.');
   return {id:String(p.id||'project-'+i),title:p.title.slice(0,80),status:String(p.status||'МОЙ ПРОЕКТ').slice(0,120),description:String(p.description||'').slice(0,2000),detail:String(p.detail||p.description||'').slice(0,4000),image:p.image,cover:p.cover||p.image,alt:p.title,url,link:'Открыть проект ↗',category:String(p.category||'МОЙ ПРОЕКТ').slice(0,50)};
  });
 }
 function setProjects(list){projectData.splice(0,projectData.length,...list);rebuild();}
 function persist(list){localStorage.setItem(storageKey,JSON.stringify(list));setProjects(list);}
 function rebuild(){
  const stage=document.querySelector('.folder-stage');
  stage.querySelectorAll('.project-folder').forEach(folder=>folder.remove());
  projectData.forEach((project,index)=>{
   const folder=document.createElement('button');folder.className='project-folder';folder.type='button';folder.dataset.project=project.id;
   const tab=document.createElement('span');tab.className='folder-tab';tab.textContent=String(index+1).padStart(2,'0')+' / '+(project.category||'МОЙ ПРОЕКТ');
   const art=document.createElement('span');art.className='folder-art';const image=document.createElement('img');image.src=project.cover||project.image;image.alt=project.title;art.append(image);
   const label=document.createElement('span');label.className='folder-label';const title=document.createElement('b');title.textContent=project.title;const caption=document.createElement('span');caption.textContent=project.status;label.append(title,caption);
   const open=document.createElement('span');open.className='folder-open';open.textContent='Открыть папку ↗';folder.append(tab,art,label,open);stage.append(folder);
   folder.addEventListener('click',()=>selectProject(index));
  });
  stage.querySelector('.future-folder').hidden=projectData.length>2;
  document.querySelector('#projects .count').textContent=String(projectData.length).padStart(2,'0');
  selectProject(Math.min(selectedProject,projectData.length-1));
 }
 let saved;
 try{saved=localStorage.getItem(storageKey);setProjects(saved?validate(JSON.parse(saved)):defaults);}catch{setProjects(defaults);}
 const link=document.createElement('a');
 link.className='github-projects-link';
 link.href='https://github.com/kartaamigo?tab=repositories';
 link.target='_blank';link.rel='noopener';
 link.textContent='Больше проектов на GitHub ↗';
 document.querySelector('.selected-project').after(link);
})();
