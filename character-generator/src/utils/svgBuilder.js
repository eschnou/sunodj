/**
 * Utilitaires pour construire des éléments SVG
 */

/**
 * Convertit un objet d'attributs en string
 */
function attributesToString(attrs) {
  if (!attrs) return '';

  return Object.entries(attrs)
    .map(([key, value]) => {
      // Convertir camelCase en kebab-case
      const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${attrName}="${value}"`;
    })
    .join(' ');
}

/**
 * Crée un élément SVG
 */
export function createElement(tag, attributes = {}, children = []) {
  const attrs = attributesToString(attributes);
  const attrsStr = attrs ? ' ' + attrs : '';

  if (children.length === 0) {
    return `<${tag}${attrsStr} />`;
  }

  const childrenStr = Array.isArray(children)
    ? children.join('\n')
    : children;

  return `<${tag}${attrsStr}>${childrenStr}</${tag}>`;
}

/**
 * Crée un groupe SVG
 */
export function createGroup(id, className, children = []) {
  return createElement('g', { id, class: className }, children);
}

/**
 * Crée une ellipse
 */
export function createEllipse(id, cx, cy, rx, ry, fill = '#000', stroke = '#000', strokeWidth = 2) {
  return createElement('ellipse', {
    id,
    cx,
    cy,
    rx,
    ry,
    fill,
    stroke,
    strokeWidth
  });
}

/**
 * Crée un cercle
 */
export function createCircle(id, cx, cy, r, fill = '#000', stroke = '#000', strokeWidth = 2) {
  return createElement('circle', {
    id,
    cx,
    cy,
    r,
    fill,
    stroke,
    strokeWidth
  });
}

/**
 * Crée un rectangle
 */
export function createRect(id, x, y, width, height, fill = '#000', stroke = '#000', strokeWidth = 2, rx = 0) {
  const attrs = { id, x, y, width, height, fill, stroke, strokeWidth };
  if (rx > 0) attrs.rx = rx;
  return createElement('rect', attrs);
}

/**
 * Crée une ligne
 */
export function createLine(id, x1, y1, x2, y2, stroke = '#000', strokeWidth = 2) {
  return createElement('line', {
    id,
    x1,
    y1,
    x2,
    y2,
    stroke,
    strokeWidth
  });
}

/**
 * Crée un path
 */
export function createPath(id, d, fill = 'none', stroke = '#000', strokeWidth = 2, opacity = 1) {
  const attrs = { id, d, fill, stroke, strokeWidth };
  if (opacity !== 1) attrs.opacity = opacity;
  return createElement('path', attrs);
}

/**
 * Convertit un objet SVG en string complet
 */
export function svgToString(svgContent) {
  return `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">\n${svgContent}\n</svg>`;
}

/**
 * Génère un ID unique
 */
let idCounter = 0;
export function generateId() {
  return `char-${Date.now()}-${idCounter++}`;
}
