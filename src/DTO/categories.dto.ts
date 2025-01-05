import { Category } from '@/categories/entities/category.entity';

export const categoryDto = (category: Category) => {
  return {
    idCategory: category.id_category,
    name: category.name,
    description: category.description,
    status: category.status,
  };
};
