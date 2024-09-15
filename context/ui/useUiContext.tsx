"use client"
import { createContext, useContext, useState } from 'react';


type UIContext = {
    sidemenuOpen: boolean;
    // methods
    openSideMenu: () => void;
    closeSideMenu: () => void;
    isDragging: boolean;
    startDragging: () => void;
    endDragging: () => void;
}
    
  //  with initial undefined value
export const UiContext = createContext<UIContext | undefined>(undefined);
  

// Hook to use MetaDataContext
export const useUiContext = () => {
    const context = useContext(UiContext);
    if (!context) {
      throw new Error('useMetaData must be used within a MetaDataProvider');
    }
    return context;
  };

// Create a provider component
export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidemenuOpen, setSidemenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const openSideMenu = () => setSidemenuOpen(true);
  const closeSideMenu = () => setSidemenuOpen(false);
  const startDragging = () => setIsDragging(true);
  const endDragging = () => setIsDragging(false);

  return (
    <UiContext.Provider value={{
        sidemenuOpen,
        openSideMenu,
        closeSideMenu,
        isDragging,
        startDragging,
        endDragging,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
