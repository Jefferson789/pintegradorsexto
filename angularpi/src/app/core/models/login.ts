export interface Login {
    id_usuario: number;

    cedula: string;

    nombres: string;

    apellidos: string;

    correo: string;

    rol:
    | 'administrador'
    | 'director'
    | 'docente'
    | 'psicologo'
    | 'trabajador_social';

    estado: 'activo' | 'inactivo';
}