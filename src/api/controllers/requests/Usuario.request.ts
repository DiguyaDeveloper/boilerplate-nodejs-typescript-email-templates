import { IsEmail, IsNotEmpty, IsNumberString, MaxLength, MinLength } from 'class-validator';

export class UsuarioRequest {
  @IsNotEmpty({ message: 'Informe Nome' })
  public name: string;

  @IsNotEmpty({ message: 'Informe Username' })
  public lastname: string;

  @IsEmail(
    { allow_display_name: true },
    {
      message: 'The email is not valid',
    }
  )
  @IsNotEmpty({
    message: 'Email is required',
  })
  public email: string;

  @IsNotEmpty({ message: 'Informe Senha' })
  public password: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @MinLength(11, {
    message: 'Quantidade de caracteres esperada: 11.',
  })
  @MaxLength(11, {
    message: 'Quantidade de caracteres esperada: 11.',
  })
  public document: string;

  @IsNotEmpty({ message: 'Informe termsAndConditions' })
  @IsNumberString({ message: 'Informe termsAndConditions 0 ou 1' })
  public termsAndConditions?: number;
}
