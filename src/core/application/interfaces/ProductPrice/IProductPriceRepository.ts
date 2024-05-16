import { ProductPrice } from "../../../domain/entities";
import { CreateProductPriceDTO, UpdateProductPriceDTO } from "../../dtos";

export interface IProductPriceRepository {
  findById(id: string): Promise<ProductPrice | null>;
  findAll(): Promise<ProductPrice[]>;
  save(dto: CreateProductPriceDTO): Promise<ProductPrice>;
  update(id: string, dto: UpdateProductPriceDTO): Promise<ProductPrice>;
  deleteById(id: string): Promise<void>;
}
