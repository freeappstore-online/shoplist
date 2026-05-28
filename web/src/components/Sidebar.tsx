import { useState } from "react";
import type { List, ListId } from "../types";

interface SidebarProps {
  lists: List[];
  currentListId: ListId | null;
  onSelect: (id: ListId) => void;
  onCreate: (title: string) => void;
  onDelete: (id: ListId) => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lists,
  currentListId,
  onSelect,
  onCreate,
  onDelete,
  onClose,
}) => {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    onCreate(title);
    setDraft("");
  };

  return (
    <aside className="flex h-full w-full flex-col bg-panel md:w-72 md:border-r md:border-line">
      <header className="flex items-center justify-between px-5 py-5">
        <div className="font-display text-2xl font-bold tracking-tight">ShopList</div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-paper md:hidden no-tap-highlight"
            aria-label="Close lists"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </header>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-2xl bg-paper px-3 py-2 ring-1 ring-line focus-within:ring-accent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="New list…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {draft.trim() && (
            <button
              type="button"
              onClick={submit}
              className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-white"
            >
              Add
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <ul className="flex flex-col gap-1">
          {lists.map((list) => {
            const isActive = list.id === currentListId;
            const remaining = list.items.filter((i) => !i.done).length;
            return (
              <li key={list.id}>
                <div
                  className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors no-tap-highlight ${
                    isActive ? "bg-paper shadow-sm" : "hover:bg-paper/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(list.id)}
                    className="flex flex-1 items-center justify-between text-left"
                  >
                    <span className={`truncate text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                      {list.title}
                    </span>
                    <span className="ml-2 shrink-0 rounded-full bg-panel px-2 py-0.5 text-[11px] font-medium text-muted">
                      {remaining}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${list.title}"?`)) onDelete(list.id);
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Delete ${list.title}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted hover:text-danger"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                  </button>
                </div>
              </li>
            );
          })}
          {lists.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">
              No lists yet. Add your first one above.
            </li>
          )}
        </ul>
      </nav>

      <footer className="border-t border-line px-5 py-3 text-[11px] text-muted">
        <div>Saved locally on this device</div>
        <div className="mt-1">
          Built for{" "}
          <a
            href="https://freeappstore.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            freeappstore.online
          </a>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;
