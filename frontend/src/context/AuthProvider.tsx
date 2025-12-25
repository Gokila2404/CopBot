import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) setIsLoggedIn(true);
  }, []);

  const login = (email: string) => {
    localStorage.setItem('loggedInUser', JSON.stringify({ email }));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
