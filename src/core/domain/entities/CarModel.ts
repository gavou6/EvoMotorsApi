import { EngineType, Transmission } from "../../../shared/enums";

export class CarModel {
  public id?: string;

  constructor(
    public name: string,
    public brandId: string,
    public year: string,
    public engine: string,
    public cylinder: string,
    public combustion: string,
    public transmission: Transmission,
    public engineType: EngineType,
  ) {}

  setId(id: string) {
    if (!this.id) {
      this.id = id;
    }
  }
}
