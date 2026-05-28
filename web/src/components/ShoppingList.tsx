import { useState } from "react";
import ListItem from "./ListItem";
import QuickAdd from "./QuickAdd";

interface ShoppingListProps {
  title: string;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ title }) => {
  const [items, setItems] = useState<string[]>([]);

  const addItems = (newItems: string[]) => {
    setItems([...items, ...newItems]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <QuickAdd onAdd={addItems} />
      <ul className="mt-4">
        {items.map((item, index) => (
          <ListItem key={index} name={item} onDelete={() => removeItem(index)} />
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
