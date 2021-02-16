import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { env } from '../../env';
import { TokenDecoded, TokenPayload } from '../interfaces/authenticate.interface';

@Service()
export class SecurityService {
  public async generateToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        env.app.app_jwt_secrets,
        { algorithm: 'HS256' },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  }

  public async verifyToken(token: string): Promise<TokenDecoded> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, env.app.app_jwt_secrets, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as TokenDecoded);
        }
      });
    });
  }
}
