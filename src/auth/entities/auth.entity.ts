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
