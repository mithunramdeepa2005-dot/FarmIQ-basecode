import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = sessionStorage.getItem("farmiq_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        sessionStorage.setItem(
          "farmiq_user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error("Authentication error:", error);

        sessionStorage.removeItem("farmiq_token");
        sessionStorage.removeItem("farmiq_user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    sessionStorage.removeItem("farmiq_token");
    sessionStorage.removeItem("farmiq_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}