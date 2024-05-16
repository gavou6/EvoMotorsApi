import { ProductPrice } from "../../../domain/entities";
import { CreateProductPriceDTO, UpdateProductPriceDTO } from "../../dtos";

export interface IProductPriceUseCases {
  createProductPrice(dto: CreateProductPriceDTO): Promise<ProductPrice>;
  updateProductPrice(
    id: string,
    dto: UpdateProductPriceDTO,
  ): Promise<ProductPrice | null>;
  getProductPrice(id: string): Promise<ProductPrice | null>;
  findAllProductPrices(): Promise<ProductPrice[]>;
  removeProductPrice(id: string): Promise<void>;
}
