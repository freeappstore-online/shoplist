import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_ORDER } from "../categories";
import type { Item, List } from "../types";
import ItemRow from "./ListItem";
import QuickAdd from "./QuickAdd";

interface ListViewProps {
  list: List;
  onMenu: () => void;
  onRename: (title: string) => void;
  onAddItems: (names: string[]) => void;
  onToggleItem: (itemId: string) => void;
  onEditItem: (itemId: string, name: string) => void;
  onDeleteItem: (itemId: string) => void;
  onClearCompleted: () => void;
  onToggleGrouping: () => void;
}

interface Group {
  label: string;
  items: Item[];
}

const partition = (items: Item[]): { open: Item[]; done: Item[] } => ({
  open: items.filter((i) => !i.done),
  done: items.filter((i) => i.done),
});

const groupByCategory = (items: Item[]): Group[] => {
  const buckets = new Map<string, Item[]>();
  for (const item of items) {
    const arr = buckets.get(item.category) ?? [];
    arr.push(item);
    buckets.set(item.category, arr);
  }
  return CATEGORY_ORDER.filter((c) => buckets.has(c)).map((c) => ({
    label: c,
    items: buckets.get(c)!,
  }));
};

export const ListView: React.FC<ListViewProps> = ({
  list,
  onMenu,
  onRename,
  onAddItems,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onClearCompleted,
  onToggleGrouping,
}) => {
  const [titleDraft, setTitleDraft] = useState(list.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTitleDraft(list.title);
  }, [list.id, list.title]);

  useEffect(() => {
    if (editingTitle) {
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  }, [editingTitle]);

  const { open, done } = useMemo(() => partition(list.items), [list.items]);

  const openGroups = useMemo<Group[] | null>(
    () => (list.groupByCategory ? groupByCategory(open) : null),
    [list.groupByCategory, open],
  );

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== list.title) onRename(next);
    else setTitleDraft(list.title);
    setEditingTitle(false);
  };

  const totalCount = list.items.length;
  const doneCount = done.length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
        <div className="flex items-center justify-between px-4 pt-3 md:px-8">
          <button
            type="button"
            onClick={onMenu}
            className="-ml-2 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-panel md:hidden no-tap-highlight"
          >
            <span className="inline-flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              Lists
            </span>
          </button>
          <div className="text-xs text-muted">
            {totalCount === 0
              ? "Empty"
              : `${totalCount - doneCount} of ${totalCount} left`}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleGrouping}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors no-tap-highlight ${
                list.groupByCategory
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-panel"
              }`}
              aria-pressed={list.groupByCategory}
            >
              Categories
            </button>
            {doneCount > 0 && (
              <button
                type="button"
                onClick={onClearCompleted}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted hover:bg-panel no-tap-highlight"
              >
                Clear done
              </button>
            )}
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 md:px-8">
          {editingTitle ? (
            <input
              ref={titleRef}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                if (e.key === "Escape") {
                  setTitleDraft(list.title);
                  setEditingTitle(false);
                }
              }}
              className="w-full bg-transparent font-display text-4xl font-bold uppercase tracking-tight outline-none md:text-5xl"
              maxLength={80}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingTitle(true)}
              className="block w-full text-left font-display text-4xl font-bold uppercase tracking-tight md:text-5xl no-tap-highlight"
              title="Tap to rename"
            >
              {list.title}
            </button>
          )}
        </div>
      </header>

      <div className="px-4 pt-4 md:px-8">
        <QuickAdd onAdd={onAddItems} />
      </div>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pb-24">
        {list.items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="font-display text-xl font-semibold">Empty list</div>
            <p className="mt-1 text-sm text-muted">
              Use Quick Add above. Separate items with commas.
            </p>
          </div>
        ) : (
          <>
            {openGroups ? (
              openGroups.map((group) => (
                <section key={group.label} className="mt-4">
                  <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted md:px-8">
                    {group.label}
                  </h3>
                  <ul className="border-y border-line">
                    {group.items.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        onToggle={() => onToggleItem(item.id)}
                        onEdit={(name) => onEditItem(item.id, name)}
                        onDelete={() => onDeleteItem(item.id)}
                      />
                    ))}
                  </ul>
                </section>
              ))
            ) : (
              <ul className="border-y border-line">
                {open.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onToggle={() => onToggleItem(item.id)}
                    onEdit={(name) => onEditItem(item.id, name)}
                    onDelete={() => onDeleteItem(item.id)}
                  />
                ))}
              </ul>
            )}

            {done.length > 0 && (
              <section className="mt-6">
                <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted md:px-8">
                  Done · {done.length}
                </h3>
                <ul className="border-y border-line opacity-60">
                  {done.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggle={() => onToggleItem(item.id)}
                      onEdit={(name) => onEditItem(item.id, name)}
                      onDelete={() => onDeleteItem(item.id)}
                    />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListView;
