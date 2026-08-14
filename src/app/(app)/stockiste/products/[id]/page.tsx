import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/app/actions/products";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getProductById(Number(id));

  if (!res.success || !res.data) {
    notFound();
  }

  const product = res.data;

  return (
    <div className="space-y-4 pb-8">
      <Link href="/stockiste/products" className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-deep">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Retour au catalogue
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start gap-3">
            <h1 className="text-xl font-black text-gray-900 leading-tight">{product.name}</h1>
            {product.pv != null && (
              <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                {product.pv} PV
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Partenaire</span>
              <span className="text-lg font-black text-green-700 tracking-wide">{product.partnerPrice} F</span>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Non Partenaire</span>
              <span className="text-lg font-black text-gray-700 tracking-wide">{product.publicPrice} F</span>
            </div>
          </div>

          {product.posology && (
            <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
              <span className="text-xs text-blue-600 uppercase font-bold block mb-1">Posologie / Utilisation</span>
              <p className="text-sm text-gray-800 font-bold leading-relaxed">{product.posology}</p>
            </div>
          )}

          {product.description && (
            <div>
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Description</span>
              <p className="text-sm text-gray-800 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
