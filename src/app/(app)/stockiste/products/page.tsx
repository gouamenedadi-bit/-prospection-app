import { getProducts } from "@/app/actions/products";
import ProductsListClient from "./ProductsListClient";

// Toujours refléter les données en base (le catalogue peut être modifié
// directement en base ou via l'admin), plutôt que de rester figé sur le
// rendu statique généré au dernier build.
export const dynamic = "force-dynamic";

export default async function StockisteProducts() {
  const { data: productsList } = await getProducts();
  const products = (productsList || []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-center shadow-md mb-6">
        <h2 className="text-2xl font-bold text-white font-heading">Catalogue des Produits</h2>
        <p className="text-sm text-white/90 mt-2">Découvrez les PV, les prix partenaires et publics, ainsi que la posologie de chaque produit.</p>
      </div>

      <ProductsListClient products={products} />
    </div>
  );
}
