import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setLoading(false);
        return;
      }

      try {

        const res = await api.get("/auth/me");
        setUser(res.data);

        const socketUrl =
          import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL;
        const s = io(socketUrl, { transports: ["websocket"] });

        s.on("connect", () => {
          console.log("✅ Socket connected:", s.id);
          if (res.data?._id || res.data?.id) {
            s.emit("register", res.data._id || res.data.id);
          }
        });

        s.on("notification", (payload) => {
          console.log("🔔 Notification:", payload);
          alert(`Notification: ${payload?.message || JSON.stringify(payload)}`);
        });

        setSocket(s);
      } catch (err) {
        console.error("Auth initialization error:", err);

      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("❌ Socket disconnected");
      }
    };

  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(user);

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL;
    const s = io(socketUrl, { transports: ["websocket"] });

    s.on("connect", () => {
      if (user?.id) s.emit("register", user.id);
    });

    s.on("notification", (payload) => {
      console.log("🔔 Notification:", payload);
      alert(`Notification: ${payload?.message || JSON.stringify(payload)}`);
    });

    setSocket(s);
    return user;
  };

  const signup = async (name, email, password, role) => {
    const res = await api.post("/auth/signup", { name, email, password, role });
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(user);

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL;
    const s = io(socketUrl, { transports: ["websocket"] });

    s.on("connect", () => {
      if (user?.id) s.emit("register", user.id);
    });

    s.on("notification", (payload) => {
      console.log("🔔 Notification:", payload);
      alert(`Notification: ${payload?.message || JSON.stringify(payload)}`);
    });

    setSocket(s);
    return user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
    } catch (err) {
      console.warn("Logout request failed:", err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    socket,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);