import { File } from "../../../domain/entities/File";
import { CreateFileDTO, UpdateFileDTO } from "../../dtos/File";

export interface IFileUseCases {
  createFile(dto: CreateFileDTO): Promise<File>;
  updateFile(id: string, dto: UpdateFileDTO): Promise<File | null>;
  getFile(id: string): Promise<File | null>;
  findAllFiles(): Promise<File[]>;
  removeFile(id: string): Promise<void>;
}
