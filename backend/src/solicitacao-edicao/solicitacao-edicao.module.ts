import { Module } from '@nestjs/common';
import { SolicitacaoEdicaoService } from './solicitacao-edicao.service';
import { SolicitacaoEdicaoController } from './solicitacao-edicao.controller';

@Module({
  controllers: [SolicitacaoEdicaoController],
  providers: [SolicitacaoEdicaoService],
})
export class SolicitacaoEdicaoModule {}