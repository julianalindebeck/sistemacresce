import { Body, Controller, Post, Get, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ){}
  
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
   ) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Request() req: any,
  ) {
    return req.user;
  }
}