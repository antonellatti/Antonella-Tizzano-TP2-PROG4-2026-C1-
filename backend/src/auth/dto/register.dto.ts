import {
  IsEmail, IsString, MinLength, Matches, IsDateString, IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsString() nombre!: string;
  @IsString() apellido!: string;
  @IsEmail() email!: string;
  @IsString() username!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[A-Z])/, { message: 'Debe contener al menos una mayúscula' })
  @Matches(/(?=.*\d)/, { message: 'Debe contener al menos un número' })
  password!: string;

  @IsDateString() fechaNacimiento!: string;
  @IsOptional() @IsString() descripcion?: string;
}