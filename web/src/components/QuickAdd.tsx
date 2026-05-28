import { useRef, useState } from "react";

interface QuickAddProps {
  onAdd: (items: string[]) => void;
}

const splitItems = (raw: string): string[] =>
  raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

export const QuickAdd: React.FC<QuickAddProps> = ({ onAdd }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const items = splitItems(input);
    if (items.length === 0) return;
    onAdd(items);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-panel px-3 py-2 ring-1 ring-line focus-within:ring-accent">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Add items — e.g. milk, eggs, bread"
        className="flex-1 bg-transparent py-1 text-base outline-none placeholder:text-muted"
        autoComplete="off"
        inputMode="text"
      />
      {input.trim() && (
        <button
          type="button"
          onClick={submit}
          className="rounded-xl bg-accent px-3.5 py-1.5 text-sm font-semibold text-white"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default QuickAdd;
