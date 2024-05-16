import { File } from "../../../domain/entities";
import { CreateFileDTO, UpdateFileDTO } from "../../dtos/File";

export interface IFileRepository {
  findById(id: string): Promise<File | null>;
  findAll(): Promise<File[]>;
  save(dto: CreateFileDTO): Promise<File>;
  update(id: string, dto: UpdateFileDTO): Promise<File>;
  deleteById(id: string): Promise<void>;
}
