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
import { AdministradoresEscolaresModule } from './administrador-escolar/administrador-escolar.module';
import { TurmasModule } from './turmas/turmas.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { SolicitacaoEdicaoModule } from './solicitacao-edicao/solicitacao-edicao.module';
import { SolicitacaoRemocaoModule } from './solicitacao-remocao/solicitacao-remocao.module';
import { NotasModule } from './notas/notas.module';
import { FrequenciaModule } from './frequencia/frequencia.module';

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
    AdministradoresEscolaresModule,
    TurmasModule,
    DisciplinasModule,
    SolicitacaoEdicaoModule,
    SolicitacaoRemocaoModule,
    NotasModule,
    FrequenciaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}