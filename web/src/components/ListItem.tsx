import { useEffect, useRef, useState } from "react";
import type { Item } from "../types";

interface ItemRowProps {
  item: Item;
  onToggle: () => void;
  onEdit: (name: string) => void;
  onDelete: () => void;
}

const REVEAL_PX = 88;
const DELETE_PX = 140;

export const ItemRow: React.FC<ItemRowProps> = ({ item, onToggle, onEdit, onDelete }) => {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const startX = useRef<number | null>(null);
  const startOffset = useRef(0);
  const axis = useRef<"x" | "y" | null>(null);

  useEffect(() => {
    setDraft(item.name);
  }, [item.name]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (editing) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    startOffset.current = offset;
    axis.current = null;
    setDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (axis.current === null) {
      if (Math.abs(dx) > 6) axis.current = "x";
      else return;
    }
    const next = Math.min(0, Math.max(-DELETE_PX - 40, startOffset.current + dx));
    setOffset(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (offset <= -DELETE_PX) {
      onDelete();
      return;
    }
    setOffset(offset <= -REVEAL_PX / 2 ? -REVEAL_PX : 0);
    startX.current = null;
    axis.current = null;
  };

  const commitEdit = () => {
    const next = draft.trim();
    if (next && next !== item.name) onEdit(next);
    else setDraft(item.name);
    setEditing(false);
  };

  return (
    <li
      className={`relative overflow-hidden border-b border-line bg-paper ${
        item.done ? "" : ""
      }`}
    >
      <button
        type="button"
        onClick={onDelete}
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-5 bg-danger text-sm font-semibold text-white"
        style={{ width: REVEAL_PX }}
        tabIndex={offset === 0 ? -1 : 0}
        aria-label={`Delete ${item.name}`}
      >
        Delete
      </button>

      <div
        className="relative flex items-center gap-3 px-4 py-3 no-tap-highlight"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? "none" : "transform 180ms ease",
          backgroundColor: "var(--color-paper)",
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            item.done
              ? "border-accent bg-accent text-white"
              : "border-line bg-paper text-transparent"
          }`}
          aria-label={item.done ? "Mark not done" : "Mark done"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </button>

        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") {
                setDraft(item.name);
                setEditing(false);
              }
            }}
            className="flex-1 bg-transparent text-base outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              if (offset !== 0) {
                setOffset(0);
                return;
              }
              setEditing(true);
            }}
            className={`flex-1 text-left text-base ${
              item.done ? "text-muted line-through" : ""
            }`}
          >
            {item.name}
          </button>
        )}

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-panel hover:text-danger no-tap-highlight"
          aria-label={`Delete ${item.name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </li>
  );
};

export default ItemRow;
