"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Тип юзера (можно расширять при необходимости)
interface UserType {
  id: string;
  email: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Тип карточки дизайна (минимально нужный)
interface DesignCardType {
  id: string;
  image: string;
  roomType: string;
  style: string[];
}

interface AppContextType {
  user: UserType | null;
  loading: boolean;

  // фильтры
  filters: {
    styles: string[];
    colors: string[];
    materials: string[];
    propertyType: string[];
    roomTypes: string[];
    budget: string | null;
  };
  setFilters: (data: Partial<AppContextType["filters"]>) => void;
  resetFilters: () => void;

  // избранное
  favorites: DesignCardType[];
  addFavorite: (card: DesignCardType) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;

  // auth
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // --------------------------
  // ⭐ Авторизация
  // --------------------------

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setLoading(false);
      return;
    }
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user as UserType | null);
      } catch {}
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as UserType | null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/profile" },
    });
  };

  const signOut = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  // --------------------------
  // ⭐ Фильтры
  // --------------------------

  const [filters, setFiltersState] = useState<AppContextType["filters"]>({
    styles: [],
    colors: [],
    materials: [],
    propertyType: [],
    roomTypes: [],
    budget: null,
  });

  const setFilters = (update: Partial<AppContextType["filters"]>) => {
    setFiltersState(prev => ({ ...prev, ...update }));
  };

  const resetFilters = () => {
    setFiltersState({
      styles: [],
      colors: [],
      materials: [],
      propertyType: [],
      roomTypes: [],
      budget: null,
    });
  };

  // --------------------------
  // ⭐ Избранное
  // --------------------------

  const [favorites, setFavorites] = useState<DesignCardType[]>([]);

  const addFavorite = (card: DesignCardType) => {
    setFavorites(prev => {
      // не добавляем дубли
      if (prev.some(item => item.id === card.id)) return prev;
      return [...prev, card];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <AppContext.Provider
      value={{
        user,
        loading,

        filters,
        setFilters,
        resetFilters,

        favorites,
        addFavorite,
        removeFavorite,
        clearFavorites,

        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
