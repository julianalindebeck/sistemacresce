import { Controller, Get, Post, Put, Delete, Body, Param, Patch, Query } from '@nestjs/common';
import { TurmasService } from './turmas.service';

@Controller('turmas')
export class TurmasController {
    constructor(private readonly service: TurmasService) {}
    
    @Get()
    findAll() {
        return this.service.findAll();
    }
    
    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }
    
    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update((id), body);
    }
    
    @Delete(':id')
    remove(@Param('id') id: string, @Query('escolaId') escolaId: string) {
        return this.service.remove(id, escolaId);
    }

    @Patch(':id/remover-aluno')
    removerAluno(@Param('id') id: string, @Body('alunoId') alunoId: string,) {
        return this.service.removerAluno(id, alunoId);
    }

    @Patch(':id/remover-disciplina')
    removerDisciplina(@Param('id') id: string, @Body('disciplinaId') disciplinaId: string,) {
        return this.service.removerDisciplina(id, disciplinaId);
    }
}