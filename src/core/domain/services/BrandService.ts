import { IBrandRepository, IBrandService } from "../../application/interfaces";
import { Brand } from "../entities";

export class BrandService implements IBrandService {
  constructor(private brandRepository: IBrandRepository) {}

  async getBrandById(id: string): Promise<Brand | null> {
    return this.brandRepository.findById(id);
  }

  async getAllBrands(): Promise<Brand[]> {
    return this.brandRepository.findAll();
  }

  async createBrand(name: string, description: string = ""): Promise<Brand> {
    // Aquí podrías añadir lógica de validación o procesamiento previo a la creación.
    const brand = new Brand(name, description);
    return this.brandRepository.save(brand);
  }

  async updateBrand(
    id: string,
    name: string,
    description: string = "",
  ): Promise<Brand | null> {
    const brandToUpdate = await this.brandRepository.findById(id);
    if (!brandToUpdate) {
      // Manejar el caso de que la marca no exista.
      return null;
    }
    // Aquí podrías añadir lógica para validar los cambios o procesarlos antes de actualizar.
    brandToUpdate.name = name;
    brandToUpdate.description = description;
    return this.brandRepository.update(id, brandToUpdate);
  }

  async deleteBrand(id: string): Promise<void> {
    await this.brandRepository.deleteById(id);
  }
}
