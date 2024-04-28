import { ProductPrice } from "../../domain/entities";
import { CreateProductPriceDTO, UpdateProductPriceDTO } from "../dtos";
import { IProductPriceService, IProductPriceUseCases } from "../interfaces";

export class ProductPriceUseCases implements IProductPriceUseCases {
  private productPriceService: IProductPriceService;

  constructor(productPriceService: IProductPriceService) {
    this.productPriceService = productPriceService;
  }

  async findAllProductPrices(): Promise<ProductPrice[]> {
    return this.productPriceService.getAllProductPrices();
  }

  async createProductPrice(dto: CreateProductPriceDTO): Promise<ProductPrice> {
    return this.productPriceService.createProductPrice(dto);
  }

  async updateProductPrice(
    id: string,
    dto: UpdateProductPriceDTO,
  ): Promise<ProductPrice | null> {
    return this.productPriceService.updateProductPrice(id, dto);
  }

  async getProductPrice(id: string): Promise<ProductPrice | null> {
    return this.productPriceService.getProductPriceById(id);
  }

  async removeProductPrice(id: string): Promise<void> {
    return this.productPriceService.deleteProductPrice(id);
  }
}
