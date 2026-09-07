import { Controller, Get, Query, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LogsService } from './logs.service';

@Controller('logs')
@UseGuards(AuthGuard('jwt'))
export class LogsController {
    constructor(private readonly logsService: LogsService) { }
    //get
    @Get()
    async getApplicationLogs(@Request() req: any, @Query('limit') limit?: string) {
        this.validateAdmin(req);

        const parsedLimit = limit ? parseInt(limit, 10) : 100;
        return this.logsService.getApplicationLogs(parsedLimit);
    }

    @Get('errors')
    async getErrorLogs(@Request() req: any, @Query('limit') limit?: string) {
        this.validateAdmin(req);

        const parsedLimit = limit ? parseInt(limit, 10) : 100;
        return this.logsService.getErrorLogs(parsedLimit);
    }

    private validateAdmin(req: any) {
        if (req.user?.rol !== 'administrador') {
            throw new ForbiddenException(
                'Solo los administradores pueden consultar los logs',
            );
        }
    }
}