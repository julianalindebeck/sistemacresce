import { Controller, Get, Param, Delete } from '@nestjs/common';
import { EscolasService } from './escolas.service';

@Controller('escolas')
export class EscolasController {
    constructor(private readonly service: EscolasService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}