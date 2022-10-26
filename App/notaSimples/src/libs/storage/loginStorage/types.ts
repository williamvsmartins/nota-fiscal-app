export interface Login {
    cnpj: string | null,
    password: string | null,
}
  
  export type GetLogin = () => Promise<Login>;
  export type SaveLogin = (login: Login) => Promise<void>;