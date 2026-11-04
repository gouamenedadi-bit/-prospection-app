import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/app/actions/products";

export const dynamic = "force-dynamic";

const fcfa = (n: unknown) => (Number(n) || 0).toLocaleString("fr-FR");

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const res = await getProductById(Number(id));

  if (!res.success || !res.data) {
    notFound();
  }

  const product = res.data;
  const backHref = from === "health" ? "/health" : "/stockiste/products";
  const backLabel = from === "health" ? "Soins & bien-être" : "Catalogue";
  const saving = (Number(product.publicPrice) || 0) - (Number(product.partnerPrice) || 0);

  return (
    <div className="space-y-4 pb-4">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-forest rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        {backLabel}
      </Link>

      <article className="card overflow-hidden rise-in desk:grid desk:grid-cols-2 desk:items-stretch">
        <div className="w-full aspect-[4/3] desk:aspect-auto desk:min-h-[420px] bg-cream flex items-center justify-center p-4 desk:p-8">
          {product.image ? (
            <img src={product.image} alt={product.name} className="pop-in w-full h-full object-contain" />
          ) : (
            <svg className="w-14 h-14 text-ink-soft/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          )}
        </div>

        <div className="p-5 desk:p-7 space-y-5">
          <div className="unfold" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
            {product.pv != null && (
              <span className="pv-stamp mb-2">{Number(product.pv).toLocaleString("fr-FR")}<span className="text-[11px] tracking-wider">PV</span></span>
            )}
            <h1 className="font-heading text-[24px] text-ink leading-tight">{product.name}</h1>
          </div>

          <div className="unfold grid grid-cols-2 rounded-xl border border-line overflow-hidden" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
            <div className="px-4 py-3 bg-palm-light/60">
              <span className="block text-[13px] font-semibold text-palm">Prix partenaire</span>
              <span className="font-mono text-xl font-semibold text-forest tabular-nums">{fcfa(product.partnerPrice)} <span className="text-xs font-normal">F</span></span>
            </div>
            <div className="px-4 py-3 border-l border-line">
              <span className="block text-[13px] font-semibold text-ink-soft">Prix public</span>
              <span className="font-mono text-xl font-semibold text-ink tabular-nums">{fcfa(product.publicPrice)} <span className="text-xs font-normal">F</span></span>
            </div>
          </div>
          {saving > 0 && (
            <p className="text-xs text-ink-soft -mt-3">
              Un partenaire économise <span className="font-mono font-semibold text-forest">{fcfa(saving)} F</span> sur ce produit.
            </p>
          )}

          {product.posology && (
            <div className="note unfold" style={{ ["--i" as string]: 3 } as React.CSSProperties}>
              <span className="note-label">Posologie / utilisation</span>
              <p className="text-sm text-ink leading-relaxed">{product.posology}</p>
            </div>
          )}

          {product.description && (
            <div className="unfold" style={{ ["--i" as string]: 4 } as React.CSSProperties}>
              <h2 className="text-xs font-semibold text-ink-soft mb-1.5">Description et indications</h2>
              <p className="text-sm text-ink leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
