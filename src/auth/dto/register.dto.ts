import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDtoRequest {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class RegisterDtoResponse {
  /**
   * This is the username that will be used for each and
   * every user
   */
  email: string;

  /**
   * The message related to the newly created dto
   */
  message: string;
}
