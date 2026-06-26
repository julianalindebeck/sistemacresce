import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { SolicitacaoEdicaoService } from './solicitacao-edicao.service';
import { SolicitacaoEdicao } from '../classes/SolicitacaoEdicao';

@Controller('solicitacoes-edicao')
export class SolicitacaoEdicaoController {
    constructor(
        private readonly service: SolicitacaoEdicaoService,
    ) {}

    @Post()
    create(@Body() data: SolicitacaoEdicao) {
        return this.service.create(data);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.service.updateStatus(id, status);
    }
}