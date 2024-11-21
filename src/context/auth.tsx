'use client'
import { IUsuario } from "@/app/login/api";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  usuario: IUsuario | null;
  login: (usuarioData: IUsuario, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  usuario: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  // Função de login que salva os dados no localStorage
  const login = (usuarioData: IUsuario, token: string) => {
    setIsAuthenticated(true);
    setUsuario(usuarioData);
    localStorage.setItem("token", token); // Salva o token no localStorage
    localStorage.setItem("usuario", JSON.stringify(usuarioData)); // Salva o usuário no localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  // Carregar os dados do localStorage quando o AuthProvider é montado
  useEffect(() => {
    const storedUsuario = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUsuario && storedToken) {
      setIsAuthenticated(true);
      setUsuario(JSON.parse(storedUsuario)); // Parseia e define o usuário no estado
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
