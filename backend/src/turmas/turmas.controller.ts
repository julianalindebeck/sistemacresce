import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
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
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}