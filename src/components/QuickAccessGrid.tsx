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
          className="card lift-card accent-palm rise-in group p-4 flex flex-col items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <div className="lift-badge w-11 h-11 bg-palm-light rounded-xl flex items-center justify-center text-palm transition-colors duration-300 group-hover:bg-palm group-hover:text-cream">
            {item.icon}
          </div>
          <span className="font-heading text-[16px] font-semibold text-forest leading-tight">{item.label}</span>
        </a>
      ))}
    </div>
  );
}
