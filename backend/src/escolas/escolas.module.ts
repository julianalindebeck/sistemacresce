import { Module } from '@nestjs/common';
import { EscolasService } from './escolas.service';
import { EscolasController } from './escolas.controller';

@Module({
  providers: [EscolasService],
  controllers: [EscolasController]
})
export class EscolasModule {}
