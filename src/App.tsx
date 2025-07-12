import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { login, LoginResponse } from "./utils/api";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    const res: LoginResponse = await login(credentials.username, credentials.password);
    if (res.token) {
      setToken(res.token);
      const userObj = { username: credentials.username, role: res.role || "user" };
      setUser(userObj);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(userObj));
    } else if (res.firstTime) {
      // handled inside LoginForm
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} user={user!} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;