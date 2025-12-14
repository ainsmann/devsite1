
// Main JS – content loader, nav, forms, analytics consent
(function(){
  const contentUrl = '/assets/content.json';

  // Mobile nav toggle
  const toggle = document.querySelector('.mobile-toggle');
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const links = document.querySelector('.nav-links');
      if(links){
        const visible = links.style.display === 'flex';
        links.style.display = visible ? 'none' : 'flex';
      }
    });
  }

  // Load editable content
  fetch(contentUrl).then(r=>r.json()).then(data=>{
    // Phone
    const phoneEls = document.querySelectorAll('[data-bind="phone"]');
    phoneEls.forEach(el => { el.textContent = data.site.phone; el.href && (el.href = 'tel:' + data.site.phone.replace(/\s/g,'')); });

    // Email
    const emailEls = document.querySelectorAll('[data-bind="email"]');
    emailEls.forEach(el => { el.textContent = data.site.email; el.href && (el.href = 'mailto:' + data.site.email); });

    // Hero text
    const hHeadline = document.querySelector('[data-bind="hero.headline"]');
    if(hHeadline) hHeadline.textContent = data.hero.headline;

    const hSub = document.querySelector('[data-bind="site.subtagline"]');
    if(hSub) hSub.textContent = data.site.subtagline;

    const cta1 = document.querySelector('[data-bind="hero.cta_primary"]');
    if(cta1) cta1.textContent = data.hero.cta_primary;

    const cta2 = document.querySelector('[data-bind="hero.cta_secondary"]');
    if(cta2) cta2.textContent = data.hero.cta_secondary;

    const mission = document.querySelector('[data-bind="mission"]');
    if(mission) mission.textContent = data.mission;

    // Services
    const svcContainer = document.getElementById('services-cards');
    if(svcContainer && data.services){
      svcContainer.innerHTML = '';
      data.services.forEach(svc => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <div aria-hidden="true">${serviceIconSVG(svc.key)}</div>
          <h3>${svc.title}</h3>
          <p>${svc.desc}</p>
          <ul>${(svc.benefits||[]).map(b=>`<li>${b}</li>`).join('')}</ul>
        `;
        svcContainer.appendChild(card);
      });
    }

    // Testimonials
    const tCont = document.getElementById('testimonials');
    if(tCont && data.testimonials){
      tCont.innerHTML = '';
      data.testimonials.forEach(t => {
        const el = document.createElement('blockquote');
        el.className = 'testimonial';
        el.innerHTML = `<p>“${t.quote}”</p><footer>— ${t.author}, ${t.role}</footer>`;
        tCont.appendChild(el);
      });
    }

    // Footer address
    const addr = document.querySelector('[data-bind="site.office_footer"]');
    if(addr) addr.textContent = data.site.office_footer;

    // Social links
    const social = data.social || {};
    const sMap = { linkedin:'#social-linkedin', twitter:'#social-twitter', github:'#social-github' };
    Object.keys(sMap).forEach(k=>{
      const el = document.querySelector(sMap[k]);
      if(el && social[k]) el.href = social[k];
    });

    // Analytics (respect consent)
    initAnalytics(data.site.ga_measurement_id, data.site.domain);
  }).catch(()=>{});

  // Simple form validation + demo submission
  document.querySelectorAll('form[data-validate]')?.forEach(form => {
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const valid = form.checkValidity();
      if(!valid){ form.reportValidity(); return; }
      // Demo: show a message; in production, replace with fetch() to your endpoint.
      const msg = form.querySelector('.form-message');
      if(msg){ msg.textContent = 'Thank you! Your request has been received.'; msg.style.color = 'green'; }
    });
  });

  // Cookie consent
  initCookieConsent();

})();

function serviceIconSVG(key){
  const base = {
    'managed-it': '<svg viewBox="0 0 48 48" role="img" aria-label="Managed IT icon"><rect x="6" y="8" width="36" height="24" rx="4" fill="#0B5FFF" opacity="0.12"/><rect x="10" y="12" width="28" height="16" rx="2" fill="#0B5FFF"/><circle cx="24" cy="36" r="4" fill="#00C389"/></svg>',
    'consultancy': '<svg viewBox="0 0 48 48" role="img" aria-label="Consultancy icon"><circle cx="24" cy="16" r="10" fill="#0B5FFF" opacity="0.12"/><path d="M14 30h20l-4 8H18z" fill="#0B5FFF"/></svg>',
    'network-security': '<svg viewBox="0 0 48 48" role="img" aria-label="Network & security icon"><rect x="8" y="10" width="32" height="20" rx="4" fill="#0B5FFF" opacity="0.12"/><path d="M16 18h16M12 30h24" stroke="#0B5FFF" stroke-width="2"/><path d="M24 30c4 0 8 3 8 6v4H16v-4c0-3 4-6 8-6z" fill="#00C389"/></svg>',
    'support': '<svg viewBox="0 0 48 48" role="img" aria-label="Support icon"><circle cx="24" cy="20" r="12" fill="#0B5FFF" opacity="0.12"/><path d="M12 20a12 12 0 0 1 24 0v10h-6l-4 6-4-6h-10z" fill="#0B5FFF"/></svg>',
    'cloud': '<svg viewBox="0 0 48 48" role="img" aria-label="Cloud icon"><path d="M18 24a8 8 0 0 1 16 0h2a6 6 0 1 1 0 12H16a6 6 0 1 1 2-12z" fill="#0B5FFF"/><circle cx="30" cy="18" r="6" fill="#0B5FFF" opacity="0.18"/></svg>',
    'backup-recovery': '<svg viewBox="0 0 48 48" role="img" aria-label="Backup & recovery icon"><circle cx="24" cy="24" r="14" fill="#0B5FFF" opacity="0.12"/><path d="M24 12v8l6 3" stroke="#0B5FFF" stroke-width="2" fill="none"/><path d="M16 28h16v6H16z" fill="#00C389"/></svg>'
  };
  return base[key] || base['managed-it'];
}

function initAnalytics(measurementId, domain){
  if(!measurementId || measurementId === 'G-XXXXXXX') return; // not configured
  try{
    const consent = localStorage.getItem('cookie-consent');
    if(consent === 'accepted'){
      // GA4 loader
      const s = document.createElement('script');
      s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', measurementId, { 'linker': { 'domains': [domain] }, 'anonymize_ip': true });
    }
  }catch(e){}
}

function initCookieConsent(){
  const banner = document.getElementById('cookie-banner');
  if(!banner) return;
  const state = localStorage.getItem('cookie-consent');
  if(!state){ banner.style.display = 'block'; }
  banner.querySelector('.accept')?.addEventListener('click', ()=>{
    localStorage.setItem('cookie-consent', 'accepted');
    banner.style.display = 'none';
    // Optionally re-init analytics
    const contentUrl = '/assets/content.json';
    fetch(contentUrl).then(r=>r.json()).then(d=> initAnalytics(d.site.ga_measurement_id, d.site.domain)).catch(()=>{});
  });
  banner.querySelector('.decline')?.addEventListener('click', ()=>{
    localStorage.setItem('cookie-consent', 'declined');
    banner.style.display = 'none';
  });
}
