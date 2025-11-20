/**
 * Générateur pseudo-aléatoire avec seed pour reproductibilité
 */
export class SeededRandom {
  constructor(seed) {
    if (seed === null || seed === undefined) {
      this.seed = Math.random() * 2147483647;
    } else {
      this.seed = this.hashString(seed.toString());
    }
    this.current = this.seed;
  }

  /**
   * Convertit une string en nombre pour le seed
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Génère le prochain nombre aléatoire (0-1)
   */
  next() {
    // Algorithme LCG (Linear Congruential Generator)
    this.current = (this.current * 1664525 + 1013904223) % 4294967296;
    return this.current / 4294967296;
  }

  /**
   * Génère un entier aléatoire entre 0 et max-1
   */
  nextInt(max) {
    return Math.floor(this.next() * max);
  }

  /**
   * Sélectionne un élément aléatoire dans un tableau
   */
  choice(array) {
    return array[this.nextInt(array.length)];
  }
}

/**
 * Crée une fonction random compatible avec Math.random()
 */
export function createSeededRandom(seed) {
  const rng = new SeededRandom(seed);
  return {
    random: () => rng.next(),
    nextInt: (max) => rng.nextInt(max),
    choice: (array) => rng.choice(array)
  };
}
