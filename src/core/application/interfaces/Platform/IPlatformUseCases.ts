import { Platform } from "../../../domain/entities/Platform";
import { CreatePlatformDTO, UpdatePlatformDTO } from "../../dtos/Platform";

export interface IPlatformUseCases {
  createPlatform(dto: CreatePlatformDTO): Promise<Platform>;
  updatePlatform(id: string, dto: UpdatePlatformDTO): Promise<Platform | null>;
  getPlatform(id: string): Promise<Platform | null>;
  findAllPlatforms(): Promise<Platform[]>;
  removePlatform(id: string): Promise<void>;
}
