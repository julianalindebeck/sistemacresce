import { Module } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { DisciplinasController } from './disciplinas.controller';

@Module({
  providers: [DisciplinasService],
  controllers: [DisciplinasController],
})
export class DisciplinasModule {}