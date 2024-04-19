import { File } from "../../../domain/entities";
import { CreateFileDTO, UpdateFileDTO } from "../../dtos/File";

export interface IFileService {
  createFile(dto: CreateFileDTO): Promise<File>;
  getFileById(id: string): Promise<File | null>;
  getAllFiles(): Promise<File[]>;
  updateFile(id: string, dto: UpdateFileDTO): Promise<File | null>;
  deleteFile(id: string): Promise<void>;
}
