import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'Mayor', description: 'First name of the user' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Abdulazeez', description: 'Last name of the user' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    example: 'mayor@example.com',
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'At least 6 characters',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Must match password',
  })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  confirmPassword: string;
}

export class LoginUserDto {
  @ApiProperty({
    example: 'mayor@example.com',
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'At least 6 characters',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
