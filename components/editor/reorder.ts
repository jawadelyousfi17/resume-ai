"use client";

// Drag-to-reorder, shared by the entries inside a section and the sections
// themselves.
//
// The list owner keeps owning the move — this only tracks which row is being
// dragged and hands each row the props that make it draggable. Reordering
// happens on drag-enter rather than on drop, so the list rearranges under the
// cursor and what you see while dragging is the result.

import { useState } from "react";

export type DragProps = {
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragEnter: () => void;
  onNudge: (delta: number) => void;
};

export function useListDrag(
  ids: string[],
  move: (from: string, to: string) => void,
) {
  const [dragId, setDragId] = useState<string | null>(null);

  return (id: string): DragProps => ({
    dragging: dragId === id,
    onDragStart: () => setDragId(id),
    onDragEnd: () => setDragId(null),
    onDragEnter: () => {
      if (dragId && dragId !== id) move(dragId, id);
    },
    // Keyboard equivalent of a drag: swap with the neighbour one slot away.
    onNudge: (delta: number) => {
      const target = ids[ids.indexOf(id) + delta];
      if (target) move(id, target);
    },
  });
}
