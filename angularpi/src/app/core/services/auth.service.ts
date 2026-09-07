import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Necesario para manejar errores
import { environment } from '../../../environment/environment';
import { TokenService } from './token.service';
import { UserSession } from '../interfaces/user-session.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private tokenService = inject(TokenService);
    private apiUrl = environment.apiUrl;

    login(
        cedula: string,
        contrasena: string
    ): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/auth/login`,
            {
                cedula,
                contrasena
            }
        );
    }

    me(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
            catchError((error: HttpErrorResponse) => {
                // Opcional: Manejar error de sesión expirada en 'me'
                if (error.status === 401) {
                    this.logout();
                }
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        this.tokenService.clear();
    }

    isAuthenticated(): boolean {
        return !!this.tokenService.getToken();
    }

    getCurrentUser(): UserSession | null {
        return this.tokenService.getUser();
    }

    async validateSession(): Promise<boolean> {
        try {
            await firstValueFrom(this.me());
            return true;
        } catch {
            this.logout();
            return false;
        }
    }

    getRole(): string | null {
        return this.tokenService.getRole();
    }
}