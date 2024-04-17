import { CombustionType, EngineType } from "../../../shared/enums";
import { Brand } from "./Brand";

export class CarModel {
  public id?: string;

  constructor(
    public name: string,
    public brandId: Brand,
    public year: string,
    public engineSize: string,
    public cylinder: number,
    public combustion: CombustionType,
    public engineType: EngineType,
    public files?: string[],
  ) {}

  setId(id: string) {
    if (!this.id) {
      this.id = id;
    }
  }
}
