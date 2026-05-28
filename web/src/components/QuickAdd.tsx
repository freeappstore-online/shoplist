import { useState } from "react";

interface QuickAddProps {
  onAdd: (items: string[]) => void;
}

const QuickAdd: React.FC<QuickAddProps> = ({ onAdd }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const items = input.split(",").map(item => item.trim()).filter(item => item);
    onAdd(items);
    setInput("");
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border-b border-line p-2 mr-2"
        placeholder="Add items separated by commas"
      />
      <button onClick={handleAdd} className="bg-accent text-white p-2 rounded-md">Add</button>
    </div>
  );
};

export default QuickAdd;
