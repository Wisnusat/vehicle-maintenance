"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type GlobalStateContextType = {
  method: string;
  changeMethod: (type: string) => void;
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

type GlobalStateProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY = 'vehicle_maintenance_method';

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [method, setMethod] = useState<string>("maintenance");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMethod = sessionStorage.getItem(STORAGE_KEY);
      if (savedMethod) {
        setMethod(savedMethod);
      }
      setIsLoaded(true);
    }
  }, []);

  const changeMethod = (type: string) => {
    setMethod(type);
    // Save to sessionStorage for persistence across navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, type);
    }
  };

  // Don't render children until we've loaded the state from sessionStorage
  if (!isLoaded) {
    return null;
  }

  return (
    <GlobalStateContext.Provider value={{ method, changeMethod }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
