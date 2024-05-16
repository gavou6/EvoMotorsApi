import { Platform } from "../../../domain/entities";
import { CreatePlatformDTO, UpdatePlatformDTO } from "../../dtos/Platform";

export interface IPlatformRepository {
  findById(id: string): Promise<Platform | null>;
  findAll(): Promise<Platform[]>;
  save(dto: CreatePlatformDTO): Promise<Platform>;
  update(id: string, dto: UpdatePlatformDTO): Promise<Platform>;
  deleteById(id: string): Promise<void>;
}
