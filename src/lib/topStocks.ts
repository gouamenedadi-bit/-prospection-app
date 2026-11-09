export type StockRow = {
  quantity: number;
  stockisteId: number;
  produit: { id: number; name: string; image: string | null };
  stockiste: { name: string; phone: string; city: string; commune: string; neighborhood: string | null };
};

/**
 * Pour chaque produit, garde uniquement le stockiste qui en a le plus.
 * À quantité égale, le stockiste inscrit le premier passe devant.
 */
export function pickTopStocks(rows: StockRow[]) {
  const top = new Map<number, StockRow>();
  for (const row of rows) {
    if (row.quantity <= 0) continue;
    const best = top.get(row.produit.id);
    if (!best || row.quantity > best.quantity || (row.quantity === best.quantity && row.stockisteId < best.stockisteId)) {
      top.set(row.produit.id, row);
    }
  }

  return [...top.values()]
    .map((row) => ({
      productId: row.produit.id,
      productName: row.produit.name,
      image: row.produit.image,
      quantity: row.quantity,
      stockisteName: row.stockiste.name,
      phone: row.stockiste.phone,
      city: row.stockiste.city,
      commune: row.stockiste.commune,
      neighborhood: row.stockiste.neighborhood,
    }))
    .sort((a, b) => a.productName.localeCompare(b.productName, "fr"));
}
