import { QueryUserDto } from '@/users/dto/user.dto';
import { UserQuery } from '@/users/entities/user.entity';

export const queryBuild = (query: QueryUserDto): UserQuery => {
  const queryObject = {
    where: {},
    orderBy: {},
    take: 10,
    skip: 0,
  };

  if (query.status) {
    const positive = ['1', 'true'];
    const negative = ['0', 'false'];
    if (positive.includes(query.status)) {
      queryObject.where['status'] = true;
    } else if (negative.includes(query.status)) {
      queryObject.where['status'] = false;
    }
  }
  if (query.name) {
    queryObject.where['name'] = query.name;
  }
  if (query.email) {
    queryObject.where['email'] = query.email;
  }
  //Asignar valores por defecto cuando no venga X consulta
  //Por ejemplo, si hay un limite y no hay página, colocar pagina 1 o página actual
  if (query.orderBy && !query.order) {
    queryObject.orderBy[query.orderBy] = 'asc';
  } else if (query.orderBy && query.order) {
    queryObject.orderBy[query.orderBy] = query.order;
  } else {
    queryObject.orderBy['name'] = 'asc';
  }
  if (query.limit) {
    queryObject.take = +query.limit;
  }
  if (query.page) {
    queryObject.skip = (+query.page - 1) * queryObject.take;
  }

  return queryObject;
};
