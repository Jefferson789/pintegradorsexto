import { Injectable } from '@angular/core';
import { UserSession } from '../interfaces/user-session.interface';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    setToken(token: string): void {
        sessionStorage.setItem(
            'token',
            token
        );
    }

    getToken(): string | null {
        return sessionStorage.getItem(
            'token'
        );
    }

    setUser(user: any): void {
        sessionStorage.setItem(
            'usuario',
            JSON.stringify(user)
        );
    }

    getUser(): UserSession | null {
        const user =
            sessionStorage.getItem(
                'usuario'
            );

        return user
            ? JSON.parse(user)
            : null;
    }

    clear(): void {
        sessionStorage.removeItem(
            'token'
        );
        sessionStorage.removeItem(
            'usuario'
        );
    }

    getRole(): string | null {
        const user = this.getUser();
        return user?.rol ?? null;
    }
}