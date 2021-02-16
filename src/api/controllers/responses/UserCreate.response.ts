import { User, UserStatus } from '../../../api/models/user-models/User.model';

export class UserCreateResponse {
  public usuario: UsuarioResponse;
  public status: UserStatus;
  public token: string;
  public expiresIn: string;
  constructor(usuario: User) {
    this.usuario = this.transformUser(usuario);
    this.status = usuario.status;
  }

  public transformUser(usuario: User): UsuarioResponse {
    return new UsuarioResponse(
      usuario.id,
      usuario.name,
      usuario.email,
      usuario.lastName,
      ''
    );
  }
}

export class UsuarioResponse {
  public id: number;
  public name: string;
  public lastname: string;
  public email: string;
  public picture: string;

  constructor(
    id: number,
    name: string,
    lastname: string,
    email: string,
    picture: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.lastname = lastname;
    this.picture = this.handleImageUrl(picture);
  }

  public handleImageUrl(picture: string): string {
    return `http://localhost:8080/${picture}`;
  }
}
