(function(){
  const contentUrl = 'assets/content.json';
  const toggle = document.querySelector('.mobile-toggle');
  if(toggle){ toggle.addEventListener('click', ()=>{ const links = document.querySelector('.nav-links'); if(links){ const visible = links.style.display === 'flex'; links.style.display = visible ? 'none' : 'flex'; } }); }
  fetch(contentUrl).then(r=>r.json()).then(data=>{
    const phoneEls = document.querySelectorAll('[data-bind="phone"]');
    phoneEls.forEach(el => { el.textContent = data.site.phone; el.href && (el.href = 'tel:' + data.site.phone.replace(/\s/g,'')); });
    const emailEls = document.querySelectorAll('[data-bind="email"]');
    emailEls.forEach(el => { el.textContent = data.site.email; el.href && (el.href = 'mailto:' + data.site.email); });
    const hHeadline = document.querySelector('[data-bind="hero.headline"]'); if(hHeadline) hHeadline.textContent = data.hero.headline;
    const hSub = document.querySelector('[data-bind="site.subtagline"]'); if(hSub) hSub.textContent = data.site.subtagline;
    const cta1 = document.querySelector('[data-bind="hero.cta_primary"]'); if(cta1) cta1.textContent = data.hero.cta_primary;
    const cta2 = document.querySelector('[data-bind="hero.cta_secondary"]'); if(cta2) cta2.textContent = data.hero.cta_secondary;
    const mission = document.querySelector('[data-bind="mission"]'); if(mission) mission.textContent = data.mission;
    const svcContainer = document.getElementById('services-cards');
    if(svcContainer && data.services){ svcContainer.innerHTML = ''; data.services.forEach(svc => { const card = document.createElement('article'); card.className = 'card'; card.innerHTML = `<div aria-hidden="true">${serviceIconSVG(svc.key)}</div><h3>${svc.title}</h3><p>${svc.desc}</p><ul>${(svc.benefits||[]).map(b=>`<li>${b}</li>`).join('')}</ul>`; svcContainer.appendChild(card); }); }
    const tCont = document.getElementById('testimonials'); if(tCont && data.testimonials){ tCont.innerHTML = ''; data.testimonials.forEach(t => { const el = document.createElement('blockquote'); el.className = 'testimonial'; el.innerHTML = `<p>“${t.quote}”</p><footer>— ${t.author}, ${t.role}</footer>`; tCont.appendChild(el); }); }
    const addr = document.querySelector('[data-bind="site.office_footer"]'); if(addr) addr.textContent = data.site.office_footer;
    const social = data.social || {}; const sMap = { linkedin:'#social-linkedin', twitter:'#social-twitter', github:'#social-github' };
    Object.keys(sMap).forEach(k=>{ const el = document.querySelector(sMap[k]); if(el && social[k]) el.href = social[k]; });
  }).catch(()=>{});
  document.querySelectorAll('form[data-validate]')?.forEach(form => {
    form.addEventListener('submit', (e)=>{ e.preventDefault(); const valid = form.checkValidity(); if(!valid){ form.reportValidity(); return; } const msg = form.querySelector('.form-message'); if(msg){ msg.textContent = 'Thank you! Your request has been received.'; msg.style.color = 'green'; } });
  });
})();
function serviceIconSVG(key){ return '<svg viewBox="0 0 48 48" role="img" aria-label="icon"><rect x="6" y="8" width="36" height="24" rx="4" fill="#0B5FFF" opacity="0.12"/></svg>'; }
