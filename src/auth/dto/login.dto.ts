import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { TokenInterface } from '../interface/token.interface';

export class LoginRequestDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class TokenResponseDto {
  user: string;
  tokens: TokenInterface;
}
