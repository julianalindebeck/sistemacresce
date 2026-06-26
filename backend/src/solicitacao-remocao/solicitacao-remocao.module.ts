import { Module } from '@nestjs/common';
import { SolicitacaoRemocaoService } from './solicitacao-remocao.service';
import { SolicitacaoRemocaoController } from './solicitacao-remocao.controller';

@Module({
  controllers: [SolicitacaoRemocaoController],
  providers: [SolicitacaoRemocaoService],
})
export class SolicitacaoRemocaoModule {}