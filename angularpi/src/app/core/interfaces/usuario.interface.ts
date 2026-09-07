// src/app/core/interfaces/usuario.interface.ts
export interface UsuarioApi {
    id_usuario: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena_hash?: string;
    rol:
    | 'administrador'
    | 'director'
    | 'docente'
    | 'psicologo'
    | 'trabajador_social';
    estado:
    | 'activo'
    | 'inactivo'
    | 'suspended';
    fecha_creacion: Date;
    fecha_actualizacion?: Date;
}

// Para el frontend, usamos una interfaz más amigable
export interface Usuario {
    id: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    correo: string;
    rol: string;
    estado: string;
    creadoEn: Date;
    actualizadoEn?: Date;
}