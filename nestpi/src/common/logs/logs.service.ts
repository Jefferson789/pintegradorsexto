import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class LogsService {
    private readonly logsPath = path.join(process.cwd(), 'logs');

    async getApplicationLogs(limit = 100): Promise<string[]> {
        return this.readLogFile('application.log', limit);
    }

    async getErrorLogs(limit = 100): Promise<string[]> {
        return this.readLogFile('error.log', limit);
    }

    private async readLogFile(
        filename: string,
        limit: number,
    ): Promise<string[]> {
        const filePath = path.join(this.logsPath, filename);

        try {
            const content = await fs.readFile(filePath, 'utf-8');

            return content
                .split(/\r?\n/)
                .filter((line) => line.trim().length > 0)
                .slice(-limit)
                .reverse();
        } catch {
            return [];
        }
    }
}