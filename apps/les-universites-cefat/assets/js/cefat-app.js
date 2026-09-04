/**
 * Les Universités CEFAT — Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. La barre de menu défile avec la page : plus de bascule collante.

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

  // 7 bis. Formulaire de contact
  // Le gabarit posait un `alert()` en attribut onsubmit : une modale
  // bloquante là où le formulaire de candidature affiche déjà sa réponse
  // dans la page. Même traitement ici.
  const ctForm = document.getElementById('contact-inquiry-form');
  const ctRetour = document.getElementById('contact-form-feedback');
  if (ctForm) {
    ctForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nom = document.getElementById('contact-nom')?.value.trim();
      const tel = document.getElementById('contact-tel')?.value.trim();
      const msg = document.getElementById('contact-msg')?.value.trim();
      const en  = document.documentElement.lang === 'en';

      if (!nom || !tel || !msg) {
        if (ctRetour) {
          ctRetour.className = 'ct-retour ct-retour--erreur';
          ctRetour.textContent = en
            ? 'Please fill in your name, phone number and message.'
            : 'Merci de renseigner votre nom, votre téléphone et votre message.';
        }
        return;
      }

      if (ctRetour) {
        ctRetour.className = 'ct-retour ct-retour--succes';
        ctRetour.textContent = en
          ? 'Thank you. Our team will reply within 24 hours.'
          : 'Merci pour votre message. Notre équipe vous répond sous 24h.';
      }
      ctForm.reset();
    });
  }

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
    if (!entete) return 0;
    // Seul un en-tête fixe recouvre la cible. Le nôtre défile avec la page.
    return getComputedStyle(entete).position === 'fixed'
      ? entete.getBoundingClientRect().height : 0;
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


/* ==========================================================================
   FILTRE PAR DOMAINE — PAGE FORMATIONS
   ==========================================================================
   Le méga-menu propose sept familles de domaines. Sans ce filtre, ces
   entrées mèneraient toutes au même catalogue de 33 programmes et
   l'utilisateur devrait chercher lui-même : autant ne pas les proposer.
   Le paramètre ?domaine= masque les programmes des autres familles et
   affiche un bandeau de retour. */
(function filtreDomaine() {
  const onglets = document.querySelector('.cycle-tabs');
  if (!onglets) return;

  const NOMS = {
    gestion:   'Gestion & Administration',
    numerique: 'Informatique & Numérique',
    btp:       'Génie Civil & BTP',
    droit:     'Droit & Sciences Politiques',
    marketing: 'Marketing & Communication',
    finance:   'Finance, Comptabilité & Audit',
    humanites: 'Lettres & Sciences Humaines',
  };

  const famille = new URLSearchParams(window.location.search).get('domaine');
  if (!famille || !NOMS[famille]) return;

  let gardes = 0;
  document.querySelectorAll('.prog-item').forEach(li => {
    const garde = li.dataset.famille === famille;
    li.hidden = !garde;
    if (garde) gardes++;
  });

  // Un groupe vidé de ses programmes disparaît, sinon son intitulé flotte
  // au-dessus de rien.
  document.querySelectorAll('.prog-group').forEach(g => {
    g.hidden = ![...g.querySelectorAll('.prog-item')].some(li => !li.hidden);
  });

  // Et la section entière avec son titre, si tous ses groupes sont vides.
  ['bts', 'licence'].forEach(id => {
    const bloc = document.getElementById(id);
    if (!bloc) return;
    const reste = [...bloc.querySelectorAll('.prog-item')].some(li => !li.hidden);
    bloc.hidden = !reste;
  });

  const banniere = document.createElement('div');
  banniere.className = 'filtre-actif';
  banniere.innerHTML =
    '<span class="filtre-actif__label">Filtre</span>' +
    '<strong class="filtre-actif__nom"></strong>' +
    '<span class="filtre-actif__n"></span>' +
    '<a class="filtre-actif__reset" href="formations.html">Voir les 33 programmes</a>';
  banniere.querySelector('.filtre-actif__nom').textContent = NOMS[famille];
  banniere.querySelector('.filtre-actif__n').textContent =
    gardes + (gardes > 1 ? ' programmes' : ' programme');
  // Juste sous les onglets de cycle : le bandeau annonce le filtre avant
  // que le visiteur ne parcoure les sections.
  onglets.parentNode.insertBefore(banniere, onglets.nextSibling);

  // Le visiteur arrive sur le bandeau, pas en haut de page.
  const racine = document.documentElement;
  const anime = racine.style.scrollBehavior;
  racine.style.scrollBehavior = 'auto';
  window.addEventListener('load', () => {
    const entete = document.querySelector('#header-sticky');
    const fixe = entete && getComputedStyle(entete).position === 'fixed';
    const marge = (fixe ? entete.getBoundingClientRect().height : 0) + 24;
    window.scrollTo(0, banniere.getBoundingClientRect().top + window.scrollY - marge);
    racine.style.scrollBehavior = anime;
  }, { once: true });
})();


/* ==========================================================================
   SLIDER DU HERO
   ==========================================================================
   Trois messages se relaient sur trois photos. La navigation se fait par
   vignettes : on voit où l'on va, au lieu de cliquer trois points
   anonymes. La rotation continue sous la souris ; seul le focus clavier la
   suspend, pour ne pas escamoter le message à qui navigue au clavier. */
(function heroSlider() {
  const pile = document.querySelector('[data-hero-slider]');
  if (!pile) return;

  const diapos = [...pile.querySelectorAll('.hero__slide')];
  const textes = [...document.querySelectorAll('.hero__say')];
  const vignettes = [...document.querySelectorAll('.hero__thumb')];
  if (diapos.length < 2 || textes.length !== diapos.length) return;

  const DUREE = 6000;
  let courante = 0;
  let minuteur = null;
  const zone = document.querySelector('.hero-slider-area');

  const montre = (k) => {
    courante = (k + diapos.length) % diapos.length;
    diapos.forEach((d, i) => {
      d.classList.toggle('is-active', i === courante);
      d.toggleAttribute('aria-hidden', i !== courante);
    });
    textes.forEach((t, i) => {
      t.hidden = i !== courante;
      t.classList.toggle('is-active', i === courante);
    });
    vignettes.forEach((v, i) => {
      // On retire puis remet la classe : sans cela l'animation de la jauge
      // ne repart pas quand on revient sur la même vignette.
      v.classList.remove('is-active');
      if (i === courante) { void v.offsetWidth; v.classList.add('is-active'); }
      v.setAttribute('aria-current', i === courante ? 'true' : 'false');
    });
  };

  const relanceJauge = () => {
    const v = vignettes[courante];
    if (!v) return;
    v.classList.remove('is-active');
    void v.offsetWidth;
    v.classList.add('is-active');
  };

  const lance = () => {
    arrete();
    zone && zone.classList.remove('est-en-pause');
    relanceJauge();
    minuteur = setInterval(() => montre(courante + 1), DUREE);
  };
  const arrete = () => {
    zone && zone.classList.add('est-en-pause');
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
  };

  vignettes.forEach((v, i) => {
    v.addEventListener('click', () => { montre(i); lance(); });
  });

  const prec = document.querySelector('[data-hero-prev]');
  const suiv = document.querySelector('[data-hero-next]');
  if (prec) prec.addEventListener('click', () => { montre(courante - 1); lance(); });
  if (suiv) suiv.addEventListener('click', () => { montre(courante + 1); lance(); });

  if (zone) {
    // Flèches du clavier dès que le focus est quelque part dans le hero.
    zone.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { montre(courante - 1); lance(); }
      if (e.key === 'ArrowRight') { montre(courante + 1); lance(); }
    });
    // Le survol n'interrompt plus la rotation : elle continue sous la souris.
    // Seul le focus clavier la suspend, pour laisser le temps de lire à qui
    // navigue au clavier (WCAG 2.2.2).
    zone.addEventListener('focusin', arrete);
    zone.addEventListener('focusout', lance);
  }

  // Onglet en arrière-plan : inutile de faire tourner.
  document.addEventListener('visibilitychange', () => {
    document.hidden ? arrete() : lance();
  });

  const sobre = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!sobre.matches) lance();
  sobre.addEventListener('change', e => e.matches ? arrete() : lance());
})();


/* ==========================================================================
   HAUTEUR DE L'EN-TÊTE
   ==========================================================================
   Seule la barre de menu est hors flux, posée sur la photo. La section
   d'ouverture doit dégager sa hauteur (--menu-h), et la barre de menu se cale
   sous le bandeau utilitaire (--topbar-h), qui disparaît sous 992px. On relève
   ces hauteurs plutôt que de les coder en dur. */
(function hauteurEntete() {
  const haut = document.querySelector('.header-top');
  const menu = document.querySelector('.menu-area');
  if (!menu) return;

  const maj = () => {
    const hh = haut && getComputedStyle(haut).display !== 'none' ? haut.offsetHeight : 0;
    const r = document.documentElement.style;
    r.setProperty('--topbar-h', hh + 'px');
    r.setProperty('--menu-h', menu.offsetHeight + 'px');
    r.setProperty('--header-h', (hh + menu.offsetHeight) + 'px');
  };

  maj();
  addEventListener('resize', maj);
  // Les polices arrivent après le premier calcul et changent la hauteur.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(maj);
})();


/* ==========================================================================
   ONGLETS DU CATALOGUE
   ==========================================================================
   Les quatre entrées n'étaient que des ancres : les quatre cycles défilaient
   d'un bloc et l'onglet ne servait qu'à sauter dedans. Chacun ouvre désormais
   son seul panneau.

   Deux précautions :
   — sans JavaScript, aucun panneau n'est masqué : la page reste entière ;
   — quand un filtre ?domaine= est actif, on n'active pas les onglets, sinon
     le filtre porterait sur un panneau caché et l'utilisateur croirait le
     catalogue vide. */
(function ongletsCycles() {
  const barre = document.querySelector('.cycle-tabs');
  const panneaux = [...document.querySelectorAll('[data-panneau]')];
  if (!barre || panneaux.length < 2) return;

  if (new URLSearchParams(location.search).get('domaine')) return;

  const onglets = [...barre.querySelectorAll('.cycle-tab')];
  const cible = (a) => (a.getAttribute('href') || '').replace('#', '');

  const ouvre = (id, deplacer) => {
    const existe = panneaux.some(p => p.id === id);
    if (!existe) id = panneaux[0].id;

    panneaux.forEach(p => p.classList.toggle('est-actif', p.id === id));
    onglets.forEach(a => {
      const actif = cible(a) === id;
      a.classList.toggle('is-active', actif);
      a.setAttribute('aria-selected', actif ? 'true' : 'false');
    });
    if (deplacer && location.hash !== '#' + id) {
      history.replaceState(null, '', '#' + id);
    }
  };

  onglets.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      ouvre(cible(a), true);
      // On ramène la barre d'onglets sous les yeux, pas le haut du panneau :
      // le titre du cycle doit rester visible juste en dessous.
      barre.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });

  // Les liens entrants (méga-menu, page d'accueil) ciblent un cycle précis.
  ouvre((location.hash || '').replace('#', '') || panneaux[0].id, false);
  addEventListener('hashchange', () => ouvre(location.hash.replace('#', ''), false));

  barre.classList.add('est-pilote');
})();




/* ==========================================================================
   ONGLETS DES PARTENARIATS
   ==========================================================================
   Une forme de reconnaissance à la fois : ses entrées à gauche, sa photo à
   droite. Le masquage n'entre en vigueur qu'une fois le script en place —
   sans lui, les trois panneaux restent lisibles à la suite. */
(function ongletsPartenaires() {
  const barre = document.querySelector('.partners__onglets');
  const cadre = document.querySelector('.partners__panneaux');
  if (!barre || !cadre) return;

  const onglets = [...barre.querySelectorAll('.partners__onglet')];
  const panneaux = [...cadre.querySelectorAll('.partners__panneau')];
  if (onglets.length !== panneaux.length || onglets.length < 2) return;

  const ouvre = (id) => {
    panneaux.forEach(p => p.classList.toggle('est-actif', p.id === id));
    onglets.forEach(b => {
      const actif = b.getAttribute('aria-controls') === id;
      b.classList.toggle('est-actif', actif);
      b.setAttribute('aria-selected', actif ? 'true' : 'false');
    });
  };

  onglets.forEach(b => b.addEventListener('click', () => ouvre(b.getAttribute('aria-controls'))));

  // Flèches gauche/droite entre onglets, comme l'attend un jeu d'onglets.
  barre.addEventListener('keydown', (e) => {
    const i = onglets.indexOf(document.activeElement);
    if (i < 0) return;
    const pas = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const suivant = onglets[(i + pas + onglets.length) % onglets.length];
    suivant.focus();
    ouvre(suivant.getAttribute('aria-controls'));
  });

  cadre.classList.add('est-pilote');
})();
