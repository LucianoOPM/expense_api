import { Category } from '@/categories/entities/category.entity';
import { Repository } from '@/interfaces/Repository';
import { movments } from '@prisma/client';

export interface Movement extends movments {
  categories?: Category;
}

export interface CreateMovement
  extends Pick<
    Movement,
    'description' | 'total' | 'user_id' | 'category_id' | 'created_at'
  > {}

export interface UpdateMovement
  extends Partial<Omit<CreateMovement, 'created_at' | 'user_id'>> {
  status?: boolean;
}

export interface IncomingQuery {
  page?: string;
  limit?: string;
  order?: 'asc' | 'desc';
  orderBy?: 'total' | 'createdAt';
  minTotal?: string;
  maxTotal?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  user?: string;
}

export interface MovementQuery {
  where: {
    status?: boolean;
    startDate?: string;
    endDate?: string;
    category?: string;
    user?: string;
    minTotal?: string;
    maxTotal?: string;
  };
  take: number;
  skip: number;
  orderBy: { [key: string]: 'asc' | 'desc' };
  include: { [key: string]: boolean };
}

export interface IMovementRepository
  extends Repository<Movement, CreateMovement, UpdateMovement, MovementQuery> {}
