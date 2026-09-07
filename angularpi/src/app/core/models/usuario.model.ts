// src/app/core/models/usuario.model.ts
import { Usuario, UsuarioApi } from '../interfaces/usuario.interface';

export class UsuarioModel implements Usuario {
    constructor(
        public id: number,
        public cedula: string,
        public nombres: string,
        public apellidos: string,
        public correo: string,
        public rol: string,
        public estado: string,
        public creadoEn: Date,
        public actualizadoEn?: Date,
        public password?: string
    ) { }

    // Propiedad computada para nombre completo
    get nombreCompleto(): string {
        return `${this.apellidos}, ${this.nombres}`;
    }

    // Propiedad computada para email
    get email(): string {
        return this.correo;
    }

    // Formatear rol
    get rolFormatted(): string {
        const roles: Record<string, string> = {
            administrador: 'Administrador',
            director: 'Director',
            docente: 'Docente',
            psicologo: 'Psicólogo',
            trabajador_social: 'Trabajador Social'
        };
        return roles[this.rol] || this.rol;
    }

    // Formatear estado
    get estadoFormatted(): string {
        const estados: Record<string, string> = {
            activo: 'Activo',
            inactivo: 'Inactivo',
            suspended: 'Suspendido'
        };
        return estados[this.estado] || this.estado;
    }

    // Mapear desde API (UsuarioApi → UsuarioModel)
    static fromApi(data: UsuarioApi): UsuarioModel {
        return new UsuarioModel(
            data.id_usuario,
            data.cedula,
            data.nombres,
            data.apellidos,
            data.correo,
            data.rol,
            data.estado,
            new Date(data.fecha_creacion),
            data.fecha_actualizacion ? new Date(data.fecha_actualizacion) : undefined,
            undefined
        );
    }

    // Mapear a API para envío (UsuarioModel → Partial<UsuarioApi>)
    toApi(): Record<string, any> {
        const payload: Record<string, any> = {
            cedula: this.cedula,
            nombres: this.nombres,
            apellidos: this.apellidos,
            correo: this.correo,
            rol: this.rol,
            estado: this.estado
        };

        if (this.password) {
            // Se envía 'contrasena' para coincidir con CreateUsuarioDto en NestJS
            payload['contrasena'] = this.password;
        }

        return payload;
    }
}