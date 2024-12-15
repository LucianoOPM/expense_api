export interface Repository<T, C = T, U = T, Q = T, SQ = T> {
  create(data: C): Promise<T>;
  update(id: number, data: U): Promise<T>;
  findById(id: number, query: SQ): Promise<T>;
  findAll(query: Q): Promise<T[]>;
}
