import { EngineType, Transmission } from "../../../../shared/enums";

export type CreateCarModelDTO = {
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
