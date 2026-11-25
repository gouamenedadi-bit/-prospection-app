import { normalize } from "@/lib/fuzzy";
import { realCommune } from "@/lib/places";

export type StockRow = {
  quantity: number;
  stockisteId: number;
  produit: { id: number; name: string; image: string | null };
  stockiste: { name: string; phone: string; city: string; commune: string; neighborhood: string | null };
};

/** Lieu de la personne qui cherche (celui de son compte). */
export type Place = { city: string | null; commune: string | null };

const same = (a?: string | null, b?: string | null) => !!a && !!b && normalize(a) === normalize(b);

/** 0 : même commune, 1 : même ville, 2 : ailleurs (ou lieu inconnu). « Autre » ne compte pas comme commune. */
export function closeness(me: Place | null, st: { city: string; commune: string }): 0 | 1 | 2 {
  if (!me || !same(me.city, st.city)) return 2;
  return same(realCommune(me.commune), realCommune(st.commune)) ? 0 : 1;
}

/**
 * Pour chaque produit, un seul stockiste : le plus proche de la personne qui cherche
 * (sa commune, sinon sa ville), sinon celui qui en a le plus. À égalité de distance,
 * le plus gros stock passe devant, puis le stockiste inscrit le premier.
 * `excludeStockisteId` : un stockiste qui cherche ne se voit pas lui-même.
 */
export function pickTopStocks(rows: StockRow[], me: Place | null = null, excludeStockisteId: number | null = null) {
  const top = new Map<number, { row: StockRow; level: 0 | 1 | 2 }>();
  for (const row of rows) {
    if (row.quantity <= 0 || row.stockisteId === excludeStockisteId) continue;
    const level = closeness(me, row.stockiste);
    const best = top.get(row.produit.id);
    const better =
      !best ||
      level < best.level ||
      (level === best.level &&
        (row.quantity > best.row.quantity || (row.quantity === best.row.quantity && row.stockisteId < best.row.stockisteId)));
    if (better) top.set(row.produit.id, { row, level });
  }

  return [...top.values()]
    .map(({ row, level }) => ({
      productId: row.produit.id,
      productName: row.produit.name,
      image: row.produit.image,
      quantity: row.quantity,
      stockisteName: row.stockiste.name,
      phone: row.stockiste.phone,
      city: row.stockiste.city,
      commune: row.stockiste.commune,
      neighborhood: row.stockiste.neighborhood,
      nearby: level === 0 ? ("commune" as const) : level === 1 ? ("ville" as const) : null,
    }))
    .sort((a, b) => a.productName.localeCompare(b.productName, "fr"));
}
