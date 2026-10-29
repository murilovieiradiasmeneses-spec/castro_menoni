document.documentElement.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const portal = document.querySelector('.portal');
let ticking = false;
function updateScroll(){const range=Math.max(1,portal.offsetHeight-innerHeight);const progress=Math.max(0,Math.min(1,scrollY/range));document.documentElement.style.setProperty('--progress',reduced.matches?0:progress);ticking=false;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}},{passive:true});
addEventListener('resize',updateScroll);updateScroll();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const menu=document.querySelector('.menu'),nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const privacy=document.querySelector('#privacy');document.querySelector('#privacy-open').addEventListener('click',()=>privacy.showModal());privacy.querySelector('.close').addEventListener('click',()=>privacy.close());privacy.addEventListener('click',e=>{if(e.target===privacy){const r=privacy.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)privacy.close();}});
document.querySelector('#year').textContent=new Date().getFullYear();
const areaDescriptions={
 'Família e Sucessões':'Atendimento em questões relacionadas à família e à sucessão patrimonial, com atenção às pessoas envolvidas e às particularidades de cada história.',
 'Criminal':'Atuação em demandas da esfera criminal, com análise individualizada e atenção à defesa dos direitos e das garantias da pessoa atendida.',
 'Consumidor':'Atendimento em conflitos nas relações de consumo, envolvendo produtos, serviços e a relação entre consumidores e fornecedores.',
 'Civil':'Atuação em questões de Direito Civil, incluindo relações privadas, contratos, responsabilidades e assuntos patrimoniais.',
 'Previdenciário':'Orientação em questões relacionadas à Previdência Social, mediante análise da situação e dos documentos de cada pessoa.',
 'Trabalhista':'Atendimento em demandas ligadas às relações de trabalho, com avaliação das circunstâncias e das informações apresentadas.'
};
const areaDialog=document.querySelector('#area-dialog');
document.querySelectorAll('[data-area]').forEach(button=>button.addEventListener('click',()=>{const area=button.dataset.area;document.querySelector('#area-title').textContent=area==='Família e Sucessões'?'Família e Sucessões':'Direito '+(area==='Consumidor'?'do Consumidor':area);document.querySelector('#area-description').textContent=areaDescriptions[area];document.querySelector('#subject').value=area;areaDialog.showModal();}));
areaDialog.querySelector('.close').addEventListener('click',()=>areaDialog.close());
document.querySelector('#area-contact').addEventListener('click',()=>areaDialog.close());
areaDialog.addEventListener('click',e=>{if(e.target===areaDialog){const r=areaDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)areaDialog.close();}});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const name=document.querySelector('#name').value.trim(),subject=document.querySelector('#subject').value;document.querySelector('#message').value='Olá, Castro & Menoni! '+(name?'Meu nome é '+name+'. ':'')+'Gostaria de conversar sobre '+subject+' e saber como funciona o atendimento. Podemos agendar uma conversa?';document.querySelector('#message-result').hidden=false;document.querySelector('#copy-status').textContent='Mensagem preparada. Você pode copiá-la abaixo.';});
document.querySelector('#copy-message').addEventListener('click',async()=>{const field=document.querySelector('#message');try{await navigator.clipboard.writeText(field.value);document.querySelector('#copy-status').textContent='Mensagem copiada!';}catch{field.focus();field.select();document.querySelector('#copy-status').textContent='Selecione e copie a mensagem acima.';}});
