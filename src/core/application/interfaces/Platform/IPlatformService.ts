import { Platform } from "../../../domain/entities";
import { CreatePlatformDTO, UpdatePlatformDTO } from "../../dtos/Platform";

export interface IPlatformService {
  createPlatform(dto: CreatePlatformDTO): Promise<Platform>;
  getPlatformById(id: string): Promise<Platform | null>;
  getAllPlatforms(): Promise<Platform[]>;
  updatePlatform(id: string, dto: UpdatePlatformDTO): Promise<Platform | null>;
  deletePlatform(id: string): Promise<void>;
}
