/**
 * Génération du corps et des jambes (style South Park)
 */
import { createEllipse, createLine } from '../utils/svgBuilder.js';
import { strokeColor, strokeWidth } from '../data/colors.js';

/**
 * Génère la forme du corps (ellipse en forme de haricot)
 */
export function generateBodyShape(skinTone) {
  return createEllipse(
    'body-shape',
    100,  // cx
    160,  // cy
    35,   // rx
    45,   // ry
    skinTone,
    strokeColor,
    strokeWidth
  );
}

/**
 * Génère les jambes (simples lignes)
 */
export function generateLegs() {
  const leftLeg = createLine(
    'leg-left',
    90,   // x1
    200,  // y1
    85,   // x2
    240,  // y2
    strokeColor,
    strokeWidth
  );

  const rightLeg = createLine(
    'leg-right',
    110,  // x1
    200,  // y1
    115,  // x2
    240,  // y2
    strokeColor,
    strokeWidth
  );

  return { leftLeg, rightLeg };
}

/**
 * Génère les pieds (petits ovales noirs)
 */
export function generateFeet() {
  const leftFoot = createEllipse(
    'foot-left',
    85,  // cx
    245, // cy
    8,   // rx
    4,   // ry
    '#000000',
    strokeColor,
    strokeWidth
  );

  const rightFoot = createEllipse(
    'foot-right',
    115, // cx
    245, // cy
    8,   // rx
    4,   // ry
    '#000000',
    strokeColor,
    strokeWidth
  );

  return { leftFoot, rightFoot };
}
