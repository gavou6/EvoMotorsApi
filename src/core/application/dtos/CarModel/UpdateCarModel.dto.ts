import { CombustionType, EngineType } from "../../../../shared/enums";

export type UpdateCarModelDTO = {
  name?: string;
  brandId?: string;
  year?: string;
  engine?: string;
  cylinder?: number;
  combustion?: CombustionType;
  engineType?: EngineType;
  files?: string[];
};
