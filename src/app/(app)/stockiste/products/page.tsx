import { getProducts } from "@/app/actions/products";
import ProductsListClient from "./ProductsListClient";
import { PageHeader } from "@/components/ui";

// Toujours refléter les données en base (le catalogue peut être modifié
// directement en base ou via l'admin), plutôt que de rester figé sur le
// rendu statique généré au dernier build.
export const dynamic = "force-dynamic";

export default async function StockisteProducts() {
  const { data: productsList } = await getProducts();
  const products = (productsList || []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <PageHeader
        eyebrow={`Catalogue · ${products.length} produits`}
        title="Produits Longrich"
        lead="Points (PV), prix partenaire et prix public, et posologie de chaque produit."
      />
      <ProductsListClient products={products} />
    </div>
  );
}
