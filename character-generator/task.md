# Character Generator - Plan de Développement

## Vue d'ensemble
Développement du générateur de personnages South Park en 2 phases progressives. Chaque phase est 100% fonctionnelle et testable visuellement avant de passer à la suivante.

---

## PHASE 1 - Fondations & Structure SVG (MVP)

### Objectif
Établir l'architecture SVG unifiée et produire des personnages simples mais fonctionnels avec variations minimales.

### Livrables
- ✓ Architecture SVG complète et cohérente
- ✓ Générateur de base fonctionnel
- ✓ 3-4 variations par élément principal
- ✓ Système de seed reproductible
- ✓ Page de démo HTML pour visualisation

### Tâches détaillées

#### 1.1 - Structure de base du projet
```
character-generator/
├── requirements.md              ✓ (existe)
├── task.md                      ✓ (ce fichier)
├── src/
│   ├── index.js                 # Point d'entrée, exports publics
│   ├── core/
│   │   └── generator.js         # Fonction generateCharacter()
│   ├── templates/
│   │   └── svgStructure.js      # Template SVG unifié
│   ├── parts/
│   │   ├── body.js              # Variations de corps
│   │   ├── head.js              # Variations de tête
│   │   ├── face.js              # Yeux et bouches
│   │   ├── hair.js              # Variations de cheveux
│   │   └── clothing.js          # Variations de vêtements
│   ├── data/
│   │   └── colors.js            # Palettes de couleurs
│   └── utils/
│       ├── svgBuilder.js        # Construction de SVG
│       └── seededRandom.js      # Générateur aléatoire avec seed
├── demo/
│   └── phase1-demo.html         # Page de test visuelle
└── examples/
    └── phase1/                  # Exemples de SVG générés
```

#### 1.2 - Template SVG unifié (`templates/svgStructure.js`)
**Mission**: Créer le template de base avec la structure fixe obligatoire

**Fonctionnalités**:
- Structure complète avec tous les groupes et IDs
- ViewBox: `0 0 200 300`
- Tous les éléments présents (même si vides)
- Fonction: `createSVGStructure()` retourne le template

**Structure exacte à implémenter**:
```xml
<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
  <g id="character" class="character-root">
    <g id="body" class="body">
      <ellipse id="body-shape" />
      <rect id="body-clothing" />
    </g>
    <g id="legs" class="legs">
      <line id="leg-left" />
      <line id="leg-right" />
      <ellipse id="foot-left" />
      <ellipse id="foot-right" />
    </g>
    <g id="head" class="head">
      <ellipse id="head-shape" />
    </g>
    <g id="face" class="face">
      <g id="eyes">
        <circle id="eye-left" />
        <circle id="eye-right" />
      </g>
      <path id="mouth" />
    </g>
    <g id="hair" class="hair">
      <path id="hair-shape" />
    </g>
    <g id="accessories" class="accessories">
      <g id="hat" />
      <g id="glasses" />
    </g>
  </g>
</svg>
```

#### 1.3 - Utilitaires de base

**`utils/svgBuilder.js`**:
```javascript
// Fonctions pour construire des éléments SVG
function createElement(tag, attributes, children)
function setAttributes(element, attrs)
function svgToString(svgObject)
```

**`utils/seededRandom.js`**:
```javascript
// Générateur pseudo-aléatoire avec seed
class SeededRandom {
  constructor(seed)
  next()           // Float 0-1
  nextInt(max)     // Int 0 to max-1
  choice(array)    // Pick random element
}
```

#### 1.4 - Palette de couleurs (`data/colors.js`)

**Couleurs de peau** (6 tons):
```javascript
const skinTones = [
  '#F5D7B3',  // Clair
  '#E8B996',  // Clair-moyen
  '#D4A574',  // Moyen
  '#B88556',  // Moyen-foncé
  '#8D5524',  // Foncé
  '#654321'   // Très foncé
];
```

**Couleurs de cheveux** (6 couleurs):
```javascript
const hairColors = [
  '#000000',  // Noir
  '#8B4513',  // Brun
  '#DAA520',  // Blond
  '#B22222',  // Roux
  '#808080',  // Gris
  '#FFFFFF'   // Blanc/blond platine
];
```

**Couleurs de vêtements** (8 couleurs vives):
```javascript
const clothingColors = [
  '#FF0000',  // Rouge
  '#0000FF',  // Bleu
  '#00FF00',  // Vert
  '#FFFF00',  // Jaune
  '#FF6600',  // Orange
  '#800080',  // Violet
  '#000000',  // Noir
  '#FFFFFF'   // Blanc
];
```

#### 1.5 - Variations d'éléments (Phase 1: 3-4 variations minimum)

**`parts/head.js`**:
```javascript
const headShapes = {
  round: {
    id: 'head-shape',
    element: 'ellipse',
    attrs: { cx: 100, cy: 80, rx: 45, ry: 50 }
  },
  oval: {
    id: 'head-shape',
    element: 'ellipse',
    attrs: { cx: 100, cy: 80, rx: 40, ry: 55 }
  },
  square: {
    id: 'head-shape',
    element: 'rect',
    attrs: { x: 55, y: 30, width: 90, height: 100, rx: 5 }
  }
};

function generateHead(shape, skinTone) {
  // Retourne le groupe <g id="head"> complet
}
```

**`parts/face.js`**:
```javascript
// Yeux - 3 variations
const eyeTypes = {
  normal: {
    left: { cx: 85, cy: 75, r: 3 },
    right: { cx: 115, cy: 75, r: 3 }
  },
  happy: {
    // Yeux en arc (path)
  },
  surprised: {
    // Yeux larges (r: 5)
  }
};

// Bouches - 4 variations
const mouthTypes = {
  neutral: { d: 'M85,95 Q100,95 115,95' },
  smile: { d: 'M85,95 Q100,105 115,95' },
  sad: { d: 'M85,100 Q100,90 115,100' },
  open: { d: 'M90,95 Q100,105 110,95 Q100,100 90,95' }
};

function generateFace(eyeType, mouthType) {
  // Retourne le groupe <g id="face"> complet
}
```

**`parts/hair.js`**:
```javascript
// Cheveux - 4 variations
const hairStyles = {
  short: {
    d: 'M60,45 Q70,30 80,35 Q90,25 100,25 Q110,25 120,35 Q130,30 140,45'
  },
  spiky: {
    d: 'M60,50 L65,25 L70,45 L80,20 L90,45 L100,15 L110,45 L120,20 L130,45 L135,25 L140,50'
  },
  long: {
    d: 'M60,45 Q70,30 100,30 Q130,30 140,45 L145,80 Q145,95 140,100 L130,105 L70,105 L60,100 Q55,95 55,80 Z'
  },
  bald: {
    d: ''  // Pas de cheveux, opacity: 0
  }
};

function generateHair(style, color) {
  // Retourne le groupe <g id="hair"> complet
}
```

**`parts/body.js`**:
```javascript
// Corps - Style South Park (forme haricot)
const bodyShape = {
  element: 'ellipse',
  attrs: { cx: 100, cy: 160, rx: 35, ry: 45 }
};

// Jambes - Simples lignes
const legs = {
  left: { x1: 90, y1: 200, x2: 85, y2: 240 },
  right: { x1: 110, y1: 200, x2: 115, y2: 240 }
};

// Pieds - Petits ovales noirs
const feet = {
  left: { cx: 85, cy: 245, rx: 8, ry: 4 },
  right: { cx: 115, cy: 245, rx: 8, ry: 4 }
};

function generateBody() {
  // Retourne les groupes <g id="body"> et <g id="legs"> complets
}
```

**`parts/clothing.js`**:
```javascript
// Vêtements - 3 styles simples de haut
const topStyles = {
  tshirt: {
    element: 'rect',
    attrs: { x: 70, y: 140, width: 60, height: 50, rx: 3 }
  },
  hoodie: {
    // Rectangle + petit rectangle pour capuche
  },
  vest: {
    // Forme en V
  }
};

function generateClothing(style, primaryColor) {
  // Retourne le rect dans <g id="body">
}
```

#### 1.6 - Générateur principal (`core/generator.js`)

**Fonction principale**:
```javascript
function generateCharacter(options = {}) {
  const {
    seed = null,
    gender = 'neutral',
    skinTone = null,
    random = true
  } = options;

  // 1. Initialiser le générateur aléatoire
  const rng = seed ? new SeededRandom(seed) : Math.random;

  // 2. Sélectionner les caractéristiques
  const config = {
    head: {
      shape: rng.choice(['round', 'oval', 'square']),
      skinTone: skinTone ?? rng.nextInt(skinTones.length)
    },
    face: {
      eyes: rng.choice(['normal', 'happy', 'surprised']),
      mouth: rng.choice(['neutral', 'smile', 'sad', 'open'])
    },
    hair: {
      style: rng.choice(['short', 'spiky', 'long', 'bald']),
      color: rng.choice(hairColors)
    },
    clothing: {
      top: {
        style: rng.choice(['tshirt', 'hoodie', 'vest']),
        color: rng.choice(clothingColors)
      }
    },
    accessories: {
      hat: null,    // Phase 2
      glasses: null  // Phase 2
    }
  };

  // 3. Construire le SVG
  const svg = buildSVG(config);

  // 4. Retourner l'objet character
  return {
    id: generateId(),
    seed: seed,
    config: config,
    svg: svgToString(svg),
    timestamp: Date.now()
  };
}
```

**Fonction de construction**:
```javascript
function buildSVG(config) {
  // 1. Créer la structure de base
  const structure = createSVGStructure();

  // 2. Remplir chaque groupe avec les bonnes valeurs
  fillBody(structure, config.clothing);
  fillLegs(structure);
  fillHead(structure, config.head);
  fillFace(structure, config.face);
  fillHair(structure, config.hair);

  return structure;
}
```

#### 1.7 - Point d'entrée (`index.js`)

```javascript
import { generateCharacter } from './core/generator.js';

export {
  generateCharacter,
  // Phase 2+:
  // customizeCharacter,
  // exportCharacter,
  // generateFromConfig
};

// Export par défaut
export default {
  generateCharacter
};
```

#### 1.8 - Page de démo (`demo/phase1-demo.html`)

**Contenu**:
- Interface simple HTML
- Bouton "Generate Random Character"
- Bouton "Generate with Seed" (input text pour le seed)
- Zone d'affichage du SVG (grand format)
- Affichage de la config JSON
- Grille de 9 personnages générés pour voir la variété

**Exemple de structure**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Character Generator - Phase 1 Demo</title>
  <style>
    .character-display { width: 200px; height: 300px; }
    .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  </style>
</head>
<body>
  <h1>Phase 1 - Démo du Générateur</h1>

  <div class="controls">
    <button onclick="generateRandom()">Generate Random</button>
    <input id="seedInput" placeholder="Enter seed" />
    <button onclick="generateWithSeed()">Generate with Seed</button>
  </div>

  <div class="main-display">
    <div id="mainCharacter" class="character-display"></div>
    <pre id="configDisplay"></pre>
  </div>

  <h2>Gallery (9 personnages)</h2>
  <div id="gallery" class="gallery"></div>

  <script type="module" src="../src/index.js"></script>
  <script type="module">
    import { generateCharacter } from '../src/index.js';

    function generateRandom() {
      const char = generateCharacter();
      displayCharacter(char);
    }

    function generateWithSeed() {
      const seed = document.getElementById('seedInput').value;
      const char = generateCharacter({ seed });
      displayCharacter(char);
    }

    function displayCharacter(char) {
      document.getElementById('mainCharacter').innerHTML = char.svg;
      document.getElementById('configDisplay').textContent =
        JSON.stringify(char.config, null, 2);
    }

    // Génération initiale de la galerie
    function generateGallery() {
      const gallery = document.getElementById('gallery');
      for (let i = 0; i < 9; i++) {
        const char = generateCharacter({ seed: `demo-${i}` });
        const div = document.createElement('div');
        div.className = 'character-display';
        div.innerHTML = char.svg;
        gallery.appendChild(div);
      }
    }

    generateGallery();
  </script>
</body>
</html>
```

### Critères de succès Phase 1

**Vérifications visuelles**:
- [ ] Ouvrir `demo/phase1-demo.html` dans un navigateur
- [ ] Tous les personnages ont la même structure SVG (vérifier dans DevTools)
- [ ] Les IDs sont constants : `#head-shape`, `#eye-left`, `#mouth`, etc.
- [ ] Style South Park reconnaissable (contours noirs, formes simples)
- [ ] Bouton "Generate Random" produit des personnages différents
- [ ] Même seed produit toujours le même personnage
- [ ] La galerie montre 9 personnages variés
- [ ] SVG redimensionnable sans perte de qualité
- [ ] Aucune erreur console

**Caractéristiques techniques**:
- [ ] Structure SVG parfaitement cohérente sur tous les personnages
- [ ] Ordre des groupes identique : body → legs → head → face → hair → accessories
- [ ] Maximum 20-30 éléments SVG par personnage
- [ ] SVG valide (peut être copié/collé et fonctionne)

---

## PHASE 2 - Animation Dancing (POC)

### Objectif
Créer **UNE SEULE** animation dancing universelle qui fonctionne sur **N'IMPORTE QUEL** personnage généré, peu importe ses caractéristiques (forme de tête, cheveux, vêtements, etc.). Cette animation doit être déclenchée par **UN SIMPLE BOUTON "Animate"**.

**Principe clé**: Grâce à l'architecture SVG unifiée de la Phase 1, tous les personnages ont les mêmes IDs fixes (`#head`, `#body`, `#leg-left`, etc.). On peut donc cibler ces IDs avec CSS pour créer une animation qui fonctionne sur 100% des personnages générés.

### Livrables
- ✓ **UNE animation dancing** (balancement corps + mouvement tête + jambes alternées)
- ✓ **UN bouton "Animate"** pour démarrer/arrêter l'animation
- ✓ Animation **universelle** : fonctionne sur n'importe quel personnage
- ✓ Page de démo interactive

### Tâches détaillées

#### 2.1 - Création des animations CSS (`src/animations/dancing.css`)

**Animations dancing simples**:
```css
/* Animation principale - balancement du corps */
@keyframes dance-bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(-3deg);
  }
  75% {
    transform: translateY(-10px) rotate(3deg);
  }
}

/* Animation de la tête - hochement */
@keyframes head-bob {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(2deg);
  }
}

/* Animation des jambes - alternance */
@keyframes leg-left-kick {
  0%, 100% {
    transform: rotate(0deg);
    transform-origin: 90px 200px;
  }
  50% {
    transform: rotate(-10deg);
    transform-origin: 90px 200px;
  }
}

@keyframes leg-right-kick {
  0%, 100% {
    transform: rotate(0deg);
    transform-origin: 110px 200px;
  }
  50% {
    transform: rotate(10deg);
    transform-origin: 110px 200px;
  }
}

/* Animation des cheveux - mouvement */
@keyframes hair-sway {
  0%, 100% {
    transform: rotate(0deg);
    transform-origin: 100px 50px;
  }
  50% {
    transform: rotate(5deg);
    transform-origin: 100px 50px;
  }
}

/* Classes à appliquer pour déclencher les animations */
.character-root.dancing {
  animation: dance-bounce 0.6s ease-in-out infinite;
}

.character-root.dancing .head {
  animation: head-bob 0.4s ease-in-out infinite;
}

.character-root.dancing #leg-left {
  animation: leg-left-kick 0.6s ease-in-out infinite;
}

.character-root.dancing #leg-right {
  animation: leg-right-kick 0.6s ease-in-out infinite 0.3s;
}

.character-root.dancing .hair {
  animation: hair-sway 0.5s ease-in-out infinite;
}
```

#### 2.2 - Implémentation du bouton "Animate" (dans la page de démo)

**Principe**: Ajouter/retirer la classe CSS `.dancing` sur le groupe `.character-root`

**Code simple**:
```javascript
// Toggle l'animation au clic du bouton
function toggleAnimation() {
  const root = document.querySelector('.character-root');
  if (root) {
    root.classList.toggle('dancing');
  }
}
```

C'est tout ! Grâce aux IDs fixes, l'animation CSS cible automatiquement les bons éléments.

#### 2.3 - Mise à jour de la page de démo (`demo/phase2-animation.html`)

**Nouvelle page de démo avec animation**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Character Generator - Phase 2 Animation</title>

  <!-- Styles de base -->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    h1 {
      text-align: center;
      margin-bottom: 10px;
      color: #667eea;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }

    .controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    button {
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-animate {
      background: #FF6B6B;
      color: white;
      font-size: 18px;
    }

    .btn-animate:hover {
      background: #EE5A52;
      transform: scale(1.05);
    }

    .btn-animate.active {
      background: #51CF66;
    }

    .main-display {
      display: flex;
      gap: 30px;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
      padding: 40px;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .character-container {
      background: white;
      border: 3px solid #333;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .character-display {
      width: 300px;
      height: 450px;
    }

    .info {
      background: #E3F2FD;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #2196F3;
      margin-bottom: 20px;
    }

    .info h3 {
      margin-bottom: 10px;
      color: #1976D2;
    }

    .info p {
      line-height: 1.6;
      color: #555;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .gallery-item {
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 10px;
      transition: transform 0.3s ease;
      cursor: pointer;
    }

    .gallery-item:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .gallery-character {
      width: 100%;
      height: auto;
      aspect-ratio: 2/3;
    }
  </style>

  <!-- Animations CSS -->
  <style>
    /* Animation principale - balancement du corps */
    @keyframes dance-bounce {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      25% {
        transform: translateY(-10px) rotate(-3deg);
      }
      75% {
        transform: translateY(-10px) rotate(3deg);
      }
    }

    /* Animation de la tête - hochement */
    @keyframes head-bob {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-5px) rotate(2deg);
      }
    }

    /* Animation des jambes - alternance */
    @keyframes leg-left-kick {
      0%, 100% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(-10deg);
      }
    }

    @keyframes leg-right-kick {
      0%, 100% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(10deg);
      }
    }

    /* Animation des cheveux - mouvement */
    @keyframes hair-sway {
      0%, 100% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(5deg);
      }
    }

    /* Classes à appliquer pour déclencher les animations */
    .character-root.dancing {
      animation: dance-bounce 0.6s ease-in-out infinite;
    }

    .character-root.dancing .head {
      animation: head-bob 0.4s ease-in-out infinite;
      transform-origin: center;
    }

    .character-root.dancing #leg-left {
      animation: leg-left-kick 0.6s ease-in-out infinite;
      transform-origin: 90px 200px;
    }

    .character-root.dancing #leg-right {
      animation: leg-right-kick 0.6s ease-in-out infinite 0.3s;
      transform-origin: 110px 200px;
    }

    .character-root.dancing .hair {
      animation: hair-sway 0.5s ease-in-out infinite;
      transform-origin: 100px 50px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Character Generator - Phase 2</h1>
    <p class="subtitle">Dancing Animation POC</p>

    <div class="info">
      <h3>🎵 Comment ça marche ?</h3>
      <p>
        Grâce à l'architecture SVG unifiée de la Phase 1, tous les personnages ont les mêmes IDs et la même structure.
        Cela permet d'appliquer les mêmes animations CSS à n'importe quel personnage généré !
        <br><br>
        <strong>Cliquez sur "🎉 Animate" pour faire danser le personnage !</strong>
      </p>
    </div>

    <div class="controls">
      <button class="btn-primary" onclick="generateRandom()">
        🎲 Generate Random
      </button>
      <button class="btn-animate" id="animateBtn" onclick="toggleAnimation()">
        🎉 Animate
      </button>
    </div>

    <div class="main-display">
      <div class="character-container">
        <div id="mainCharacter" class="character-display"></div>
      </div>
    </div>

    <h2 style="text-align: center; margin: 30px 0 20px; color: #667eea;">
      Gallery - Click to animate any character!
    </h2>
    <div id="gallery" class="gallery"></div>
  </div>

  <script type="module">
    import { generateCharacter } from '../src/index.js';

    let currentCharacter = null;
    let isAnimating = false;

    // Génération aléatoire
    window.generateRandom = function() {
      currentCharacter = generateCharacter();
      displayCharacter(currentCharacter);
      // Réinitialiser l'état du bouton
      isAnimating = false;
      updateAnimateButton();
    };

    // Affichage du personnage
    function displayCharacter(char) {
      const container = document.getElementById('mainCharacter');
      container.innerHTML = char.svg;
    }

    // Toggle animation
    window.toggleAnimation = function() {
      const container = document.getElementById('mainCharacter');
      const root = container.querySelector('.character-root');

      if (root) {
        isAnimating = !isAnimating;
        if (isAnimating) {
          root.classList.add('dancing');
        } else {
          root.classList.remove('dancing');
        }
        updateAnimateButton();
      }
    };

    // Mise à jour du bouton
    function updateAnimateButton() {
      const btn = document.getElementById('animateBtn');
      if (isAnimating) {
        btn.classList.add('active');
        btn.textContent = '⏸️ Stop Dancing';
      } else {
        btn.classList.remove('active');
        btn.textContent = '🎉 Animate';
      }
    }

    // Génération de la galerie
    function generateGallery() {
      const gallery = document.getElementById('gallery');
      gallery.innerHTML = '';

      for (let i = 0; i < 6; i++) {
        const seed = `demo-${i}`;
        const char = generateCharacter({ seed });

        const item = document.createElement('div');
        item.className = 'gallery-item';

        // Click pour afficher + animer
        item.onclick = () => {
          currentCharacter = char;
          displayCharacter(char);

          // Auto-démarrer l'animation
          setTimeout(() => {
            const container = document.getElementById('mainCharacter');
            const root = container.querySelector('.character-root');
            if (root) {
              root.classList.add('dancing');
              isAnimating = true;
              updateAnimateButton();
            }
          }, 100);
        };

        const charDiv = document.createElement('div');
        charDiv.className = 'gallery-character';
        charDiv.innerHTML = char.svg;

        item.appendChild(charDiv);
        gallery.appendChild(item);

        // Hover pour preview animation
        item.addEventListener('mouseenter', () => {
          const root = charDiv.querySelector('.character-root');
          if (root) root.classList.add('dancing');
        });

        item.addEventListener('mouseleave', () => {
          const root = charDiv.querySelector('.character-root');
          if (root) root.classList.remove('dancing');
        });
      }
    }

    // Initialisation
    generateRandom();
    generateGallery();
  </script>
</body>
</html>
```

### Critères de succès Phase 2

**TEST PRINCIPAL - Animation universelle**:
- [ ] Générer 5 personnages différents (différentes têtes, cheveux, vêtements)
- [ ] Cliquer sur "Animate" pour chacun
- [ ] **VALIDATION**: La même animation fonctionne parfaitement sur TOUS les personnages
- [ ] Aucun personnage ne nécessite d'ajustement CSS spécifique

**Vérifications visuelles**:
- [ ] Ouvrir `demo/phase2-animation.html` dans un navigateur
- [ ] UN bouton "Animate" est visible
- [ ] Clic sur "Animate" → le personnage danse (corps balance, tête bouge, jambes alternent)
- [ ] Re-clic sur "Animate" → l'animation s'arrête
- [ ] Générer un nouveau personnage aléatoire → cliquer "Animate" → ça marche !
- [ ] L'animation est fluide et fun

**Validation technique**:
- [ ] La classe `.dancing` appliquée à `.character-root` active l'animation
- [ ] Les animations CSS utilisent les IDs fixes : `#leg-left`, `#leg-right`, `.head`, `.hair`
- [ ] **ZÉRO code JavaScript spécifique par personnage** (tout est CSS générique)
- [ ] Performance 60fps
- [ ] Aucune erreur console

---

## Résumé des Phases

### Phase 1 - Fondations ✅
**Objectif**: Structure SVG solide + génération de base
**Livrable**: Générateur minimal fonctionnel avec 3-4 variations
**Test**: `demo/phase1-demo.html` - 9 personnages générés avec seed

### Phase 2 - Animation Dancing 🎵
**Objectif**: UNE animation dancing universelle
**Livrable**: UN bouton "Animate" + UNE danse qui fonctionne sur 100% des personnages
**Test**: `demo/phase2-animation.html` - Générer plusieurs personnages, tous dansent avec la même animation

---

## Notes Importantes

### Architecture SVG Unifiée - CRITIQUE
L'architecture unifiée mise en place en Phase 1 est **essentielle** pour la Phase 2. Elle permet:
- De cibler les mêmes éléments SVG avec CSS (IDs fixes)
- D'appliquer les mêmes animations à tous les personnages
- De garantir un comportement cohérent

Sans cette architecture, chaque personnage nécessiterait des animations spécifiques.

### Prochaines étapes possibles
- Synchronisation de l'animation avec la musique (BPM)
- Animation réactive au rythme et à l'intensité du son
- Intégration dans la Dancing Room de l'application principale
- Génération de plusieurs personnages qui dansent ensemble
