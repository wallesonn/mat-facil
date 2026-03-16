"use client";

// ============================================================
// HOOK DE AUTENTICAÇÃO — Context Provider (singleton)
// Garante UMA ÚNICA instância de listener e estado para toda a app
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback, createElement, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  profile: null,
  loading: true,
  refetch: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        fetchProfile(user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    if (profile) fetchProfile(profile.id);
  }, [profile, fetchProfile]);

  return createElement(AuthContext.Provider, { value: { profile, loading, refetch } }, children);
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
