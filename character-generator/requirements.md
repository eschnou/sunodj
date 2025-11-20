# Character Generator - Requirements

## Overview
Générateur de personnages 2D avatar en SVG style South Park pour la Dancing Room de l'application DJ Sunodj.

## Contexte & Objectif
- **Usage**: Visualisation des utilisateurs/participants dans la Dancing Room
- **Style**: South Park (simple, cartoon, reconnaissable, expressif)
- **Format**: SVG (scalable, léger, manipulable en web)
- **Plateforme**: Web (React/JavaScript)

## Caractéristiques du Style South Park

### Traits visuels essentiels
- **Silhouette**: Corps simple, proportions enfantines (tête large, corps compact)
- **Contours**: Lignes noires épaisses (2-3px)
- **Couleurs**: Aplats solides, pas de dégradés, palette vive
- **Formes**: Géométriques simples, cercles et ovales
- **Yeux**: Deux points noirs ou petits cercles
- **Bouche**: Ligne simple exprimant l'émotion
- **Simplicité**: Maximum 20-30 éléments SVG par personnage
- **Architecture unifiée**: TOUS les personnages utilisent la même structure SVG hiérarchique, les mêmes noms d'éléments, les mêmes IDs/classes, et le même ordre des tags. Cette cohérence structurelle garantit que les animations peuvent être appliquées de manière consistante à n'importe quel personnage généré.

### Esthétique
- Minimaliste mais expressif
- Reconnaissance immédiate du style
- Flat design, pas de 3D
- Lisible à petite échelle (50px-200px)

## Architecture Technique

### Architecture SVG Unifiée (CRITIQUE)

**Principe fondamental**: Chaque personnage généré DOIT respecter exactement la même structure SVG, indépendamment de ses variations visuelles.

**Structure obligatoire**:
```xml
<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
  <g id="character" class="character-root">
    <!-- Ordre strict des groupes -->
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

**Règles strictes**:
1. **IDs fixes**: Chaque élément a un ID unique et constant
2. **Ordre préservé**: L'ordre des éléments est toujours identique (body → legs → head → face → hair → accessories)
3. **Classes cohérentes**: Les classes CSS sont standardisées
4. **Groupes sémantiques**: Hiérarchie logique pour animations par groupe
5. **Éléments optionnels**: Si un accessoire n'est pas utilisé, le groupe `<g>` existe quand même mais est vide ou avec `opacity="0"`

**Avantages pour l'animation**:
- Ciblage CSS/JS prévisible: `#eye-left`, `.hair`, etc.
- Animations réutilisables sur tous les personnages
- Transformations de groupe cohérentes
- Synchronisation facilitée avec la musique

**Exemple de variations sans changement de structure**:
```javascript
// Cheveux courts
<path id="hair-shape" d="M50,30 Q60,20 70,30" fill="#8B4513"/>

// Cheveux longs (même ID, différent path)
<path id="hair-shape" d="M40,30 Q60,10 80,30 L85,60 L55,60 L40,30" fill="#8B4513"/>

// Pas de cheveux (élément existe toujours)
<path id="hair-shape" d="" fill="none" opacity="0"/>

### Technologies
- **Langage**: JavaScript ES6+
- **Format**: SVG natif (pas de canvas)
- **Export**: String SVG ou Data URI
- **Intégration**: Module importable dans React

## Fonctionnalités Requises

### 1. Génération de Base
```javascript
generateCharacter(options?)
// Retourne: SVG string ou objet SVG
```

**Options**:
- `seed`: String pour génération déterministe
- `gender`: 'male' | 'female' | 'neutral'
- `skinTone`: Index de palette
- `random`: Boolean (override manuel si false)

### 2. Personnalisation
```javascript
customizeCharacter(character, modifications)
```

**Éléments personnalisables**:
- **Tête/Visage**:
  - Forme de la tête (ronde, ovale, carrée)
  - Couleur de peau (6-8 tons)
  - Type d'yeux (normaux, fermés, surpris, heureux)
  - Type de bouche (neutre, sourire, triste, ouverte)

- **Cheveux**:
  - Style (courts, longs, bouclés, chauve, etc.) - 8-10 variations
  - Couleur (noir, brun, blond, roux, gris, coloré) - 10+ couleurs

- **Vêtements**:
  - Haut (t-shirt, pull, veste) - 5-7 styles
  - Couleur principale
  - Couleur secondaire (détails)

- **Accessoires** (optionnels):
  - Lunettes (3-4 styles)
  - Chapeau (casquette, bonnet, etc.) - 4-6 styles
  - Expressions faciales

### 3. Export
```javascript
exportCharacter(character, format)
```

**Formats supportés**:
- `svg-string`: String SVG complet
- `svg-data-uri`: Data URI pour img src
- `json`: Configuration du personnage (régénérable)
- `react-component`: JSX pour intégration React

### 4. Génération Aléatoire Intelligente
- Distribution équilibrée des caractéristiques
- Cohérence des couleurs (pas de combinaisons horribles)
- Variété garantie sur un grand nombre de générations
- Reproductibilité avec seed

## Structure de Données

### Objet Character
```javascript
{
  id: 'unique-id',
  seed: 'generation-seed',
  config: {
    head: {
      shape: 'round',
      skinTone: 3
    },
    face: {
      eyes: 'normal',
      mouth: 'smile'
    },
    hair: {
      style: 'short-spiky',
      color: '#8B4513'
    },
    clothing: {
      top: {
        style: 't-shirt',
        primaryColor: '#FF0000',
        secondaryColor: '#FFFFFF'
      }
    },
    accessories: {
      glasses: null,
      hat: 'cap'
    }
  },
  svg: '<svg>...</svg>',
  timestamp: 1234567890
}
```

## API Publique

### Fonctions principales
```javascript
// Génération simple
const character = generateCharacter();

// Génération avec seed (reproductible)
const character = generateCharacter({ seed: 'user123' });

// Personnalisation
const custom = customizeCharacter(character, {
  hair: { style: 'long', color: '#FF1493' },
  clothing: { top: { primaryColor: '#00FF00' } }
});

// Export
const svgString = exportCharacter(character, 'svg-string');
const dataUri = exportCharacter(character, 'svg-data-uri');
const config = exportCharacter(character, 'json');

// Regénération depuis config
const restored = generateFromConfig(config);
```

## Contraintes Techniques

### Performance
- Génération < 50ms par personnage
- SVG final < 10KB
- Pas de requêtes externes (tout en local)

### Compatibilité
- Navigateurs modernes (ES6+)
- React 18+
- SVG 1.1 standard
- Responsive (viewBox pour scaling)

### Qualité
- Code modulaire et testable
- Chaque partie indépendante
- Facile d'ajouter de nouvelles variations

## Exemples d'Usage dans l'App

### Cas 1: Avatar utilisateur
```javascript
import { generateCharacter } from './character-generator';

const userAvatar = generateCharacter({
  seed: userId,
  gender: userPreferences.gender
});

<img src={exportCharacter(userAvatar, 'svg-data-uri')} />
```

### Cas 2: Dancing Room crowd
```javascript
const dancers = Array(20).fill(0).map((_, i) =>
  generateCharacter({ seed: `dancer-${i}` })
);

dancers.forEach(dancer => renderInRoom(dancer));
```

### Cas 3: Personnalisation UI
```javascript
<CharacterCustomizer
  character={currentCharacter}
  onChange={(modified) => updateCharacter(modified)}
/>
```

## Priorités d'Implémentation

### Phase 1 - MVP
1. Structure SVG de base (tête, corps, membres)
2. Système de génération aléatoire
3. 3-4 variations par élément (yeux, bouche, cheveux)
4. Palette de couleurs de base
5. Export SVG string

## Notes de Style South Park

### Références visuelles
- Corps: Forme de haricot avec petites jambes
- Tête: Large, presque aussi large que le corps
- Bras: Fins, simples lignes avec mains basiques
- Pieds: Petits ovales noirs
- Ombres: Optionnelles, légères, sous les pieds uniquement

### Palette de couleurs typique
- Tons chair: #F5D7B3, #E8B996, #D4A574, #B88556, #8D5524, #654321
- Vêtements: Couleurs primaires vives (rouge, bleu, vert, jaune, orange)
- Cheveux: Naturels et fantaisie (noir, brun, blond, roux, bleu, rose, vert)
- Contours: Toujours noir (#000000)

## Critères de Succès
- ✓ Génération instantanée de personnages uniques
- ✓ Style South Park immédiatement reconnaissable
- ✓ Personnalisation intuitive et flexible
- ✓ Performance fluide pour 20+ personnages simultanés
- ✓ Intégration facile dans composants React
- ✓ Code maintenable et extensible
