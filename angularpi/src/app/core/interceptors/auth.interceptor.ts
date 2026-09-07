import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (
    req,
    next
) => {
    const tokenService = inject(TokenService);

    const router = inject(Router);

    const token = tokenService.getToken();

    const authRequest = token
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(authRequest).pipe(
        catchError(
            (error: HttpErrorResponse) => {
                if (error.status === 401) {
                    tokenService.clear();
                    router.navigate([
                        '/'
                    ]);
                }

                return throwError(
                    () => error
                );
            }
        )
    );
};