"use client";

import React, { useEffect, useRef, useState } from "react";

export type ReorderItem = { id: string; label: string; icon: React.ReactNode };

const ROW_HEIGHT = 60;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function ReorderableList({
  items,
  onChange,
}: {
  items: ReorderItem[];
  onChange: (order: string[]) => void;
}) {
  const [localItems, setLocalItems] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef(0);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    setDraggingId(id);
    setDragY(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;
    const delta = e.clientY - startYRef.current;
    setDragY(delta);

    const currentIndex = localItems.findIndex((i) => i.id === draggingId);
    const targetIndex = clamp(currentIndex + Math.round(delta / ROW_HEIGHT), 0, localItems.length - 1);
    if (targetIndex !== currentIndex) {
      const next = [...localItems];
      const [moved] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, moved);
      setLocalItems(next);
      startYRef.current += (targetIndex - currentIndex) * ROW_HEIGHT;
      setDragY(e.clientY - startYRef.current);
    }
  };

  const handlePointerUp = () => {
    if (draggingId) {
      onChange(localItems.map((i) => i.id));
    }
    setDraggingId(null);
    setDragY(0);
  };

  return (
    <div className="space-y-1.5">
      {localItems.map((item) => {
        const isDragging = item.id === draggingId;
        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              transform: isDragging ? `translateY(${dragY}px) scale(1.02)` : undefined,
              zIndex: isDragging ? 10 : 1,
              touchAction: "none",
              height: ROW_HEIGHT - 8,
            }}
            className={`flex items-center gap-3 px-3 rounded-xl border select-none cursor-grab active:cursor-grabbing relative ${
              isDragging ? "bg-cream shadow-lg border-forest/30" : "bg-white border-line"
            }`}
          >
            <span className="text-forest">{item.icon}</span>
            <span className="flex-1 font-semibold text-sm text-ink">{item.label}</span>
            <svg className="w-5 h-5 text-ink-soft/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
          </div>
        );
      })}
    </div>
  );
}
