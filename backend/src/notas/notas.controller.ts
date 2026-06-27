import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotasService } from './notas.service';

@Controller('notas')
export class NotasController {
    constructor(private readonly service: NotasService) {}

    @Get('turma/:turmaId')
    findByTurma(@Param('turmaId') turmaId: string) {
        return this.service.findByTurma(turmaId);
    }

    @Post('lancar')
    lancarNotas(
        @Body() body: { 
            turmaId: string; 
            lancamentos: { 
                alunoId: string; 
                disciplina: string;
                bim1: number | null; 
                bim2: number | null; 
                bim3: number | null; 
                bim4: number | null; 
            }[] 
        }
    ) {
        return this.service.lancarNotas(body);
    }
}