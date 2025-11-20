/**
 * Génération des cheveux avec différents styles
 */
import { createPath } from '../utils/svgBuilder.js';
import { strokeColor, strokeWidth } from '../data/colors.js';

/**
 * Styles de cheveux disponibles
 */
export const hairStyles = ['short', 'spiky', 'long', 'bald'];

/**
 * Génère les cheveux selon le style
 */
export function generateHair(style, color) {
  switch (style) {
    case 'short':
      return createPath(
        'hair-shape',
        'M60,45 Q70,30 80,35 Q90,25 100,25 Q110,25 120,35 Q130,30 140,45',
        color,
        strokeColor,
        strokeWidth
      );

    case 'spiky':
      return createPath(
        'hair-shape',
        'M60,50 L65,25 L70,45 L80,20 L90,45 L100,15 L110,45 L120,20 L130,45 L135,25 L140,50',
        color,
        strokeColor,
        strokeWidth
      );

    case 'long':
      return createPath(
        'hair-shape',
        'M60,45 Q70,30 100,30 Q130,30 140,45 L145,80 Q145,95 140,100 L130,105 L70,105 L60,100 Q55,95 55,80 Z',
        color,
        strokeColor,
        strokeWidth
      );

    case 'bald':
      // Pas de cheveux, mais l'élément existe toujours (opacity 0)
      return createPath(
        'hair-shape',
        '',
        'none',
        'none',
        0,
        0  // opacity
      );

    default:
      return generateHair('short', color);
  }
}
