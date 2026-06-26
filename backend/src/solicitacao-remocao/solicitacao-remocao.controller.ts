import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { SolicitacaoRemocaoService } from './solicitacao-remocao.service';
import { SolicitacaoRemocao } from '../classes/SolicitacaoRemocao';

@Controller('solicitacoes-remocao')
export class SolicitacaoRemocaoController {
    constructor(
        private readonly service: SolicitacaoRemocaoService,
    ) {}

    @Post()
    create(@Body() data: SolicitacaoRemocao) {
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