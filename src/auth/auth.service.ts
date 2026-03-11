/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDtoRequest, RegisterDtoResponse } from './dto/register.dto';

import * as bcrypt from 'bcrypt';
import { LoginRequestDto, TokenResponseDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenInterface } from './interface/token.interface';
import { IUser } from './interface/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  register = async (
    request: RegisterDtoRequest,
  ): Promise<RegisterDtoResponse> => {
    const hashedPassword = await this._findUserAndHashPassword(request);
    return this._createAndSaveUser(request, hashedPassword, UserRole.USER);
  };

  getUserById = async (userId: number): Promise<IUser> => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  };

  createAdminUser = async (
    request: RegisterDtoRequest,
  ): Promise<RegisterDtoResponse> => {
    const hashedPassword = await this._findUserAndHashPassword(request);
    return this._createAndSaveUser(request, hashedPassword, UserRole.ADMIN);
  };

  login = async (loginDto: LoginRequestDto): Promise<TokenResponseDto> => {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      !user ||
      !(await this._verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const tokens = this._generateTokens(user);

    return {
      user: user.email,
      tokens: tokens,
    };
  };

  refreshToken = async (
    refreshToken: string,
  ): Promise<{ accessToken: string }> => {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this._generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  };

  private _findUserAndHashPassword = async (
    request: RegisterDtoRequest,
  ): Promise<string> => {
    const existingUser = await this.userRepository.findOne({
      where: { email: request.email },
    });

    if (existingUser) {
      throw new ConflictException('The email is already in use!');
    }

    const _hashPassword = bcrypt.hash(request.password, 10);

    return await _hashPassword;
  };

  private _createAndSaveUser = async (
    request: RegisterDtoRequest,
    hashedPassword: string,
    role: UserRole,
  ): Promise<RegisterDtoResponse> => {
    const newUser = this.userRepository.create({
      email: request.email,
      password: hashedPassword,
      role: role,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      email: savedUser.email,
      message: 'User registered successfully!',
    };
  };

  private _verifyPassword = async (
    password: string,
    hashedPassword: string,
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  };

  private _generateTokens = (user: User): TokenInterface => {
    return {
      accessToken: this._generateAccessToken(user),
      refreshToken: this._generateRefreshToken(user),
    };
  };

  private _generateAccessToken = (user: User): string => {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
  };

  private _generateRefreshToken = (user: User): string => {
    const payload = { sub: user.id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: '7d',
    });
  };
}
