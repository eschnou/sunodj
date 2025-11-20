/**
 * Génération de la tête avec différentes formes
 */
import { createEllipse, createRect } from '../utils/svgBuilder.js';
import { strokeColor, strokeWidth } from '../data/colors.js';

/**
 * Formes de tête disponibles
 */
export const headShapes = ['round', 'oval', 'square'];

/**
 * Génère une tête selon la forme spécifiée
 */
export function generateHead(shape, skinTone) {
  switch (shape) {
    case 'round':
      return createEllipse(
        'head-shape',
        100,  // cx
        80,   // cy
        45,   // rx
        50,   // ry
        skinTone,
        strokeColor,
        strokeWidth
      );

    case 'oval':
      return createEllipse(
        'head-shape',
        100,  // cx
        80,   // cy
        40,   // rx (plus étroit)
        55,   // ry (plus long)
        skinTone,
        strokeColor,
        strokeWidth
      );

    case 'square':
      return createRect(
        'head-shape',
        55,   // x
        30,   // y
        90,   // width
        100,  // height
        skinTone,
        strokeColor,
        strokeWidth,
        5     // rx (coins légèrement arrondis)
      );

    default:
      return generateHead('round', skinTone);
  }
}
