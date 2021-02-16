import { Response } from 'express';
import {
    Body, Delete, Get, JsonController, NotFoundError, Param, Post, Put, UploadedFile
} from 'routing-controllers';

import { uploads } from '../config/multer.config';
import { User, UserStatus } from '../models/user-models/User.model';
import { UsuarioService } from '../services/UsuarioService';
import { CustomError } from './errors/CustomError';
import { EnumError } from './errors/Error';
import { UsuarioRequest } from './requests/Usuario.request';
import { UsuarioValidateTokenRequest } from './requests/UsuarioValidateToken.request';
import { UserCreateResponse } from './responses/UserCreate.response';

const uploadOpts = uploads.options;

@JsonController('/usuarios')
export class UserController {
  constructor(private userService: UsuarioService) {}

  @Post()
  // tslint:disable-next-line:typedef
  public async create(
    @UploadedFile('file', { options: uploadOpts }) file: File[],
    @Body() usuario: UsuarioRequest
  ) {
    const errors = await this.userService.validateNewUser(usuario, file);

    console.log('errors', errors);

    const newUser = new User(
      usuario.name,
      usuario.lastname,
      usuario.email,
      usuario.password,
      usuario.document,
      UserStatus.New,
      usuario.termsAndConditions,
      1
    );

    try {
      await this.userService.save(newUser);
    } catch (error) {
      throw new CustomError(402, 'Erro na criação do usuário', {
        id: EnumError.CRIACAO_USUARIO_FALHA,
      });
    }

    await this.userService.submit_account_code(newUser);

    return new UserCreateResponse(newUser);
  }

  /**
   * Api para editar usuário
   * @param usuario
   */
  @Put('/verificacao')
  public async update_statusAccount_token(
    @Body() usuario: UsuarioValidateTokenRequest
  ): Promise<void> {
      try {

      const user: User = await this.userService.findOne({
        where: { id: usuario.user_id },
      });

      if (!user) {
        throw new CustomError(402, 'Usuário não encontrado', {
          id: EnumError.USUARIO_NAO_ENCONTRADO,
        });
      }

      if (usuario.verify_code !== user.confirmation_code) {
        throw new CustomError(402, 'Código de verificação inválido', {
          id: EnumError.CODIGO_VERIFICACAO_INVALIDO,
        });
      }

      user.status = UserStatus.Active;
      const { id: _id, ...partial } = user;

      try {
        await this.userService.update(user, partial);
      } catch (e) {
        throw new CustomError(
          409,
          'Erro ao editar usuário' + JSON.stringify(e)
        );
      }
    } catch (err) {
      throw new CustomError(402, 'Erro ao ativar o usuário', {
        id: EnumError.CONFIRMAR_USUARIO,
      });
    }
  }

  @Put('/:id')
  public async update(
    @Param('id') id: number,
    @Body() body: User,
    res: Response
  ): Promise<User> {
    const usuario = await this.userService.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundError();
    }

    const { id: _id, password: _senha, ...partial } = body;

    try {
      const updated = await this.userService.update(usuario, partial);
      return updated;
    } catch (e) {
      throw new CustomError(409, 'Erro ao editar usuário' + JSON.stringify(e));
    }
  }

  @Delete('/:id')
  public delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }

  @Get('/listar')
  public get(): Promise<User[]> {
    return this.userService.find();
  }

  public unlinkFile(file: string): void {
    const fs = require('fs');
    fs.unlinkSync(file);
  }
}
