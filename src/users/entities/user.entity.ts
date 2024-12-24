import { Repository } from '@/interfaces/Repository';

export interface User {
  id_user: number;
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  role: string;
  earnings?: any[];
  expenses?: any[];
}

export interface IncomingQuery {
  name?: string;
  email?: string;
  status?: boolean;
  orderBy?: string;
  order?: 'asc' | 'desc';
  limit?: string;
  page?: string;
}

export interface UserQuery {
  where: {
    name?: string;
    email?: string;
    is_active?: boolean;
  };
  orderBy: {
    name?: 'asc' | 'desc';
    email?: 'asc' | 'desc';
  };
  take: number;
  skip: number;
}

export interface IncomingSingleQuery {
  expenses?: boolean;
  earnings?: boolean;
}

export interface SingleQuery {
  include?: {
    expenses?: boolean;
    earnings?: boolean;
  };
}

export interface CreateUser extends Pick<User, 'name' | 'email' | 'password'> {}
export interface UpdateUser extends Partial<Omit<CreateUser, 'email'>> {
  estatus?: boolean;
  role?: 'ADMIN' | 'SUBSCRIBER' | 'USER' | 'GUEST' | 'MODERATOR';
}

export interface IUserRepository
  extends Repository<User, CreateUser, UpdateUser, UserQuery, SingleQuery> {
  findByEmail(email: string): Promise<User>;
}
