import { ReactNode } from "react";
import { Login } from '../../libs/storage';

export interface Data {
    cnpj: string
    password: string
    email: string
}

export interface AuthContextData {
    login: Login | null;
    isAuth: boolean;
    isLoading: boolean;
    handleAuth: (data: Data) => Promise<void>;
}

export interface AuthProviderProps {
    children: ReactNode;
}