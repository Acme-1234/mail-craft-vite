
// This file is more of a conceptual placeholder for a more complex DND setup.
// For the current implementation with @dnd-kit/core, this specific provider might not be strictly necessary
// unless we need to share very specific DND states or utilities across many components
// outside of what DndContext itself provides.
//
// Given the current scope, we'll use DndContext directly in EmailEditor.tsx.
// This file can be removed or expanded later if DND logic becomes more complex and distributed.

import React, { createContext, useContext, useState } from 'react';
import type { DraggableItem } from '@/lib/types';

interface FriendlyDndContextType {
  activeItem: DraggableItem | null;
  setActiveItem: (item: DraggableItem | null) => void;
}

const FriendlyDndContext = createContext<FriendlyDndContextType | undefined>(undefined);

export const useFriendlyDnd = () => {
  const context = useContext(FriendlyDndContext);
  if (!context) {
    throw new Error('useFriendlyDnd must be used within a FriendlyDndProvider');
  }
  return context;
};

export const FriendlyDndProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeItem, setActiveItem] = useState<DraggableItem | null>(null);

  return (
    <FriendlyDndContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </FriendlyDndContext.Provider>
  );
};

// Alias for clarity if this provider name is preferred in other files
export const DragDropProvider = FriendlyDndProvider;
