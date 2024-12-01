export interface Repository<T, C = T, U = T> {
  create(data: C): Promise<T>;
  update(data: U): Promise<T>;
  delete(id: number): Promise<T>;
  findById(id: number): Promise<T>;
  findAll(): Promise<T[]>;
}
