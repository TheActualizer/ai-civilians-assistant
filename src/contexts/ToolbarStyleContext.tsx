import { createContext, useContext, useState, ReactNode } from 'react';

type ToolbarStyle = 'modern' | 'classic';

interface ToolbarStyleContextType {
  style: ToolbarStyle;
  toggleStyle: () => void;
}

const ToolbarStyleContext = createContext<ToolbarStyleContextType | undefined>(undefined);

export function ToolbarStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<ToolbarStyle>('modern');

  const toggleStyle = () => {
    setStyle(prev => prev === 'modern' ? 'classic' : 'modern');
  };

  return (
    <ToolbarStyleContext.Provider value={{ style, toggleStyle }}>
      {children}
    </ToolbarStyleContext.Provider>
  );
}

export function useToolbarStyle() {
  const context = useContext(ToolbarStyleContext);
  if (context === undefined) {
    throw new Error('useToolbarStyle must be used within a ToolbarStyleProvider');
  }
  return context;
}