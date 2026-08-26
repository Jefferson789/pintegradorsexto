import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'tu-clave-secreta-cambia-esto-en-produccion',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, cedula: payload.cedula, rol: payload.rol };
    }
}