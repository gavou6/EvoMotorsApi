import {
  CreateProductPriceDTO,
  UpdateProductPriceDTO,
} from "../../application/dtos";
import {
  IProductPriceRepository,
  IProductPriceService,
} from "../../application/interfaces";
import { ProductPrice } from "../entities";

export class ProductPriceService implements IProductPriceService {
  constructor(private productPriceRepository: IProductPriceRepository) {}

  async getProductPriceById(id: string): Promise<ProductPrice | null> {
    return this.productPriceRepository.findById(id);
  }

  async getAllProductPrices(): Promise<ProductPrice[]> {
    return this.productPriceRepository.findAll();
  }

  async createProductPrice(dto: CreateProductPriceDTO): Promise<ProductPrice> {
    return this.productPriceRepository.save(dto);
  }

  async updateProductPrice(
    id: string,
    dto: UpdateProductPriceDTO,
  ): Promise<ProductPrice | null> {
    return this.productPriceRepository.update(id, dto);
  }

  async deleteProductPrice(id: string): Promise<void> {
    await this.productPriceRepository.deleteById(id);
  }
}
