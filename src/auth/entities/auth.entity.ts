export type Register = {
  name: string;
  password: string;
  email: string;
};

export type Login = {
  email: string;
  password: string;
};

export interface AuthorizedUser {
  idUser: number;
  username: string;
  role: string;
}

export type AccessTokenPayload = {
  sub: number;
  username: string;
  role: string;
  type: string;
  iat: number;
  exp: number;
};

export type RefreshTokenPayload = {
  sub: number;
  idToken: string;
  type: string;
  iat: number;
  exp: number;
};
