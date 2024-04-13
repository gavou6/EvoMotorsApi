import { CarModel } from "../../../domain/entities/CarModel";

export interface IBrandRepository {
  findById(id: string): Promise<CarModel | null>;
  findAll(): Promise<CarModel[]>;
  save(brand: CarModel): Promise<CarModel>;
  update(id: string, brand: CarModel): Promise<CarModel>;
  deleteById(id: string): Promise<void>;
}
