// import { Usuario } from '@prisma/client';
import { UserLogged } from '@types';
import { createContext } from 'react'

interface ContextProps {
    isInitialized: boolean;
    isLoggedIn: boolean;
    rol: string[];
    user?: UserLogged;
    loginUser: (identificacion: string, clave: string) => Promise<boolean>;
    logoutUser: () => void;
}

export const AuthContext = createContext({} as ContextProps)