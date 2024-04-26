import { ProductPrice } from "../../../domain/entities";
import { CreateProductPriceDTO, UpdateProductPriceDTO } from "../../dtos";

export interface IProductPriceService {
  createProductPrice(dto: CreateProductPriceDTO): Promise<ProductPrice>;
  getProductPriceById(id: string): Promise<ProductPrice | null>;
  getAllProductPrices(): Promise<ProductPrice[]>;
  updateProductPrice(
    id: string,
    dto: UpdateProductPriceDTO,
  ): Promise<ProductPrice | null>;
  deleteProductPrice(id: string): Promise<void>;
}
