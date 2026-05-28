import { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="p-6 font-bold text-lg" style={{ fontFamily: "Fraunces, serif" }}>
        ShopList
      </div>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>
      <footer className="p-4 text-center border-t border-line" style={{ fontFamily: "Manrope, sans-serif" }}>
        <a href="https://freeappstore.online" target="_blank" rel="noopener noreferrer">
          FreeAppStore
        </a>
      </footer>
    </div>
  );
};
