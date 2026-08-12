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
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:bg-cream transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 group"
        >
          <div className="w-12 h-12 bg-palm-light rounded-full flex items-center justify-center text-palm mb-2 transition-transform duration-300 group-hover:scale-110">
            {item.icon}
          </div>
          <span className="text-sm font-bold text-ink">{item.label}</span>
        </a>
      ))}
    </div>
  );
}
