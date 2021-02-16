export interface TokenPayload {
  id: number;
  email: string;
}

export interface TokenDecoded {
  id: number;
  email: string;
  iat: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
