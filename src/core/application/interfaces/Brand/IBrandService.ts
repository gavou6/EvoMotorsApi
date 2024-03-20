import { Brand } from "../../../domain/entities/Brand";

export interface IBrandService {
  createBrand(name: string, description?: string): Promise<Brand>;
  getBrandById(id: string): Promise<Brand | null>;
  getAllBrands(): Promise<Brand[]>;
  updateBrand(
    id: string,
    name: string,
    description?: string,
  ): Promise<Brand | null>;
  deleteBrand(id: string): Promise<void>;
}
