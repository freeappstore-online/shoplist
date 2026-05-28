import { useState } from "react";
import { Shell } from "./components/Shell";
import ShoppingList from "./components/ShoppingList";

export default function App() {
  const [lists, setLists] = useState<string[]>(["Weekly Groceries", "IKEA Items", "BBQ Shopping"]);
  const [currentList, setCurrentList] = useState<string | null>(lists[0]);

  return (
    <Shell>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 sticky top-0 bg-paper p-4 w-full text-center" style={{ fontFamily: "Fraunces, serif" }}>
          {currentList || "Select a List"}
        </h1>
        <div className="w-full max-w-2xl">
          {lists.map((list) => (
            <button
              key={list}
              className="w-full p-2 text-left border-b border-line"
              onClick={() => setCurrentList(list)}
            >
              {list}
            </button>
          ))}
        </div>
        {currentList && <ShoppingList title={currentList} />}
      </div>
    </Shell>
  );
}
