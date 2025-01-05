import { AuthorizedUser } from '@/auth/entities/auth.entity';
import {
  IncomingQuery,
  MovementQuery,
} from '@/movements/entities/movement.entity';

const fillWhere = (query: IncomingQuery, user: AuthorizedUser) => {
  const { minTotal, maxTotal, status, startDate, endDate } = query;
  const { idUser, role } = user;
  const whereObj = {};
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    whereObj['user_id'] = idUser;
  }
  if (minTotal && maxTotal) {
    whereObj['total'] = {
      gte: minTotal,
      lte: maxTotal,
    };
  } else if (minTotal) {
    whereObj['total'] = {
      gte: minTotal,
      lte: Number(minTotal) > 0 ? '' : 0,
    };
  } else if (maxTotal) {
    whereObj['total'] = {
      gte: Number(maxTotal) > 0 ? '' : 0,
      lte: maxTotal,
    };
  }
  if (status) {
    whereObj['status'] = status === 'true';
  }
  if (startDate && endDate) {
    whereObj['created_at'] = {
      gte: startDate,
      lte: endDate,
    };
  } else if (startDate) {
    whereObj['created_at'] = {
      gte: startDate,
    };
  } else if (endDate) {
    whereObj['created_at'] = {
      lte: endDate,
    };
  }

  return whereObj;
};

const fillOrderBy = (query: IncomingQuery) => {
  const orderDictionary = {
    total: 'total',
    createdAt: 'created_at',
  };
  const { orderBy } = query;
  if (orderBy) {
    return {
      [orderDictionary[orderBy]]: query.order,
    };
  }
  return {};
};

const fillInclude = (query: IncomingQuery) => {
  const { user, category } = query;
  if (user && category) {
    return {
      users: true,
      categories: true,
    };
  } else if (user) {
    return {
      users: true,
    };
  } else if (category) {
    return {
      categories: true,
    };
  }
  return {};
};

export const queryBuild = (
  user: AuthorizedUser,
  query: IncomingQuery,
): MovementQuery => {
  return {
    where: fillWhere(query, user),
    orderBy: fillOrderBy(query),
    take: query.limit ? +query.limit : 10,
    skip: query.page ? (+query.page - 1) * +query.limit : 0,
    include: fillInclude(query),
  };
};
