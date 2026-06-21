import { Module } from '@nestjs/common';
import { SolicitacaoCadastroService } from './solicitacao-cadastro.service';
import { SolicitacaoCadastroController } from './solicitacao-cadastro.controller';

@Module({
  controllers: [SolicitacaoCadastroController],
  providers: [SolicitacaoCadastroService],
})
export class SolicitacaoCadastroModule {}