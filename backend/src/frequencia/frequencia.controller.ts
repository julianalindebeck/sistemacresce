import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { Frequencia } from '../classes/Frequencia';

@Controller('frequencia')
export class FrequenciaController {
    constructor(private readonly service: FrequenciaService) {}

    @Get('buscar')
    findByTurmaEDisciplinaEData(
        @Query('turmaId') turmaId: string, 
        @Query('disciplinaId') disciplinaId: string,
        @Query('data') data: string
    ) {
        return this.service.findByTurmaEDisciplinaEData(turmaId, disciplinaId, data);
    }

    @Post('registrar')
    registrarFrequencia(@Body() body: Frequencia) {
        return this.service.registrarFrequencia(body);
    }
}