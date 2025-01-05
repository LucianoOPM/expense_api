import { Repository } from '@/interfaces/Repository';
import { categories } from '@prisma/client';

export interface Category extends categories {}
export interface CreateCategory
  extends Pick<Category, 'name' | 'description'> {}
export interface UpdateCategory extends Partial<CreateCategory> {
  status?: boolean;
}

export interface ICategoryRepository
  extends Repository<Category, CreateCategory, UpdateCategory> {}
