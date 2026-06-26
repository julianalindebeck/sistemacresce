import { Module } from '@nestjs/common';
import { SolicitacaoCadastroController } from './solicitacao-cadastro.controller';
import { SolicitacaoCadastroService } from './solicitacao-cadastro.service';
import { EmailModule } from '../email/email.module';
import { AdministradoresEscolaresModule } from '../administrador-escolar/administrador-escolar.module';

@Module({
  imports: [
    EmailModule, AdministradoresEscolaresModule,
  ],
  controllers: [SolicitacaoCadastroController],
  providers: [SolicitacaoCadastroService],
})
export class SolicitacaoCadastroModule {}