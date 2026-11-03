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
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className="card group p-4 flex flex-col items-start gap-3 hover:border-palm/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <div className="w-10 h-10 bg-palm-light rounded-xl flex items-center justify-center text-palm transition-colors group-hover:bg-palm group-hover:text-cream">
            {item.icon}
          </div>
          <span className="text-sm font-bold text-ink leading-tight">{item.label}</span>
        </a>
      ))}
    </div>
  );
}
