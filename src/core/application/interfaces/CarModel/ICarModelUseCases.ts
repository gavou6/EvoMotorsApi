import { CarModel } from "../../../domain/entities/CarModel";
import { CreateCarModelDTO, UpdateCarModelDTO } from "../../dtos/CarModel";

export interface IBrandUseCases {
  createCarModel(dto: CreateCarModelDTO): Promise<CarModel>;
  updateCarModel(dto: UpdateCarModelDTO): Promise<CarModel | null>;
  getCarModel(id: string): Promise<CarModel | null>;
  findAllCarModels(): Promise<CarModel[]>;
  removeCarModel(id: string): Promise<void>;
}
