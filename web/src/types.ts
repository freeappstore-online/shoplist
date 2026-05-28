export type ItemId = string;
export type ListId = string;

export interface Item {
  id: ItemId;
  name: string;
  done: boolean;
  category: string;
  createdAt: number;
}

export interface List {
  id: ListId;
  title: string;
  items: Item[];
  groupByCategory: boolean;
  createdAt: number;
}

export interface AppState {
  lists: List[];
  currentListId: ListId | null;
}
