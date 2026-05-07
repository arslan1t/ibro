"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Тип состояния фильтров
export interface FilterState {
  styles: string[];
  roomTypes: string[];
  colors: string[];
  materials: string[];
  propertyType: string[];
  budget: string | null;
}

// Тип контекста
interface FilterContextType {
  filters: FilterState;
  setFilters: (update: Partial<FilterState>) => void;
  resetFilters: () => void;
}

// Создание контекста
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Провайдер
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFiltersState] = useState<FilterState>({
    styles: [],
    roomTypes: [],
    colors: [],
    materials: [],
    propertyType: [],
    budget: null,
  });

  const setFilters = (update: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...update }));
  };

  const resetFilters = () => {
    setFiltersState({
      styles: [],
      roomTypes: [],
      colors: [],
      materials: [],
      propertyType: [],
      budget: null,
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// Хук
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
