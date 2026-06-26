import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfessoresModule } from './professores/professores.module';
import { SolicitacaoCadastroModule } from './solicitacao-cadastro/solicitacao-cadastro.module';
import { AlunosModule } from './alunos/alunos.module';
import { EscolasModule } from './escolas/escolas.module';
import { AvisosModule } from './avisos/avisos.module';
import { EmailModule } from './email/email.module';
import { TurmasModule } from './turmas/turmas.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { SolicitacaoEdicaoModule } from './solicitacao-edicao/solicitacao-edicao.module';
import { SolicitacaoRemocaoModule } from './solicitacao-remocao/solicitacao-remocao.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProfessoresModule,
    SolicitacaoCadastroModule,
    AlunosModule,
    EscolasModule,
    AvisosModule,
    EmailModule,
    TurmasModule,
    DisciplinasModule,
    SolicitacaoEdicaoModule,
    SolicitacaoRemocaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}