import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDtoRequest } from './dto/register.dto';
import { LoginRequestDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { Roles } from './decorator/roles.decorator';
import { UserRole } from './entity/user.entity';
import { RolesGuard } from './guard/roles-guard';
import { LoginThrottlerGuard } from './guard/login-throttler.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() request: RegisterDtoRequest) {
    return this.authService.register(request);
  }

  @UseGuards(LoginThrottlerGuard)
  @Post('login')
  async login(@Body() request: LoginRequestDto) {
    return this.authService.login(request);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') request: string) {
    return this.authService.refreshToken(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Post('create-admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createAdminUser(@Body() request: RegisterDtoRequest) {
    return this.authService.createAdminUser(request);
  }
}
