"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type GlobalStateContextType = {
  method: string;
  changeMethod: (type: string) => void;
  vehicleType: string;
  changeVehicleType: (type: string) => void;
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

type GlobalStateProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY_METHOD = 'vehicle_maintenance_method';
const STORAGE_KEY_VEHICLE_TYPE = 'vehicle_maintenance_vehicle_type';

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [method, setMethod] = useState<string>("maintenance");
  const [vehicleType, setVehicleType] = useState<string>("towing");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMethod = sessionStorage.getItem(STORAGE_KEY_METHOD);
      const savedVehicleType = sessionStorage.getItem(STORAGE_KEY_VEHICLE_TYPE);
      if (savedMethod) {
        setMethod(savedMethod);
      }
      if (savedVehicleType) {
        setVehicleType(savedVehicleType);
      }
      setIsLoaded(true);
    }
  }, []);

  const changeMethod = (type: string) => {
    setMethod(type);
    // Save to sessionStorage for persistence across navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY_METHOD, type);
    }
  };

  const changeVehicleType = (type: string) => {
    setVehicleType(type);
    // Save to sessionStorage for persistence across navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY_VEHICLE_TYPE, type);
    }
  };

  // Don't render children until we've loaded the state from sessionStorage
  if (!isLoaded) {
    return null;
  }

  return (
    <GlobalStateContext.Provider value={{ method, changeMethod, vehicleType, changeVehicleType }}>
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
