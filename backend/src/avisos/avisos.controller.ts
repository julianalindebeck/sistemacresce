import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { AvisosService } from './avisos.service';
import { Avisos } from '../classes/Avisos';

@Controller('avisos')
export class AvisosController {
    constructor(private readonly service: AvisosService) {}

    @Post()
    create(@Body() data: Avisos) {
        return this.service.create(data);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('responsavel/:email')
    findAvisosPorResponsavel(@Param('email') email: string) {
        return this.service.findAvisosPorResponsavel(email);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.service.update(id, data);
    }
}