import { IsNotEmpty } from 'class-validator';

export class UsuarioValidateTokenRequest {
  @IsNotEmpty({ message: 'Informe o id do usuário' })
  public user_id: number;

  @IsNotEmpty({ message: 'Informe código de verificação' })
  public verify_code: number;
}
