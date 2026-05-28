import type { AppState, List } from "./types";
import { categorize } from "./categories";

const STORAGE_KEY = "shoplist:v1";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const seedLists = (): List[] => {
  const now = Date.now();
  const make = (title: string, items: string[]): List => ({
    id: uid(),
    title,
    groupByCategory: false,
    createdAt: now,
    items: items.map((name, i) => ({
      id: uid(),
      name,
      done: false,
      category: categorize(name),
      createdAt: now + i,
    })),
  });

  return [
    make("Weekly Groceries", ["Milk", "Bread", "Eggs", "Chicken", "Rice"]),
    make("IKEA Items", ["Bookshelf", "Storage box", "Lamp"]),
    make("BBQ Shopping", ["Sausages", "Buns", "Charcoal", "Beer", "Salad"]),
  ];
};

export const newId = uid;

export const loadState = (): AppState => {
  if (typeof window === "undefined") {
    const lists = seedLists();
    return { lists, currentListId: lists[0]?.id ?? null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const lists = seedLists();
      return { lists, currentListId: lists[0]?.id ?? null };
    }
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.lists || parsed.lists.length === 0) {
      return { lists: [], currentListId: null };
    }
    const currentExists = parsed.lists.some((l) => l.id === parsed.currentListId);
    return {
      lists: parsed.lists,
      currentListId: currentExists ? parsed.currentListId : parsed.lists[0].id,
    };
  } catch {
    const lists = seedLists();
    return { lists, currentListId: lists[0]?.id ?? null };
  }
};

export const saveState = (state: AppState): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private-mode errors
  }
};
