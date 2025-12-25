import { createContext } from 'react';

export interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
});
