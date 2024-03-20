import { Brand } from "../../../domain/entities/Brand";

export interface IBrandUseCases {
  createBrand(name: string, description?: string): Promise<Brand>;
  updateBrand(
    id: string,
    name: string,
    description?: string,
  ): Promise<Brand | null>;
  getBrand(id: string): Promise<Brand | null>;
  findAllBrands(): Promise<Brand[]>;
  removeBrand(id: string): Promise<void>;
}
