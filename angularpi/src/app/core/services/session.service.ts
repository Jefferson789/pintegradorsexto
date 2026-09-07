import { Injectable } from '@angular/core';
import { UserSession } from '../interfaces/user-session.interface';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    get user():
        UserSession | null {
        const user =
            sessionStorage.getItem(
                'usuario'
            );

        return user
            ? JSON.parse(user)
            : null;
    }

    get role():
        string {
        return this.user?.rol ?? '';
    }

    get fullName():
        string {
        if (!this.user) {
            return '';
        }
        return `${this.user.nombres} ${this.user.apellidos}`;
    }

    hasRole(
        ...roles: string[]
    ): boolean {
        return roles.includes(
            this.role
        );
    }

    canAccessUsuarios(): boolean {

        return this.hasRole(
            'administrador'
        );

    }

    canAccessFamilias(): boolean {

        return this.hasRole(
            'administrador',
            'director'
        );

    }

    canAccessDashboard(): boolean {

        return this.hasRole(
            'administrador',
            'director'
        );

    }

    canAccessEstudiantes(): boolean {

        return this.hasRole(
            'administrador'
        );

    }

    get lastLogin(): Date | null {
        const value =
            sessionStorage.getItem(
                'lastLogin'
            );

        return value
            ? new Date(value)
            : null;
    }

    get formattedLastLogin(): string {
        const lastLogin = this.lastLogin;

        if (!lastLogin) {
            return '';
        }

        return lastLogin.toLocaleString(
            'es-EC'
        );
    }
}