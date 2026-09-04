# Les Universités CEFAT — Portail Web Universitaire Officiel

Site web officiel du réseau d'enseignement supérieur d'excellence **Les Universités CEFAT** (Côte d'Ivoire & Ghana), fondé sous l'impulsion de **M. AMAN HONORE**.

---

## 🏛️ Les 4 Entités Spécialisées

1. **Université CEFAT International** (Cycles Licences & Masters LMD)
2. **Institut de Formation CEFAT-Inter — IFCI** (Diplômes d'État BTS Tertiaires & Industriels)
3. **CEFAT Business School** (Programmes d'Élite Bachelor & Executive MBA)
4. **Centre d'Immersion Linguistique (Accra - Ghana)** (Formation intensive bilingue 100% anglais)

---

## 🌍 Les 5 Campus

- **Campus Abidjan** (Cocody Angré 8ème Tranche) — *Siège Principal*
- **Campus Abengourou** (Région du Moyen-Comoé)
- **Campus Bondoukou** (Région du Gontougo)
- **Campus Bonoua** (Région du Sud-Comoé)
- **Campus Accra (Ghana)** (East Legon / Airport Residential) — *Immersion Linguistique*

---

## 🚀 Fonctionnalités Principales

- 🌐 **Système Bilingue Intégral (FR / EN)** : Traduction complète et dynamique de l'ensemble du site sans rechargement (`assets/js/cefat-i18n.js`).
- 🧭 **Navigation & Menus Déroulants Fluides** : Menus thématiques avec sous-menus déroulants et animations soignées.
- 📱 **100% Responsive & Menu Mobile** : Drawer de navigation mobile interactif avec accordéons.
- 🗺️ **Carte Interactive SVG des 5 Campus** : Repères interactifs et fiches campus détaillées.
- 📝 **Formulaire de Candidature & Pré-Inscription en Ligne** : Sélection de cycle, domaine d'études et campus d'affectation.
- 🎓 **Offre Complète de Formations** : Fiches détaillées pour BTS, Licences, Masters et Executive MBA.

---

## 📂 Structure du Projet

```text
├── index.html           # Page d'accueil officielle
├── formations.html      # Catalogue des filières et diplômes (BTS, Licence, Master, MBA)
├── campus.html          # Présentation détaillée des 5 campus (CI & Ghana)
├── entites.html         # Fiches des 4 grandes écoles du réseau
├── candidatures.html    # Formulaire complet d'admission en ligne
├── actualites.html      # Actualités, événements et rentrées
├── contact.html         # Coordonnées officielles, formulaire et localisation
└── assets/
    ├── css/             # Stylesheet personnalisée (cefat-custom.css, style.css, etc.)
    ├── js/              # cefat-app.js, cefat-i18n.js, bootstrap, etc.
    ├── img/             # Logos, photos officielles des campus et bannières
    └── fonts/           # Polices d'icônes et typographies
```

---

## 🖼️ Emplacements Photo

Déposez vos photos **aux chemins exacts ci-dessous** : aucune modification du HTML n'est nécessaire.
Chaque emplacement est recadré automatiquement (`object-fit: cover`), donc cadrez large et centrez le sujet.

| Chemin | Ratio conseillé | Où il apparaît |
|---|---|---|
| `assets/img/hero/hero-bg.jpg` | 16:9 (min. 2000 px de large) | Bandeau d'accueil |
| `assets/img/hero/histoire-campus.jpg` | 3:2 (paysage) | Section « Notre Histoire » |
| `assets/img/hero/video-bg.jpg` | 16:9 | Section « Visite Virtuelle » |
| `assets/img/entities/entity-international.jpg` | 3:2 — **1200×800 px** | Carte Université CEFAT International |
| `assets/img/entities/entity-ifci.jpg` | 3:2 — **1200×800 px** | Carte Institut IFCI |
| `assets/img/entities/entity-business-school.jpg` | 3:2 — **1200×800 px** | Carte CEFAT Business School |
| `assets/img/entities/entity-langues-accra.jpg` | 3:2 — **1200×800 px** | Carte Centre d'Immersion Accra |
| `assets/img/campus/campus-abidjan.jpg` | 5:3 — **1500×900 px** | Tuile Campus Abidjan |
| `assets/img/campus/campus-abengourou.jpg` | 5:3 — **1500×900 px** | Tuile Campus Abengourou |
| `assets/img/campus/campus-bondoukou.jpg` | 5:3 — **1500×900 px** | Tuile Campus Bondoukou |
| `assets/img/campus/campus-bonoua.jpg` | 5:3 — **1500×900 px** | Tuile Campus Bonoua |
| `assets/img/campus/campus-accra.jpg` | 5:3 — **1500×900 px** | Tuile Campus Accra (Ghana) |

> **Panneaux des 5 campus** — le volet image s'affiche en **664 × 400 px** (≈ 5:3, paysage).
> `campus-bondoukou.jpg` et `campus-accra.jpg` sont encore en 400 × 500 (portrait) : recadrés
> en paysage, ils perdent la moitié de leur hauteur. À remplacer en 1500 × 900 px.

> **Cartes du carrousel « 4 Pôles d'Excellence »** — les quatre fichiers `entity-*.jpg`
> sont recadrés en 3:2 par le CSS (`aspect-ratio: 3 / 2`). Trois des fichiers actuels
> sont en 650×450 et un en 650×650 : ce dernier perd un quart de sa hauteur au recadrage.
> Livrez-les tous en 1200×800 px pour un rendu net sur écran à forte densité.

Le bandeau d'accueil est assombri par un voile dégradé : le titre reste lisible même sur une photo claire.

---

## 🎨 Système de Design

Tout le design vit dans `assets/css/cefat-custom.css`, chargé en dernier — c'est la feuille qui fait autorité.

- **Couleurs** — bleu marine `#142C55` dominant, carmin `#B21F2A` réservé aux points focaux, blanc cassé `#F4F3F0` pour les bandes alternées. Le rouge vif d'origine `#E03131` reste disponible en `--red-bright` pour la continuité du logo.
- **Typographie** — *Fraunces* (variable, `opsz 144`) pour les titres, *Inter* pour le texte courant.
- **Géométrie** — aucun arrondi, aucune ombre portée ; des filets de 1 px et des blocs de couleur pleine.
- **Rythme** — une seule cadence verticale, pilotée par `--section-y`.

Pour changer la charte, modifiez les variables du bloc `:root` en tête de fichier : tout le site suit.

---

## 💻 Démarrage Local

Vous pouvez lancer le site localement avec n'importe quel serveur web HTTP :

```bash
# Depuis la racine du monorepo
python3 -m http.server 8090 --directory apps/les-universites-cefat

# Ou via XAMPP / Apache
# Placer ce dossier dans htdocs/
```

---

## ⚖️ Droits & Propriété

© 2026 **Les Universités CEFAT** — Fondateur : **M. AMAN HONORE**. Tous droits réservés.  
*Établissement d'enseignement supérieur agréé par le Ministère de l'Enseignement Supérieur et de la Recherche Scientifique.*
