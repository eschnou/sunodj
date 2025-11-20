/**
 * Générateur principal de personnages
 */
import { createSeededRandom } from '../utils/seededRandom.js';
import { generateId, svgToString } from '../utils/svgBuilder.js';
import { createSVGStructure, structureToSVG } from '../templates/svgStructure.js';
import { skinTones, hairColors, clothingColors } from '../data/colors.js';
import { generateBodyShape, generateLegs, generateFeet } from '../parts/body.js';
import { headShapes, generateHead } from '../parts/head.js';
import { eyeTypes, mouthTypes, generateEyes, generateMouth } from '../parts/face.js';
import { hairStyles, generateHair } from '../parts/hair.js';
import { clothingStyles, generateClothing } from '../parts/clothing.js';

/**
 * Génère un personnage complet
 * @param {Object} options - Options de génération
 * @returns {Object} - Objet character avec config et SVG
 */
export function generateCharacter(options = {}) {
  const {
    seed = null,
    gender = 'neutral',
    skinTone = null,
    random = true
  } = options;

  // Initialiser le générateur aléatoire
  const rng = seed ? createSeededRandom(seed) : {
    random: Math.random,
    nextInt: (max) => Math.floor(Math.random() * max),
    choice: (array) => array[Math.floor(Math.random() * array.length)]
  };

  // Sélectionner les caractéristiques
  const config = {
    head: {
      shape: rng.choice(headShapes),
      skinTone: skinTone !== null ? skinTone : rng.nextInt(skinTones.length)
    },
    face: {
      eyes: rng.choice(eyeTypes),
      mouth: rng.choice(mouthTypes)
    },
    hair: {
      style: rng.choice(hairStyles),
      color: rng.choice(hairColors)
    },
    clothing: {
      top: {
        style: rng.choice(clothingStyles),
        color: rng.choice(clothingColors)
      }
    },
    accessories: {
      hat: null,    // Phase 2
      glasses: null  // Phase 2
    }
  };

  // Construire le SVG
  const svg = buildSVG(config);

  // Retourner l'objet character
  return {
    id: generateId(),
    seed: seed,
    config: config,
    svg: svgToString(svg),
    timestamp: Date.now()
  };
}

/**
 * Construit le SVG à partir de la configuration
 */
function buildSVG(config) {
  // Créer la structure vide
  const structure = createSVGStructure();

  // Obtenir la couleur de peau
  const skinTone = skinTones[config.head.skinTone];

  // Remplir le body
  structure.body.shape = generateBodyShape(skinTone);
  structure.body.clothing = generateClothing(
    config.clothing.top.style,
    config.clothing.top.color
  );

  // Remplir les legs
  const { leftLeg, rightLeg } = generateLegs();
  const { leftFoot, rightFoot } = generateFeet();
  structure.legs.leftLeg = leftLeg;
  structure.legs.rightLeg = rightLeg;
  structure.legs.leftFoot = leftFoot;
  structure.legs.rightFoot = rightFoot;

  // Remplir la head
  structure.head.shape = generateHead(config.head.shape, skinTone);

  // Remplir le face
  const { leftEye, rightEye } = generateEyes(config.face.eyes);
  structure.face.eyes.leftEye = leftEye;
  structure.face.eyes.rightEye = rightEye;
  structure.face.mouth = generateMouth(config.face.mouth);

  // Remplir les hair
  structure.hair.shape = generateHair(config.hair.style, config.hair.color);

  // Accessories restent vides pour Phase 1
  structure.accessories.hat.elements = [];
  structure.accessories.glasses.elements = [];

  // Convertir en SVG string
  return structureToSVG(structure);
}
