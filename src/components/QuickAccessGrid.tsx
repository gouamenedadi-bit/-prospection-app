"use client";

import { useEffect, useState } from "react";
import { QUICK_ACCESS_DEFAULT_ORDER, loadQuickAccessOrder, orderedQuickAccessItems } from "@/lib/quickAccess";

export default function QuickAccessGrid() {
  const [order, setOrder] = useState<string[]>(QUICK_ACCESS_DEFAULT_ORDER);

  useEffect(() => {
    setOrder(loadQuickAccessOrder());
  }, []);

  const items = orderedQuickAccessItems(order);

  return (
    <div className="grid grid-cols-2 desk:grid-cols-3 gap-3 desk:gap-4">
      {items.map((item, i) => (
        <a
          key={item.id}
          href={item.href}
          style={{ ["--i" as string]: i } as React.CSSProperties}
          className="card lift-card accent-palm rise-in group px-4 py-6 flex flex-col items-center justify-center text-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <div className="lift-badge w-14 h-14 bg-palm-light rounded-2xl [&_svg]:w-7 [&_svg]:h-7 flex items-center justify-center text-palm transition-colors duration-300 group-hover:bg-palm group-hover:text-cream">
            {item.icon}
          </div>
          <span className="font-heading text-[16px] font-semibold text-forest leading-tight text-balance">{item.label}</span>
        </a>
      ))}
    </div>
  );
}
