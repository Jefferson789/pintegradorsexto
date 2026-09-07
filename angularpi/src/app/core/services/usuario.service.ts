// src/app/core/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { UsuarioApi } from '../interfaces/usuario.interface';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<UsuarioModel[]> {
        return this.http.get<UsuarioApi[]>(this.apiUrl).pipe(
            map(usuarios => {
                return usuarios.map(u => {
                    try {
                        return UsuarioModel.fromApi(u);
                    } catch (e) {
                        console.error('Error mapeando usuario:', u, e);
                        // Retornar un modelo vacío o lanzar error si prefieres
                        return new UsuarioModel(0, 'N/A', 'Error', 'Mapeo', 'error@siade.com', 'otro', 'activo', new Date());
                    }
                });
            }),
            catchError(err => {
                console.error('Error general al cargar usuarios:', err);
                return throwError(() => err);
            })
        );
    }

    getById(id: number): Observable<UsuarioModel> {
        return this.http.get<UsuarioApi>(`${this.apiUrl}/${id}`).pipe(
            map(u => UsuarioModel.fromApi(u)),
            catchError(err => throwError(() => err))
        );
    }

    create(usuario: UsuarioModel): Observable<UsuarioModel> {
        const payload = usuario.toApi();
        delete (payload as any).id_usuario;

        return this.http.post<UsuarioApi>(this.apiUrl, payload).pipe(
            map(u => UsuarioModel.fromApi(u)),
            catchError(err => throwError(() => err))
        );
    }

    update(id: number, usuario: UsuarioModel): Observable<UsuarioModel> {
        const payload = usuario.toApi();

        return this.http.put<UsuarioApi>(
            `${this.apiUrl}/${id}`,
            payload
        ).pipe(
            map(u => UsuarioModel.fromApi(u))
        );
    }


    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    toggleStatus(id: number, estado: 'activo' | 'inactivo'): Observable<UsuarioModel> {
        const payload = { estado };
        return this.http.put<UsuarioApi>(`${this.apiUrl}/${id}`, payload).pipe(
            map(u => UsuarioModel.fromApi(u)),
            catchError(err => throwError(() => err))
        );
    }
}