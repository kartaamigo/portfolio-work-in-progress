const links=[...document.querySelectorAll('[data-section]')];
const sectionNames={home:'Обзор',space:'Пространство',philosophy:'Философия',projects:'Проекты','life-detail':'RE:FORM LIFE',process:'Процесс',journey:'Этапы создания',ai:'Человек + ИИ',principles:'Принципы',faq:'О Reform',contact:'На связи'};
const sections=[...document.querySelectorAll('main>section')];
function updateNavigation(){let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=(window.reformViewportTop||0)+150)current=section;}links.forEach(link=>{const active=link.dataset.section===(current.dataset.nav||current.id);link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});document.querySelector('.breadcrumb b').textContent='/ '+sectionNames[current.id];document.body.classList.toggle('workspace-visible',document.querySelector('#workspace').getBoundingClientRect().top<window.innerHeight*.6);}
let pending=false;window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{updateNavigation();pending=false;});}},{passive:true});updateNavigation();

const projectData=[
 {id:'life',title:'RE:FORM LIFE',status:'ДЕМО-ВЕРСИЯ · ДИЗАЙН ИНТЕРФЕЙСА',description:'Задачи, привычки и месячный планер с ассистентом EVE.',image:'assets/life.png',alt:'Макет месячного планера RE:FORM LIFE',detail:'Проект приложения для задач, привычек и месячного планирования с ассистентом EVE.',url:'https://www.behance.net/gallery/256292513/Demo-version-of-the-project-RE-FORM-LIFE',link:'Работа на Behance ↗'},
 {id:'blaze',title:'Blaze',status:'WINDOWS · ПРОТОТИП В РАЗРАБОТКЕ',description:'Виджеты, заметки, таймер фокуса и учёт активности.',image:'assets/blaze.png',alt:'Авторский дизайн-концепт Blaze, не снимок текущей сборки',detail:'Проект приложения для Windows: виджеты, заметки, таймер и учёт рабочих дней. Здесь показан дизайн интерфейса. Прототип находится в разработке.',url:'https://github.com/kartaamigo/Blaze',link:'Проект на GitHub ↗'}
];
let selectedProject=0;
const dialog=document.querySelector('#project-dialog');
function selectProject(index){
 selectedProject=(index+projectData.length)%projectData.length;
 const project=projectData[selectedProject];
 document.querySelectorAll('.folder-stage .project-folder').forEach((folder,i)=>{const active=i===selectedProject;const next=(selectedProject+1)%projectData.length;const previous=(selectedProject-1+projectData.length)%projectData.length;folder.hidden=!(active||i===next||i===previous);folder.classList.toggle('is-active',active);folder.style.setProperty('--position',active?0:i===next?1:-1);folder.setAttribute('aria-pressed',String(active));folder.setAttribute('aria-label','Открыть папку '+projectData[i].title);});
 document.querySelector('#selected-title').textContent=project.title;
 document.querySelector('#selected-status').textContent=project.status;
 document.querySelector('#selected-description').textContent=project.description;
 document.querySelector('.gallery-counter').textContent=String(selectedProject+1).padStart(2,'0')+' / '+String(projectData.length).padStart(2,'0');
 window.dispatchEvent(new CustomEvent('project-selected',{detail:project}));
}
function openProject(index=selectedProject){
 const project=projectData[index];
 dialog.querySelector('h2').textContent=project.title;
 dialog.querySelector('p').textContent=project.detail;
 const image=dialog.querySelector('img');image.src=project.image;image.alt=project.alt;
 dialog.querySelector('.dialog-actions>span').textContent=project.status;
 const link=dialog.querySelector('.dialog-actions a');link.hidden=!project.url;link.href=project.url||"#";link.textContent=project.link||"Открыть проект ↗";
 dialog.showModal();
}
document.querySelectorAll('.folder-stage .project-folder').forEach((folder,index)=>folder.addEventListener('click',()=>{selectProject(index);}));
document.querySelectorAll('[data-gallery-step]').forEach(button=>button.addEventListener('click',()=>selectProject(selectedProject+Number(button.dataset.galleryStep))));
document.querySelector('.project-library').addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();selectProject(selectedProject+(event.key==='ArrowRight'?1:-1));}});
document.querySelector('#open-project').addEventListener('click',()=>openProject());
document.querySelectorAll('[data-open-project]').forEach(button=>button.addEventListener('click',()=>openProject(selectedProject)));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
