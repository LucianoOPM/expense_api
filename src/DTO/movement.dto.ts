import { Movement } from '@/movements/entities/movement.entity';
import { formatDate } from '@/functions/tempo';
import { categoryDto } from '@/DTO/categories.dto';

export const movementDto = (movement: Movement) => {
  const dto = {
    idMovement: movement.id_movment,
    description: movement.description,
    total: movement.total,
    createdAt: formatDate(movement.created_at),
    status: movement.status,
    idUser: movement.user_id,
    idCategory: movement.category_id,
    type: Number(movement.total) > 0 ? 'IN' : 'OUT',
  };
  if (movement.categories) {
    dto['categories'] = categoryDto(movement.categories);
  }
  return dto;
};
