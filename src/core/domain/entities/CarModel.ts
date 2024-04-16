import { CombustionType, EngineType } from "../../../shared/enums";

export class CarModel {
  public id?: string;

  constructor(
    public name: string,
    public brandId: string,
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
