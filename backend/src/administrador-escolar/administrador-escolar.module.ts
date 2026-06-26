import { Module } from '@nestjs/common';
import { AdministradoresEscolaresService } from './administrador-escolar.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [AdministradoresEscolaresService],
  exports: [AdministradoresEscolaresService],
})
export class AdministradoresEscolaresModule {}