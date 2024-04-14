import { ICarModelService } from "../interfaces/CarModel/ICarModelService";
import { CreateCarModelDTO, UpdateCarModelDTO } from "../dtos/CarModel";
import { CarModel } from "../../domain/entities/CarModel";
import { ICarModelUseCases } from "../interfaces/CarModel/ICarModelUseCases";

export class CarModelUseCases implements ICarModelUseCases {
  private carModelService: ICarModelService;

  constructor(carModelService: ICarModelService) {
    this.carModelService = carModelService;
  }

  async findAllCarModels(): Promise<CarModel[]> {
    return this.carModelService.getAllCarModels();
  }

  async createCarModel(dto: CreateCarModelDTO): Promise<CarModel> {
    return this.carModelService.createCarModel(dto);
  }

  async updateCarModel(
    id: string,
    dto: UpdateCarModelDTO,
  ): Promise<CarModel | null> {
    return this.carModelService.updateCarModel(id, dto);
  }

  async getCarModel(id: string): Promise<CarModel | null> {
    return this.carModelService.getCarModelById(id);
  }

  async removeCarModel(id: string): Promise<void> {
    return this.carModelService.deleteCarModel(id);
  }
}
