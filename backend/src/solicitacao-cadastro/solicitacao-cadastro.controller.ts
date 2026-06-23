import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { SolicitacaoCadastroService } from './solicitacao-cadastro.service';
import { SolicitacaoCadastro } from '../classes/SolicitacaoCadastro';

@Controller('solicitacoes-cadastro')
export class SolicitacaoCadastroController {
    constructor(
        private readonly service: SolicitacaoCadastroService,
    ) {}

    @Post()
    create(@Body() data: SolicitacaoCadastro) {
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