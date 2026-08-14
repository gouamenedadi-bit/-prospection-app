"use client";

import { useState } from "react";

export default function ExpandableText({
  text,
  maxLength = 120,
  className = "",
}: {
  text?: string | null;
  maxLength?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > maxLength;
  const preview = isLong ? text.slice(0, maxLength).trimEnd() + "…" : text;

  return (
    <span className={className}>
      {expanded || !isLong ? text : preview}
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="ml-1.5 text-forest font-bold underline whitespace-nowrap"
        >
          {expanded ? "− Voir moins" : "+ Voir plus"}
        </button>
      )}
    </span>
  );
}
