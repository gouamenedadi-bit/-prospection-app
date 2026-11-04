// Recherche tolérante : sans accents, sans ponctuation, et rapprochement phonétique
// pour retrouver une commune mal entendue par la dictée (« Makori » → « Marcory »).

/** Minuscules, sans accents ni ponctuation, espaces simples. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Clé phonétique simple pour le français : « marcory », « makori », « markori » se ressemblent. */
function phonetic(text: string): string {
  return normalize(text)
    .replace(/\s+/g, "")
    .replace(/ph/g, "f")
    .replace(/qu/g, "k")
    .replace(/c([eiy])/g, "s$1")
    .replace(/[cq]/g, "k")
    .replace(/eau/g, "o")
    .replace(/au/g, "o")
    .replace(/ou/g, "u")
    .replace(/y/g, "i")
    .replace(/h/g, "")
    .replace(/(.)\1+/g, "$1");
}

function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/**
 * Le nom de lieu le plus proche de ce qui a été dit ou tapé, ou null si rien n'est assez proche.
 * Essaie la phrase entière puis chaque mot (« à Yopougon s'il vous plaît » → « Yopougon »).
 */
export function closestPlace(query: string, places: string[]): string | null {
  const words = normalize(query).split(" ").filter((w) => w.length >= 3);
  const attempts = [normalize(query), ...words].filter(Boolean);
  let best: { place: string; score: number } | null = null;

  for (const attempt of attempts) {
    const key = phonetic(attempt);
    if (key.length < 3) continue;
    for (const place of places) {
      const placeKey = phonetic(place);
      const dist = levenshtein(key, placeKey);
      const allowed = Math.max(1, Math.round(placeKey.length * 0.3));
      if (dist <= allowed) {
        const score = dist / placeKey.length;
        if (!best || score < best.score) best = { place, score };
      }
    }
  }
  return best?.place ?? null;
}
