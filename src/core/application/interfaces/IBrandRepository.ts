import { Brand } from "../../domain/entities/Brand";

export interface IBrandRepository {
  findById(id: string): Promise<Brand | null>;
  findAll(): Promise<Brand[]>;
  save(brand: Brand): Promise<Brand>;
  update(id: string, brand: Brand): Promise<Brand>;
  deleteById(id: string): Promise<void>;
}
