// Karmel+ Site Updater
// تحديث محتوى الموقع الأساسي فقط (وليس لوحة التحكم) من LocalStorage
(function() {
  const STORAGE_KEY = 'karmelSiteData';
  const UPDATE_SIGNAL_KEY = 'forceUpdate';

  function isDashboard() {
    return !!document.querySelector('.dashboard-main');
  }

  function readSiteData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  function clearChildren(el) { if (!el) return; while (el.firstChild) el.removeChild(el.firstChild); }
  function normalizeSrc(src) { return src ? src.replace(/^\.\.\//,'') : src; }

  function getDefaultPartners() {
    return [
      { name: '019', type: 'شركة اتصالات', image: 'i1.png', featured: true },
      { name: 'Hallo 015', type: 'شركة اتصالات', image: 'i2.png', featured: true },
      { name: 'Tranzilla', type: 'بوابة دفع', image: 'i3.png', featured: true },
      { name: 'freeRadius', type: 'سيرفر راديوس', image: 'i4.png', featured: true },
      { name: 'ريووحيت online', type: 'برنامج محاسبة', image: 'i5.png', featured: true },
      { name: 'Priority', type: 'برنامج ERP', image: 'i6.png', featured: true },
      { name: 'Golan', type: 'شركة اتصالات', image: 'i7.png' },
      { name: 'Cellcom', type: 'شركة اتصالات', image: 'i8.png' },
      { name: 'We4g', type: 'شركة اتصالات', image: 'i9.png' },
      { name: 'Pelephone', type: 'شركة اتصالات', image: 'i10.png' },
      { name: 'Partner', type: 'شركة اتصالات', image: 'i11.png' },
      { name: 'Hot', type: 'شركة اتصالات', image: 'i12.png' },
      { name: 'OpenOLT', type: 'واجهة OLT', image: 'i13.png' }
    ];
  }
  function mergeDefaultPartners(list) {
    const existing = Array.isArray(list) ? list : [];
    const byName = new Set(existing.map(p => (p && p.name) ? p.name : ''));
    const result = existing.slice();
    getDefaultPartners().forEach(p => { if (!byName.has(p.name)) result.push(p); });
    return result;
  }

  // ===== تحديث أقسام الموقع الأساسي فقط =====
  function updateHero(data) {
    if (!data?.hero) return;
    if (!document.querySelector('section#home')) return;
    const titleEl = document.querySelector('.hero-main-title');
    const descEl = document.querySelector('.hero-main-desc');
    const btnEl = document.querySelector('.hero-start-btn');
    const imgEl = document.querySelector('.hero-side-img');
    if (titleEl && data.hero.title) titleEl.textContent = data.hero.title;
    if (descEl && data.hero.desc1) descEl.textContent = data.hero.desc1;
    if (btnEl && data.hero.button) btnEl.textContent = data.hero.button;
    if (imgEl && data.hero.image) imgEl.src = normalizeSrc(data.hero.image);
  }

  function updateAbout(data) {
    if (!data?.about) return;
    const aboutSection = document.querySelector('section.about-modern-section');
    if (!aboutSection) return;

    // عنوان القسم: إزالة "كرمل+" إذا طُلب ذلك (نضع النص الفارغ ونخفيه)
    const accentEl = aboutSection.querySelector('.about-section-title .title-accent');
    if (accentEl) {
      accentEl.textContent = '';
      accentEl.style.display = 'none';
    }
    // تحديث نص العنوان من لوحة التحكم
    const titleTextEl = aboutSection.querySelector('.about-section-title .title-text');
    if (titleTextEl) {
      if (data.about.title && data.about.title.trim().length > 0) {
        titleTextEl.textContent = data.about.title.trim();
      } else {
        // إن لم يكن هناك عنوان نُخفي العنوان بالكامل
        const header = aboutSection.querySelector('.about-header') || titleTextEl.closest('.about-header');
        if (header) header.style.display = 'none';
      }
    }

    // المحتوى: نوحّد الفقرات ونمنع التكرار
    const wrapper = aboutSection.querySelector('.about-text-wrapper') || aboutSection;
    const oldParas = wrapper.querySelectorAll('.about-description');
    oldParas.forEach(p => p.remove());

    const newPara = document.createElement('p');
    newPara.className = 'about-description';
    newPara.textContent = data.about.description || '';
    wrapper.appendChild(newPara);
  }

  function updateServices(data) {
    if (!Array.isArray(data?.services)) return;
    const servicesSection = document.querySelector('section.services-modern-wave');
    if (!servicesSection) return;
    const scroll = servicesSection.querySelector('#servicesScroll');
    if (!scroll) return;
    clearChildren(scroll);
    data.services.forEach(service => {
      const isFA = typeof service.icon === 'string' && service.icon.startsWith('fas ');
      const iconHTML = isFA ? `<i class="${service.icon}"></i>` : `${service.icon || ''}`;
      const item = document.createElement('div');
      item.className = 'service-modern-item';
      item.innerHTML = `
        <div class="service-modern-circle"><span>${iconHTML}</span></div>
        <div class="service-modern-label">${service.name || ''}</div>
      `;
      scroll.appendChild(item);
    });
  }

  function updatePartners(data) {
    const partnersSection = document.querySelector('section.partners-strip-section');
    if (!partnersSection) return;
    const track = partnersSection.querySelector('.partners-strip-track');
    if (!track) return;
    const partners = mergeDefaultPartners(data?.partners);
    clearChildren(track);
    const repeats = 3;
    for (let r = 0; r < repeats; r++) {
      partners.forEach(p => {
        const card = document.createElement('div');
        card.className = 'partner-card' + (p.featured ? ' featured' : '');
        const showBadge = p.featured && r === 0;
        card.innerHTML = `
          ${showBadge ? '<div class="badge-featured">شريك مميز</div>' : ''}
          <img src="${normalizeSrc(p.image) || ''}" alt="${p.name || ''}" class="partner-card-logo" loading="lazy">
          <div class="partner-card-name">${p.name || ''}</div>
          <div class="partner-card-type">${p.type || ''}</div>
        `;
        track.appendChild(card);
      });
    }
  }

  function renderStars(count) { const n = Math.max(0, Math.min(5, parseInt(count || 0))); return new Array(n).fill('<i class="fas fa-star"></i>').join(''); }

  function updateFeedback(data) {
    if (!Array.isArray(data?.feedback)) return;
    const feedbackSection = document.querySelector('section.feedback-section');
    if (!feedbackSection) return;
    const grid = feedbackSection.querySelector('.feedback-grid');
    if (!grid) return;
    clearChildren(grid);
    data.feedback.forEach(item => {
      const card = document.createElement('div');
      card.className = 'feedback-card';
      card.innerHTML = `
        <div class="feedback-image"><img src="${normalizeSrc(item.image) || ''}" alt="${item.name || ''}" class="customer-image"></div>
        <div class="feedback-content">
          <h3 class="customer-name">${item.name || ''}</h3>
          <p class="feedback-text">"${item.text || ''}"</p>
          <div class="feedback-rating">${renderStars(item.rating)}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function updateFAQ(data) {
    if (!Array.isArray(data?.faq)) return;
    const faqSection = document.querySelector('section.faq-section');
    if (!faqSection) return;
    const grid = faqSection.querySelector('.faq-grid');
    if (!grid) return;
    clearChildren(grid);
    data.faq.forEach(qa => {
      const item = document.createElement('div');
      item.className = 'faq-item';
      item.innerHTML = `
        <div class="faq-question"><h3><span class="ar">${qa.question || ''}</span></h3><i class="fas fa-chevron-down"></i></div>
        <div class="faq-answer"><p><span class="ar">${qa.answer || ''}</span></p></div>
      `;
      grid.appendChild(item);
    });

    // اربط سلوك الفتح/الإغلاق للأسئلة بعد البناء
    const items = grid.querySelectorAll('.faq-item');
    items.forEach(item => {
      const q = item.querySelector('.faq-question');
      const a = item.querySelector('.faq-answer');
      if (!q || !a) return;
      a.style.maxHeight = '0';
      q.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // اغلق الجميع
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const oa = other.querySelector('.faq-answer');
            if (oa) oa.style.maxHeight = '0';
          }
        });
        // بدّل الحالي
        if (isActive) {
          item.classList.remove('active');
          a.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  function updateWhyKarmel(data) {
    const cards = data?.whyKarmel?.cards;
    if (!Array.isArray(cards)) return;
    const why = document.querySelector('section.why-karmel-section');
    if (!why) return;
    const grid = why.querySelector('.why-karmel-grid');
    if (!grid) return;
    clearChildren(grid);
    cards.forEach(card => {
      const div = document.createElement('div');
      div.className = 'why-karmel-card';
      div.innerHTML = `
        <div class="why-karmel-icon">${card.icon && card.icon.startsWith('fas') ? `<i class="${card.icon}"></i>` : '<i class="fas fa-star"></i>'}<div class="icon-glow"></div></div>
        <h3 class="why-karmel-title"><span class="ar">${card.title || ''}</span></h3>
        <p class="why-karmel-desc"><span class="ar">${card.desc || ''}</span></p>
        <div class="why-karmel-stats"><div class="stat-item"><span class="stat-number">${card.stat || ''}</span><span class="stat-label">${card.statText || ''}</span></div></div>
      `;
      grid.appendChild(div);
    });
  }

  function updateContact(data) {
    if (!data?.contact) return;
    const phoneEl = document.querySelector('.contact-phone');
    const emailEl = document.querySelector('.contact-email');
    const addrEl = document.querySelector('.contact-address');
    const mapEl = document.querySelector('.contact-map-iframe');
    if (phoneEl && data.contact.phone) phoneEl.textContent = data.contact.phone;
    if (emailEl && data.contact.email) { emailEl.textContent = data.contact.email; emailEl.setAttribute('href', `mailto:${data.contact.email}`); }
    if (addrEl && data.contact.address) addrEl.textContent = data.contact.address;
    if (mapEl && data.contact.map) mapEl.src = data.contact.map;
    const footerMap = document.querySelector('.footer-simple-map iframe');
    if (footerMap && data.contact.map) footerMap.src = data.contact.map;
  }

  function updatePolicies(data) {
    if (!data?.policies) return;
    const privacyBody = document.querySelector('#privacyModal .policy-content');
    const termsBody = document.querySelector('#termsModal .policy-content');
    if (privacyBody && data.policies.privacy) {
      const p = data.policies.privacy;
      privacyBody.innerHTML = `
        <h4><span class="ar">${p.title || 'سياسة الخصوصية'}</span></h4>
        <p><span class="ar">${(p.intro || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">المعلومات التي نجمعها</span></h4>
        <p><span class="ar">${(p.infoCollected || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">كيفية استخدام المعلومات</span></h4>
        <p><span class="ar">${(p.infoUsage || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">حماية المعلومات</span></h4>
        <p><span class="ar">${(p.protection || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">مشاركة المعلومات</span></h4>
        <p><span class="ar">${(p.sharing || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">حقوقك</span></h4>
        <p><span class="ar">${(p.rights || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">التحديثات</span></h4>
        <p><span class="ar">${(p.updates || '').replaceAll('\n','<br>')}</span></p>
      `;
    }
    if (termsBody && data.policies.terms) {
      const t = data.policies.terms;
      termsBody.innerHTML = `
        <h4><span class="ar">${t.title || 'الشروط والأحكام'}</span></h4>
        <p><span class="ar">${(t.acceptance || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">الخدمات المقدمة</span></h4>
        <p><span class="ar">${(t.services || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">التزاماتنا</span></h4>
        <p><span class="ar">${(t.commitments || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">المدفوعات والرسوم</span></h4>
        <p><span class="ar">${(t.payments || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">الملكية الفكرية</span></h4>
        <p><span class="ar">${(t.intellectual || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">السرية وحماية البيانات</span></h4>
        <p><span class="ar">${(t.confidentiality || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">المسؤولية والضمانات</span></h4>
        <p><span class="ar">${(t.liability || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">إنهاء الخدمة</span></h4>
        <p><span class="ar">${(t.termination || '').replaceAll('\n','<br>')}</span></p>
        <h4><span class="ar">القانون المطبق وحل النزاعات</span></h4>
        <p><span class="ar">${(t.law || '').replaceAll('\n','<br>')}</span></p>
      `;
    }
  }

  function updateAll() {
    if (isDashboard()) return; // لا نحدث لوحة التحكم
    const data = readSiteData();
    if (!data) return;
    updateHero(data); updateAbout(data); updateServices(data); updatePartners(data);
    updateFeedback(data); updateFAQ(data); updateWhyKarmel(data); updateContact(data); updatePolicies(data);
    // تأكيد نقاط الربط للأقسام وروابط العمق
    ensureAnchors();
    handleDeepLinks();
  }

  window.addEventListener('storage', function(e){ if (e.key === STORAGE_KEY || e.key === UPDATE_SIGNAL_KEY) updateAll(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateAll); else updateAll();
  // الاستماع لتغيير الهاش في العنوان
  window.addEventListener('hashchange', handleDeepLinks);
  let lastTs = null; setInterval(() => { try { const ts = localStorage.getItem('lastSiteUpdate'); if (ts && ts !== lastTs) { lastTs = ts; updateAll(); } } catch(_){} }, 1000);
})();

// إنشاء نقاط ربط للأقسام المطلوبة والتعامل مع الروابط العميقة
function ensureAnchors() {
  try {
    const whySection = document.querySelector('section.why-karmel-section');
    if (whySection && !whySection.id) {
      whySection.id = 'why-karmel';
    }
    // نقطة ربط عامة للسياسات ليتعامل معها الرابط index.html#policies
    if (!document.getElementById('policies')) {
      const anchor = document.createElement('div');
      anchor.id = 'policies';
      anchor.style.position = 'relative';
      anchor.style.top = '-1px';
      document.body.insertBefore(anchor, document.body.firstChild);
    }
  } catch(_) {}
}

function handleDeepLinks() {
  try {
    const hash = (window.location.hash || '').trim();
    if (!hash) return;
    if (hash === '#why-karmel') {
      const target = document.getElementById('why-karmel') || document.querySelector('.why-karmel-section');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (hash === '#policies' || hash === '#privacy') {
      const link = document.getElementById('privacyPolicyLink');
      if (link) link.click();
    } else if (hash === '#terms') {
      const link = document.getElementById('termsLink');
      if (link) link.click();
    }
  } catch(_) {}
}


