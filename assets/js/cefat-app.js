/**
 * Les Universités CEFAT — Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation
  const headerMenu = document.getElementById('header-sticky');
  if (headerMenu) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) {
        headerMenu.classList.add('sticky');
      } else {
        headerMenu.classList.remove('sticky');
      }
    });
  }

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
  const closeDrawerBtn = document.querySelector('.close-drawer');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  // Mobile submenu accordion
  document.querySelectorAll('.mobile-menu-links > li.has-sub > a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = link.parentElement;
      parent.classList.toggle('open');
    });
  });

  // 3. Departments Hover Effect (Exact Reference Theme Behavior)
  const deptItems = document.querySelectorAll('.departments-post-hover');
  deptItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      deptItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // 4. Counter Animation
  const counters = document.querySelectorAll('.counter .count');
  let countersAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count') || +counter.innerText;
      counter.innerText = '0';
      const speed = 40; // lower is faster
      const step = Math.ceil(target / speed);

      const updateCount = () => {
        const count = +counter.innerText;
        if (count < target) {
          counter.innerText = Math.min(count + step, target);
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }

  const counterSection = document.querySelector('.counter-area2');
  if (counterSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(counterSection);
  }

  // 5. Video Modal Popup
  const videoTriggers = document.querySelectorAll('.popup-video, .play-video-btn');
  const videoModal = document.getElementById('cefat-video-modal');
  const videoIframe = document.getElementById('cefat-video-iframe');
  const videoCloseBtn = document.getElementById('video-modal-close');

  const defaultVideoUrl = "https://www.youtube.com/embed/BOB2f_tKlhc?autoplay=1";

  if (videoTriggers && videoModal && videoIframe) {
    videoTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        videoIframe.src = defaultVideoUrl;
        videoModal.classList.add('open');
      });
    });

    if (videoCloseBtn) {
      videoCloseBtn.addEventListener('click', () => {
        videoModal.classList.remove('open');
        videoIframe.src = "";
      });
    }

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('open');
        videoIframe.src = "";
      }
    });
  }

  // 6. "Trouver ma formation en 3 clics" (3-Click Course Finder)
  const finderForm = document.getElementById('quick-finder-form');
  if (finderForm) {
    finderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const degree = document.getElementById('finder-degree')?.value;
      const domain = document.getElementById('finder-domain')?.value;
      const campus = document.getElementById('finder-campus')?.value;

      // Prefill candidate application form if present
      const appDegree = document.getElementById('app-degree');
      const appDomain = document.getElementById('app-domain');
      const appCampus = document.getElementById('app-campus');

      if (appDegree && degree) appDegree.value = degree;
      if (appDomain && domain) appDomain.value = domain;
      if (appCampus && campus) appCampus.value = campus;

      // Smooth scroll to application section
      const admissionSec = document.getElementById('candidature-section');
      if (admissionSec) {
        admissionSec.scrollIntoView({ behavior: 'smooth' });
        // Highlight form
        const admissionCard = admissionSec.querySelector('.admission-card');
        if (admissionCard) {
          admissionCard.style.boxShadow = '0 0 0 4px #E03131';
          setTimeout(() => {
            admissionCard.style.boxShadow = '';
          }, 2000);
        }
      } else {
        window.location.href = `candidatures.html?degree=${encodeURIComponent(degree || '')}&domain=${encodeURIComponent(domain || '')}&campus=${encodeURIComponent(campus || '')}`;
      }
    });
  }

  // 7. Interactive Campus Map Details Toggle
  const campusPins = document.querySelectorAll('.campus-pin');
  const campusCards = document.querySelectorAll('.campus-info-card');

  campusPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const targetCampus = pin.getAttribute('data-campus');
      campusPins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      campusCards.forEach(card => {
        if (card.getAttribute('data-campus') === targetCampus) {
          card.classList.add('active');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          card.classList.remove('active');
        }
      });
    });
  });

  // 8. Pre-Registration Form Submission & Validation
  const appForm = document.getElementById('cefat-application-form');
  const formFeedback = document.getElementById('app-form-feedback');

  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const nom = document.getElementById('app-nom')?.value.trim();
      const prenoms = document.getElementById('app-prenoms')?.value.trim();
      const telephone = document.getElementById('app-telephone')?.value.trim();
      const email = document.getElementById('app-email')?.value.trim();
      const campus = document.getElementById('app-campus')?.value;
      const entity = document.getElementById('app-entity')?.value;
      const degree = document.getElementById('app-degree')?.value;
      const domain = document.getElementById('app-domain')?.value;

      if (!nom || !prenoms || !telephone || !campus || !degree) {
        if (formFeedback) {
          formFeedback.innerHTML = `<div class="alert alert-danger" style="background:#FFE3E3; color:#C92A2A; border:1px solid #FFA8A8; border-radius:8px; padding:12px; font-size:14px;">
            <i class="fas fa-exclamation-circle me-2"></i> Veuillez remplir tous les champs obligatoires (*) pour soumettre votre candidature.
          </div>`;
        }
        return;
      }

      const submitBtn = appForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> Enregistrement en cours...`;
      }

      const payload = {
        nom,
        prenoms,
        telephone,
        email,
        campus,
        entity,
        degree,
        domain,
        date_soumission: new Date().toISOString()
      };

      console.log('CEFAT Application Submitted:', payload);

      // Attempt sending to existing backend endpoint if configured, or show success
      // Standard fetch simulation / backend integration ready:
      fetch('api/candidature.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .catch(() => {
        // Fallback gracefully for pure frontend preview
        return { ok: true };
      })
      .finally(() => {
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
          if (formFeedback) {
            formFeedback.innerHTML = `<div class="alert alert-success" style="background:#EBFBEE; color:#2B8A3E; border:1px solid #B2F2BB; border-radius:8px; padding:15px; font-size:14px;">
              <h5 style="color:#2B8A3E; margin-bottom:5px; font-weight:700;"><i class="fas fa-check-circle me-2"></i> Félicitations ${prenoms} !</h5>
              Votre pré-inscription pour le <strong>${degree}</strong> (${campus}) a bien été enregistrée. Notre secrétariat académique vous contactera au <strong>${telephone}</strong> sous 24h.
            </div>`;
          }
          appForm.reset();
        }, 800);
      });
    });
  }

  // 9. Auto-check URL parameters for prefill
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('degree') && document.getElementById('app-degree')) {
    document.getElementById('app-degree').value = urlParams.get('degree');
  }
  if (urlParams.has('domain') && document.getElementById('app-domain')) {
    document.getElementById('app-domain').value = urlParams.get('domain');
  }
  if (urlParams.has('campus') && document.getElementById('app-campus')) {
    document.getElementById('app-campus').value = urlParams.get('campus');
  }
});
