import { useState } from "react";

interface ListItemProps {
  name: string;
  onDelete: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ name, onDelete }) => {
  const [checked, setChecked] = useState(false);

  return (
    <li className={`flex items-center justify-between p-2 border-b border-line ${checked ? 'text-muted' : ''}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="mr-2"
        />
        <span className={checked ? "line-through" : ""}>{name}</span>
      </div>
      <button onClick={onDelete} className="text-red-500">Delete</button>
    </li>
  );
};

export default ListItem;
