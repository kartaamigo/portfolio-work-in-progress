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
 const tools=document.createElement('div');tools.className='project-tools';
 tools.innerHTML='<button type="button" data-add>+ Добавить папку</button><button type="button" data-edit>Редактировать</button><button type="button" data-export>Скачать проекты</button><label>Загрузить проекты<input type="file" accept="application/json,.json" data-import></label>';
 document.querySelector('.selected-project').after(tools);
 const note=document.createElement('p');note.className='project-save-note';note.textContent='Папки сохраняются в этом браузере. Скачай проекты, чтобы сохранить копию или перенести на другой компьютер.';tools.after(note);
 const editor=document.createElement('dialog');editor.className='project-editor';editor.setAttribute('aria-labelledby','project-editor-title');
 editor.innerHTML='<h2 id="project-editor-title">Новая папка</h2><form><label>Название<input name="title" required maxlength="80"></label><label>Категория<input name="category" maxlength="50" placeholder="Например: САЙТ / ПРИЛОЖЕНИЕ"></label><label>Подпись<input name="status" maxlength="120" placeholder="Дизайн интерфейса · 2026"></label><label>Описание<textarea name="description" maxlength="2000"></textarea></label><label>Обложка и макет<input name="image" type="file" accept="image/png,image/jpeg,image/webp"></label><img class="project-editor-preview" alt="Обложка папки" hidden><small>PNG, JPEG или WebP. Изображение будет сохранено вместе с папкой.</small><label>Ссылка на проект<input name="url" type="url" placeholder="https://..."></label><p class="project-editor-error" role="alert"></p><div class="project-editor-actions"><button type="button" data-delete hidden>Удалить папку</button><button type="button" data-cancel>Отмена</button><button type="submit">Сохранить</button></div></form>';
 document.body.append(editor);
 const form=editor.querySelector('form');const error=editor.querySelector('.project-editor-error');const preview=editor.querySelector('img');let editing=-1,image='',cover='',imagePromise=Promise.resolve();
 function show(index){
  editing=index;form.reset();error.textContent='';const p=projectData[index];image=p?.image||'';cover=p?.cover||image;
  for(const key of ['title','category','status','description','url'])form.elements[key].value=p?.[key]||'';
  editor.querySelector('h2').textContent=p?'Редактировать папку':'Новая папка';editor.querySelector('[data-delete]').hidden=!p||projectData.length===1;
  preview.hidden=!cover;if(cover)preview.src=cover;imagePromise=Promise.resolve();editor.showModal();
 }
 tools.querySelector('[data-add]').onclick=()=>show(-1);tools.querySelector('[data-edit]').onclick=()=>show(selectedProject);
 editor.querySelector('[data-cancel]').onclick=()=>editor.close();
 form.elements.image.onchange=()=>{
  const file=form.elements.image.files[0];if(!file)return;
  imagePromise=(async()=>{
   if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Выбери PNG, JPEG или WebP.');
   const bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas');const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();image=cover=canvas.toDataURL('image/webp',.88);preview.src=cover;preview.hidden=false;
  })().catch(e=>{error.textContent=e.message;throw e;});
  imagePromise.catch(()=>{});
 };
 form.onsubmit=async event=>{
  event.preventDefault();error.textContent='';
  try{
   await imagePromise;if(!image)throw Error('Добавь обложку папки.');
   const p={id:projectData[editing]?.id||'project-'+crypto.randomUUID(),title:form.elements.title.value.trim(),category:form.elements.category.value.trim(),status:form.elements.status.value.trim(),description:form.elements.description.value.trim(),detail:form.elements.description.value.trim(),image,cover,url:form.elements.url.value.trim()};
   const list=projectData.map(p=>({...p}));if(editing<0)list.push(p);else list[editing]=p;
   const validated=validate(list);localStorage.setItem(storageKey,JSON.stringify(validated));selectedProject=editing<0?validated.length-1:editing;setProjects(validated);editor.close();navigate('projects');
  }catch(e){error.textContent=e.name==='QuotaExceededError'?'Недостаточно места в браузере. Скачай проекты и используй меньшую обложку.':e.message;}
 };
 editor.querySelector('[data-delete]').onclick=()=>{
  try{persist(projectData.filter((_,i)=>i!==editing));editor.close();navigate('projects');}catch(e){error.textContent=e.message;}
 };
 tools.querySelector('[data-export]').onclick=()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(projectData,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='reform-projects.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 tools.querySelector('[data-import]').onchange=async event=>{
  try{const file=event.target.files[0];if(!file)return;const incoming=validate(JSON.parse(await file.text()));const merged=new Map(projectData.map(p=>[p.id,p]));incoming.forEach(p=>merged.set(p.id,p));persist(validate([...merged.values()]));note.textContent='Папки загружены и сохранены в этом браузере.';}catch(e){note.textContent='Не удалось загрузить проекты: '+e.message;}finally{event.target.value='';}
 };
})();
