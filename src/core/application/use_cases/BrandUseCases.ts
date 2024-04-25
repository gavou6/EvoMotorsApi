import { Brand } from "../../domain/entities";
import { IBrandService, IBrandUseCases } from "../interfaces";

export class BrandUseCases implements IBrandUseCases {
  private brandService: IBrandService;

  constructor(brandService: IBrandService) {
    this.brandService = brandService;
  }

  async findAllBrands(): Promise<Brand[]> {
    return this.brandService.getAllBrands();
  }

  async createBrand(name: string, description?: string): Promise<Brand> {
    return this.brandService.createBrand(name, description);
  }

  async updateBrand(
    id: string,
    name: string,
    description?: string,
  ): Promise<Brand | null> {
    return this.brandService.updateBrand(id, name, description);
  }

  async getBrand(id: string): Promise<Brand | null> {
    return this.brandService.getBrandById(id);
  }

  async removeBrand(id: string): Promise<void> {
    return this.brandService.deleteBrand(id);
  }
}
