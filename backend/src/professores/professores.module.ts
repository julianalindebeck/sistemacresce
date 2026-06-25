import { Module } from '@nestjs/common';
import { ProfessoresController } from './professores.controller';
import { ProfessoresService } from './professores.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [ProfessoresController],
  providers: [ProfessoresService],
})
export class ProfessoresModule {}