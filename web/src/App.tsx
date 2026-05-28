import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import ListView from "./components/ShoppingList";
import { categorize } from "./categories";
import { loadState, newId, saveState } from "./storage";
import type { AppState, Item, List, ListId } from "./types";

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentList = useMemo<List | null>(
    () => state.lists.find((l) => l.id === state.currentListId) ?? null,
    [state],
  );

  const updateList = useCallback(
    (id: ListId, updater: (list: List) => List) => {
      setState((s) => ({
        ...s,
        lists: s.lists.map((l) => (l.id === id ? updater(l) : l)),
      }));
    },
    [],
  );

  const selectList = useCallback((id: ListId) => {
    setState((s) => ({ ...s, currentListId: id }));
    setSidebarOpen(false);
  }, []);

  const createList = useCallback((title: string) => {
    const list: List = {
      id: newId(),
      title,
      items: [],
      groupByCategory: false,
      createdAt: Date.now(),
    };
    setState((s) => ({ lists: [list, ...s.lists], currentListId: list.id }));
    setSidebarOpen(false);
  }, []);

  const deleteList = useCallback((id: ListId) => {
    setState((s) => {
      const lists = s.lists.filter((l) => l.id !== id);
      const currentListId =
        s.currentListId === id ? (lists[0]?.id ?? null) : s.currentListId;
      return { lists, currentListId };
    });
  }, []);

  const renameList = useCallback(
    (id: ListId, title: string) => {
      updateList(id, (l) => ({ ...l, title }));
    },
    [updateList],
  );

  const addItems = useCallback(
    (id: ListId, names: string[]) => {
      if (names.length === 0) return;
      const now = Date.now();
      const newItems: Item[] = names.map((name, i) => ({
        id: newId(),
        name,
        done: false,
        category: categorize(name),
        createdAt: now + i,
      }));
      updateList(id, (l) => ({ ...l, items: [...l.items, ...newItems] }));
    },
    [updateList],
  );

  const toggleItem = useCallback(
    (id: ListId, itemId: string) => {
      updateList(id, (l) => ({
        ...l,
        items: l.items.map((it) =>
          it.id === itemId ? { ...it, done: !it.done } : it,
        ),
      }));
    },
    [updateList],
  );

  const editItem = useCallback(
    (id: ListId, itemId: string, name: string) => {
      updateList(id, (l) => ({
        ...l,
        items: l.items.map((it) =>
          it.id === itemId
            ? { ...it, name, category: categorize(name) }
            : it,
        ),
      }));
    },
    [updateList],
  );

  const deleteItem = useCallback(
    (id: ListId, itemId: string) => {
      updateList(id, (l) => ({
        ...l,
        items: l.items.filter((it) => it.id !== itemId),
      }));
    },
    [updateList],
  );

  const clearCompleted = useCallback(
    (id: ListId) => {
      updateList(id, (l) => ({ ...l, items: l.items.filter((it) => !it.done) }));
    },
    [updateList],
  );

  const toggleGrouping = useCallback(
    (id: ListId) => {
      updateList(id, (l) => ({ ...l, groupByCategory: !l.groupByCategory }));
    },
    [updateList],
  );

  return (
    <div className="flex h-full w-full bg-paper text-ink">
      <div className="hidden md:flex">
        <Sidebar
          lists={state.lists}
          currentListId={state.currentListId}
          onSelect={selectList}
          onCreate={createList}
          onDelete={deleteList}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm shadow-xl">
            <Sidebar
              lists={state.lists}
              currentListId={state.currentListId}
              onSelect={selectList}
              onCreate={createList}
              onDelete={deleteList}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="relative flex h-full min-w-0 flex-1 flex-col">
        {currentList ? (
          <ListView
            list={currentList}
            onMenu={() => setSidebarOpen(true)}
            onRename={(title) => renameList(currentList.id, title)}
            onAddItems={(names) => addItems(currentList.id, names)}
            onToggleItem={(itemId) => toggleItem(currentList.id, itemId)}
            onEditItem={(itemId, name) => editItem(currentList.id, itemId, name)}
            onDeleteItem={(itemId) => deleteItem(currentList.id, itemId)}
            onClearCompleted={() => clearCompleted(currentList.id)}
            onToggleGrouping={() => toggleGrouping(currentList.id)}
          />
        ) : (
          <EmptyState onCreate={createList} onMenu={() => setSidebarOpen(true)} />
        )}
      </main>
    </div>
  );
}

const EmptyState: React.FC<{
  onCreate: (title: string) => void;
  onMenu: () => void;
}> = ({ onCreate, onMenu }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center justify-between px-5 py-4 md:hidden">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-xl bg-panel px-3 py-2 text-sm font-medium no-tap-highlight"
      >
        Lists
      </button>
      <div className="font-display text-lg font-bold">ShopList</div>
      <span className="w-12" />
    </div>
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-3xl font-bold">No list yet</div>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Create a list to get started — Weekly Groceries, BBQ Shopping, anything.
      </p>
      <button
        type="button"
        onClick={() => onCreate("My List")}
        className="mt-6 rounded-2xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
      >
        New List
      </button>
    </div>
  </div>
);
