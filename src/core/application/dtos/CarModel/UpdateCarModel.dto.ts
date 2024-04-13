import { EngineType, Transmission } from "../../../../shared/enums";

export type UpdateCarModelDTO = {
  id: string;
  name: string;
  brandId: string;
  year: string;
  engine: string;
  cylinder: number;
  combustion: string;
  transmission: Transmission;
  engineType: EngineType;
  files: string[];
};
