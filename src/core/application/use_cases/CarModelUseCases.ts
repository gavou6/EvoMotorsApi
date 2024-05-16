import { CarModel } from "../../domain/entities";
import { CreateCarModelDTO, UpdateCarModelDTO } from "../dtos";
import { ICarModelService, ICarModelUseCases } from "../interfaces";

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
