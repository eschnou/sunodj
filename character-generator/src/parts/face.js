/**
 * Génération des éléments du visage (yeux, bouche)
 */
import { createCircle, createPath } from '../utils/svgBuilder.js';
import { strokeColor, strokeWidth } from '../data/colors.js';

/**
 * Types d'yeux disponibles
 */
export const eyeTypes = ['normal', 'happy', 'surprised'];

/**
 * Types de bouches disponibles
 */
export const mouthTypes = ['neutral', 'smile', 'sad', 'open'];

/**
 * Génère les yeux selon le type
 */
export function generateEyes(type) {
  switch (type) {
    case 'normal':
      return {
        leftEye: createCircle('eye-left', 85, 75, 3, '#000000', '#000000', 0),
        rightEye: createCircle('eye-right', 115, 75, 3, '#000000', '#000000', 0)
      };

    case 'happy':
      // Yeux en forme d'arc (sourire)
      return {
        leftEye: createPath(
          'eye-left',
          'M80,75 Q85,70 90,75',
          'none',
          '#000000',
          strokeWidth
        ),
        rightEye: createPath(
          'eye-right',
          'M110,75 Q115,70 120,75',
          'none',
          '#000000',
          strokeWidth
        )
      };

    case 'surprised':
      // Yeux larges
      return {
        leftEye: createCircle('eye-left', 85, 75, 5, '#000000', '#000000', 0),
        rightEye: createCircle('eye-right', 115, 75, 5, '#000000', '#000000', 0)
      };

    default:
      return generateEyes('normal');
  }
}

/**
 * Génère la bouche selon le type
 */
export function generateMouth(type) {
  switch (type) {
    case 'neutral':
      return createPath(
        'mouth',
        'M85,95 Q100,95 115,95',
        'none',
        '#000000',
        strokeWidth
      );

    case 'smile':
      return createPath(
        'mouth',
        'M85,95 Q100,105 115,95',
        'none',
        '#000000',
        strokeWidth
      );

    case 'sad':
      return createPath(
        'mouth',
        'M85,100 Q100,90 115,100',
        'none',
        '#000000',
        strokeWidth
      );

    case 'open':
      return createPath(
        'mouth',
        'M90,95 Q100,105 110,95 Q100,100 90,95',
        '#000000',
        '#000000',
        strokeWidth
      );

    default:
      return generateMouth('neutral');
  }
}
