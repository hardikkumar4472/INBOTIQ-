import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white py-3">
      <div className="app-container flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          Role Auth App
        </Link>

        <div className="space-x-3">
          {user ? (
            <>
              <span className="mr-2">Hi, {user.name} ({user.role})</span>
              <button onClick={() => navigate("/dashboard")} className="px-3 py-1 bg-gray-700 rounded">
                Dashboard
              </button>
              <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-gray-700 rounded">Login</Link>
              <Link to="/signup" className="px-3 py-1 bg-gray-700 rounded">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
