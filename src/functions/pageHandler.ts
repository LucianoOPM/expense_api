type Query = {
  limit: string;
  page: string;
};
export const pageHandler = (query: Query, total: number) => {
  const { limit = '10', page = '1' } = query;
  const totalPages = Math.ceil(total / +limit);

  const nextPage = +page < totalPages ? +page + 1 : null;
  const prevPage = +page > 1 ? +page - 1 : null;
  return {
    currentPage: +page,
    nextPage,
    prevPage,
    totalPages,
  };
};
