export interface UserSession {
    id: number;
    nombres: string;
    apellidos: string;
    rol:
    | 'administrador'
    | 'director'
    | 'docente'
    | 'psicologo'
    | 'trabajador_social';
}