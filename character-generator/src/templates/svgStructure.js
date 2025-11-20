/**
 * Template SVG unifié - Structure obligatoire pour tous les personnages
 */
import { createGroup } from '../utils/svgBuilder.js';

/**
 * Crée la structure SVG de base vide
 * Tous les personnages DOIVENT avoir exactement cette structure
 */
export function createSVGStructure() {
  return {
    body: {
      id: 'body',
      className: 'body',
      shape: null,
      clothing: null
    },
    legs: {
      id: 'legs',
      className: 'legs',
      leftLeg: null,
      rightLeg: null,
      leftFoot: null,
      rightFoot: null
    },
    head: {
      id: 'head',
      className: 'head',
      shape: null
    },
    face: {
      id: 'face',
      className: 'face',
      eyes: {
        id: 'eyes',
        leftEye: null,
        rightEye: null
      },
      mouth: null
    },
    hair: {
      id: 'hair',
      className: 'hair',
      shape: null
    },
    accessories: {
      id: 'accessories',
      className: 'accessories',
      hat: {
        id: 'hat',
        elements: []
      },
      glasses: {
        id: 'glasses',
        elements: []
      }
    }
  };
}

/**
 * Convertit la structure en SVG string
 */
export function structureToSVG(structure) {
  // Groupe body
  const bodyElements = [
    structure.body.shape,
    structure.body.clothing
  ].filter(Boolean);

  const bodyGroup = createGroup(
    structure.body.id,
    structure.body.className,
    bodyElements
  );

  // Groupe legs
  const legsElements = [
    structure.legs.leftLeg,
    structure.legs.rightLeg,
    structure.legs.leftFoot,
    structure.legs.rightFoot
  ].filter(Boolean);

  const legsGroup = createGroup(
    structure.legs.id,
    structure.legs.className,
    legsElements
  );

  // Groupe head
  const headElements = [structure.head.shape].filter(Boolean);
  const headGroup = createGroup(
    structure.head.id,
    structure.head.className,
    headElements
  );

  // Groupe eyes
  const eyesElements = [
    structure.face.eyes.leftEye,
    structure.face.eyes.rightEye
  ].filter(Boolean);

  const eyesGroup = createGroup(
    structure.face.eyes.id,
    '',
    eyesElements
  );

  // Groupe face
  const faceElements = [
    eyesGroup,
    structure.face.mouth
  ].filter(Boolean);

  const faceGroup = createGroup(
    structure.face.id,
    structure.face.className,
    faceElements
  );

  // Groupe hair
  const hairElements = [structure.hair.shape].filter(Boolean);
  const hairGroup = createGroup(
    structure.hair.id,
    structure.hair.className,
    hairElements
  );

  // Groupe hat (peut être vide)
  const hatGroup = createGroup(
    structure.accessories.hat.id,
    '',
    structure.accessories.hat.elements
  );

  // Groupe glasses (peut être vide)
  const glassesGroup = createGroup(
    structure.accessories.glasses.id,
    '',
    structure.accessories.glasses.elements
  );

  // Groupe accessories
  const accessoriesGroup = createGroup(
    structure.accessories.id,
    structure.accessories.className,
    [hatGroup, glassesGroup]
  );

  // Groupe character root (ordre STRICT)
  const characterElements = [
    bodyGroup,
    legsGroup,
    headGroup,
    faceGroup,
    hairGroup,
    accessoriesGroup
  ];

  const characterGroup = createGroup('character', 'character-root', characterElements);

  return characterGroup;
}
