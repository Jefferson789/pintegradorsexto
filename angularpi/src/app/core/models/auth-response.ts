import { Login } from "./login";

export interface AuthResponse {
    accessToken: string;

    usuario: Login
}
