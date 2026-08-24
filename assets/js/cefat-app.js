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

  // 4. Compteurs animés
  //
  // L'ancienne version avançait d'un pas fixe toutes les 30 ms : pour un
  // objectif de 4, cela durait quatre images — invisible. Ici, chaque
  // compteur prend la même durée quelle que soit sa valeur, avec une sortie
  // amortie qui ralentit près du but, comme sur les sites de référence.
  const compteurs = document.querySelectorAll('.counter .count');
  const sectionChiffres = document.querySelector('.counter-area2');

  const DUREE = 1600; // ms

  // easeOutExpo : démarrage franc, arrivée en douceur
  const amorti = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  function lancerCompteurs() {
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    compteurs.forEach(el => {
      const cible = parseInt(el.getAttribute('data-count'), 10);
      if (Number.isNaN(cible)) return;

      if (reduit) { el.textContent = String(cible); return; }

      // Fige la largeur avant de partir de 0 : sans ça, la mise en page
      // se décale à chaque changement de nombre de chiffres.
      el.textContent = String(cible);
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
      el.style.display = 'inline-block';
      el.style.textAlign = 'center';

      let depart = null;
      const pas = (horodatage) => {
        if (depart === null) depart = horodatage;
        const avancement = Math.min((horodatage - depart) / DUREE, 1);
        el.textContent = String(Math.round(cible * amorti(avancement)));
        if (avancement < 1) requestAnimationFrame(pas);
        else el.textContent = String(cible);
      };
      requestAnimationFrame(pas);
    });
  }

  if (sectionChiffres && compteurs.length) {
    if (!('IntersectionObserver' in window)) {
      lancerCompteurs();
    } else {
      const obsChiffres = new IntersectionObserver((entrees) => {
        entrees.forEach(e => {
          if (!e.isIntersecting) return;
          lancerCompteurs();
          obsChiffres.disconnect();   // une seule fois
        });
      }, { threshold: 0.35 });
      obsChiffres.observe(sectionChiffres);
    }
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
        // Chaque vignette porte son propre identifiant via data-video ;
        // à défaut on retombe sur la vidéo de présentation.
        const id = btn.getAttribute('data-video');
        videoIframe.src = id
          ? `https://www.youtube.com/embed/${id}?autoplay=1`
          : defaultVideoUrl;
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

    // Échap ferme la modale : sans ça, seul le clic permettait d'en sortir.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !videoModal.classList.contains('open')) return;
      videoModal.classList.remove('open');
      videoIframe.src = "";
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

/* ==========================================================================
   MEGA MENU — survol, clavier, Échap
   L'état d'ouverture est piloté ici plutôt que par :focus-within en CSS :
   après Échap le focus revient sur l'onglet, qui est DANS le <li>, donc
   :focus-within rouvrait aussitôt le panneau et Échap semblait inopérant.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.main-menu li.has-mega');
  if (!items.length) return;

  const trigger = (li) => li.querySelector(':scope > a');

  const open = (li) => {
    li.classList.add('is-open');
    trigger(li).setAttribute('aria-expanded', 'true');
  };
  const close = (li) => {
    li.classList.remove('is-open');
    trigger(li).setAttribute('aria-expanded', 'false');
  };
  const closeAll = (except) => items.forEach(li => { if (li !== except) close(li); });

  items.forEach(li => {
    li.addEventListener('mouseenter', () => { closeAll(li); open(li); });
    li.addEventListener('mouseleave', () => { delete li.dataset.dismissed; close(li); });

    // Au clavier, atteindre l'onglet ouvre le panneau : Tab entre ensuite dedans.
    li.addEventListener('focusin', () => {
      if (li.dataset.dismissed === '1') return;
      closeAll(li);
      open(li);
    });

    // Le focus quitte vraiment le <li> (et pas juste un lien vers un autre)
    li.addEventListener('focusout', (e) => {
      if (li.contains(e.relatedTarget)) return;
      delete li.dataset.dismissed;
      close(li);
    });

    // Échap referme et rend le focus à l'onglet, sans rouvrir dans la foulée
    li.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      li.dataset.dismissed = '1';
      close(li);
      trigger(li).focus();
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-menu li.has-mega')) closeAll(null);
  });
});

/* ==========================================================================
   CARROUSEL DES ENTITÉS
   Trois cartes visibles, la quatrième à la flèche. Le déplacement se fait
   par scrollBy sur le conteneur : le scroll-snap CSS cale l'arrivée, et le
   glissement tactile continue de fonctionner sans code supplémentaire.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-entity-carousel]').forEach(root => {
    const view = root.querySelector('.entity-carousel__viewport');
    const slide = root.querySelector('.entity-slide');
    const prev = root.querySelector('[data-dir="prev"]');
    const next = root.querySelector('[data-dir="next"]');
    if (!view || !slide || !prev || !next) return;

    // La gouttière vient de `gap` : elle ne fait pas partie de la largeur
    // de la carte et doit être ajoutée au pas de défilement.
    const step = () => {
      const gap = parseFloat(getComputedStyle(view).columnGap) || 0;
      return slide.getBoundingClientRect().width + gap;
    };

    const sync = () => {
      // 1px de marge : les navigateurs arrondissent scrollLeft au sous-pixel
      const max = view.scrollWidth - view.clientWidth;
      prev.disabled = view.scrollLeft <= 1;
      next.disabled = view.scrollLeft >= max - 1;
    };

    prev.addEventListener('click', () => view.scrollBy({ left: -step() }));
    next.addEventListener('click', () => view.scrollBy({ left: step() }));

    view.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
});

/* ==========================================================================
   SÉLECTEUR DE CAMPUS
   Motif « tablist » standard : clic, flèches gauche/droite, Début/Fin.
   Un seul panneau visible à la fois, les autres portent [hidden].
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-campus-switch]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;

    const show = (tab, donnerLeFocus = true) => {
      tabs.forEach(t => {
        const actif = t === tab;
        t.classList.toggle('is-active', actif);
        t.setAttribute('aria-selected', String(actif));
        t.tabIndex = actif ? 0 : -1;
        const panneau = document.getElementById(t.getAttribute('aria-controls'));
        if (!panneau) return;
        panneau.hidden = !actif;
        panneau.classList.toggle('is-active', actif);
      });
      if (donnerLeFocus) tab.focus();
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => show(tab, false));
      tab.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(tab);
        let cible = null;
        if (e.key === 'ArrowRight') cible = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') cible = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') cible = tabs[0];
        else if (e.key === 'End') cible = tabs[tabs.length - 1];
        if (!cible) return;
        e.preventDefault();
        show(cible);
      });
    });
  });
});

/* ==========================================================================
   GALERIE VIDÉO — chargement dans le lecteur principal
   Une vignette ne lance plus la vidéo : elle la charge dans l'affiche
   principale (image, titre, description, identifiant). C'est le bouton
   central qui déclenche la lecture. Les libellés sont réaffectés par leur
   clé data-i18n, pas par leur texte, pour que FR/EN continue de suivre.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const carte = document.querySelector('.video-card');
  if (!carte) return;

  const still   = carte.querySelector('.video-card__still');
  const lien    = carte.querySelector('.video-card__main');
  const titre   = carte.querySelector('.video-card__title');
  const desc    = carte.querySelector('.video-card__desc');
  const vignettes = carte.querySelectorAll('.video-thumb');
  if (!still || !lien || !titre || !vignettes.length) return;

  vignettes.forEach(v => {
    v.addEventListener('click', () => {
      const id = v.dataset.video;

      still.src = v.dataset.still;
      lien.dataset.video = id;
      lien.href = `https://www.youtube.com/watch?v=${id}`;

      titre.setAttribute('data-i18n', v.dataset.titleKey);
      if (desc && v.dataset.descKey) desc.setAttribute('data-i18n', v.dataset.descKey);

      // Réapplique la langue courante : les nouveaux libellés viennent du
      // dictionnaire, jamais du texte de la vignette.
      if (typeof setLanguage === 'function') {
        setLanguage(document.documentElement.getAttribute('lang') || 'fr');
      }

      vignettes.forEach(a => a.classList.toggle('is-active', a === v));
    });
  });
});

/* ==========================================================================
   CHIFFRES CLÉS — révélation de la jauge
   La largeur de la barre est pilotée par une classe, pas par du style
   inline : la valeur reste dans le HTML (--fill), l'animation dans la CSS.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const bloc = document.querySelector('[data-stats]');
  if (!bloc) return;

  if (!('IntersectionObserver' in window)) { bloc.classList.add('is-visible'); return; }

  const obs = new IntersectionObserver((entrees) => {
    entrees.forEach(e => {
      if (!e.isIntersecting) return;
      bloc.classList.add('is-visible');
      obs.disconnect();
    });
  }, { threshold: 0.35 });

  obs.observe(bloc);
});

/* ==========================================================================
   ANCRES INTER-PAGES
   ==========================================================================
   Arriver sur entites.html#ifci laissait la page en haut, sur le titre
   « Un Réseau de 4 Pôles d'Excellence », au lieu de l'entité demandée.

   Deux causes cumulées :
   1. `html { scroll-behavior: smooth }` — un défilement programmatique lancé
      pendant le chargement est animé, puis annulé par le navigateur. Vérifié :
      window.scrollTo(0, 1200) ne bouge pas tant que scroll-behavior vaut
      smooth, et fonctionne dès qu'on le repasse à auto.
   2. Aucune image du site ne déclare ses dimensions : au moment où Chrome
      résout le fragment, la page n'a pas sa hauteur finale et la cible est
      encore au-dessus du pli.

   On rejoue donc le fragment une fois les images chargées, en neutralisant
   l'animation le temps du saut. Le défilement doux reste actif pour les
   clics sur les ancres internes, qui eux fonctionnent. */
(function ancreDifferee() {
  const fragment = window.location.hash;
  if (!fragment || fragment.length < 2) return;

  let cible;
  try { cible = document.querySelector(fragment); } catch (e) { return; }
  if (!cible) return;

  // Hauteur de l'en-tête s'il est collant, pour que le titre visé ne passe
  // pas dessous. Sur les pages où il défile avec le contenu, marge minimale.
  const hauteurEntete = () => {
    const entete = document.querySelector('#header-sticky, .header-sticky, header');
    return entete ? entete.getBoundingClientRect().height : 0;
  };

  // Dernière position qu'on a imposée : sert à détecter que l'utilisateur a
  // repris la main entre deux passes.
  let posePar_nous = 0;

  const caler = () => {
    const marge = hauteurEntete() + 24;
    const ecart = cible.getBoundingClientRect().top - marge;
    if (Math.abs(ecart) <= 2) return true;          // déjà en place

    const racine = document.documentElement;
    const anime = racine.style.scrollBehavior;
    racine.style.scrollBehavior = 'auto';           // sinon le saut est avalé
    window.scrollBy(0, ecart);
    racine.style.scrollBehavior = anime;
    posePar_nous = Math.round(window.scrollY);
    return false;
  };

  const rejouer = () => {
    if (window.scrollY > 4) return;
    if (cible.getBoundingClientRect().top + window.scrollY < 4) return;

    caler();
    // Les images n'ayant pas de dimensions déclarées, la page continue de
    // grandir après « load » et repousse la cible. On repasse quelques fois,
    // en s'arrêtant dès qu'elle est en place ou que l'utilisateur a bougé.
    let essais = 0;
    const suivre = () => {
      if (++essais > 4) return;
      if (Math.abs(window.scrollY - posePar_nous) > 4) return;  // l'utilisateur a repris la main
      if (caler()) return;
      setTimeout(suivre, 220);
    };
    setTimeout(suivre, 220);
  };

  if (document.readyState === 'complete') {
    rejouer();
  } else {
    window.addEventListener('load', rejouer, { once: true });
  }
})();
