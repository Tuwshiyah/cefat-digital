/* ============================================================
   COLLÈGE PRIVÉ CEFAT-INTER — JAVASCRIPT PRINCIPAL (GLOBAL)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Back-to-Top ---- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- 2. Mobile Menu (Hamburger) ---- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navbarMenu = document.getElementById('navbarMenu');

  if (hamburgerBtn && navbarMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      navbarMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbarMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navbarMenu.classList.remove('open');
      }
    });

    // Mobile dropdown toggle
    navbarMenu.querySelectorAll('.dropdown > a').forEach(dropdownToggle => {
      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          dropdownToggle.parentElement.classList.toggle('open');
        }
      });
    });
  }

  /* ---- 3. Hero Slider (Homepage only) ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const thumbs = document.querySelectorAll('.hero-thumb');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval = null;

    function showSlide(index) {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
      currentSlide = index;
    }

    function nextSlide() {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      let prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
      clearInterval(slideInterval);
      startAutoSlide();
    }

    if (heroNext) {
      heroNext.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    if (heroPrev) {
      heroPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.slide, 10);
        showSlide(idx);
        resetAutoSlide();
      });
    });

    startAutoSlide();
  }

  /* ---- 4. Statistics Counter (IntersectionObserver) ---- */
  const statNumbers = document.querySelectorAll('.stat-num');

  if (statNumbers.length > 0) {
    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(easeOut * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            statNumbers.forEach(num => animateCounter(num));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      const statsSection = document.querySelector('.about-section, .about-stats-grid');
      if (statsSection) observer.observe(statsSection);
    } else {
      statNumbers.forEach(num => num.textContent = num.dataset.target);
    }
  }

  /* ---- 5. FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all in this group
      faqItems.forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.faq-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
        const icon = i.querySelector('.faq-toggle-icon');
        if (icon) icon.textContent = '+';
      });

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        const icon = item.querySelector('.faq-toggle-icon');
        if (icon) icon.textContent = '−';
      }
    });
  });

  /* ---- 6. Testimonials Slider ---- */
  const testiDots = document.querySelectorAll('.testi-dot');
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');

  if (testiDots.length > 0) {
    let currentTesti = 0;

    function updateTestimonial(index) {
      testiDots.forEach((d, i) => d.classList.toggle('active', i === index));
      currentTesti = index;
    }

    if (testiNext) {
      testiNext.addEventListener('click', () => {
        let next = (currentTesti + 1) % testiDots.length;
        updateTestimonial(next);
      });
    }

    if (testiPrev) {
      testiPrev.addEventListener('click', () => {
        let prev = (currentTesti - 1 + testiDots.length) % testiDots.length;
        updateTestimonial(prev);
      });
    }

    testiDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        updateTestimonial(idx);
      });
    });
  }

  /* ---- 7. Inscription Forms Handler ---- */
  const forms = document.querySelectorAll('#inscriptionForm, .inscription-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;
      const originalHTML = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Demande en cours d\'envoi...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ Demande envoyée avec succès !</span>';
        submitBtn.style.backgroundColor = '#13874F';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          form.reset();
        }, 4000);
      }, 1200);
    });
  });

  console.log('Collège Privé CEFAT-Inter — Ensemble du site initialisé.');
});
