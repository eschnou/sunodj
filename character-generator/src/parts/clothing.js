/**
 * Génération des vêtements
 */
import { createRect, createPath } from '../utils/svgBuilder.js';
import { strokeColor, strokeWidth } from '../data/colors.js';

/**
 * Styles de vêtements disponibles
 */
export const clothingStyles = ['tshirt', 'hoodie', 'vest'];

/**
 * Génère un vêtement selon le style
 */
export function generateClothing(style, color) {
  switch (style) {
    case 'tshirt':
      return createRect(
        'body-clothing',
        70,   // x
        140,  // y
        60,   // width
        50,   // height
        color,
        strokeColor,
        strokeWidth,
        3     // rx
      );

    case 'hoodie':
      // Hoodie avec capuche (path plus complexe)
      return createPath(
        'body-clothing',
        'M70,140 L70,190 L130,190 L130,140 Q130,135 125,135 L120,135 L120,125 L80,125 L80,135 L75,135 Q70,135 70,140 Z',
        color,
        strokeColor,
        strokeWidth
      );

    case 'vest':
      // Vest (gilet sans manches, forme en V)
      return createPath(
        'body-clothing',
        'M75,140 L90,190 L110,190 L125,140 L120,140 L110,180 L90,180 L80,140 Z',
        color,
        strokeColor,
        strokeWidth
      );

    default:
      return generateClothing('tshirt', color);
  }
}
