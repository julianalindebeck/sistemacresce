import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AlunosService } from './alunos.service';

@Controller('alunos')
export class AlunosController {
    constructor(private readonly service: AlunosService) {}
    
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
        return this.service.findOne(Number(id));
    }
    
    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(Number(id), body);
    }
    
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}