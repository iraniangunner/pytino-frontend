"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authAPI } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  refetch: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function fetchUser() {
    setIsLoading(true);
    authAPI
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchUser();

    // وقتی axios interceptor به‌خاطر شکست refresh_token این رویداد رو پرتاب می‌کنه،
    // اینجا هم باید user رو خالی کنیم تا کل اپ بفهمه لاگین باطل شده
    function handleLogout() {
      setUser(null);
    }
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, refetch: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
