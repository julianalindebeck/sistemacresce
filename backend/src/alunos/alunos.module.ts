import { Module } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';

@Module({
  providers: [AlunosService],
  controllers: [AlunosController]
})
export class AlunosModule {}
