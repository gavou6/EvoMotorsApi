import { IFileService } from "../../application/interfaces/File/IFileService";
import { File } from "../entities/File";
import { IFileRepository } from "../../application/interfaces/File/IFileRepository";
import { CreateFileDTO, UpdateFileDTO } from "../../application/dtos/File";

export class FileService implements IFileService {
  constructor(private fileRepository: IFileRepository) {}

  async getFileById(id: string): Promise<File | null> {
    return this.fileRepository.findById(id);
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileRepository.findAll();
  }

  async createFile(dto: CreateFileDTO): Promise<File> {
    return this.fileRepository.save(dto);
  }

  async updateFile(id: string, dto: UpdateFileDTO): Promise<File | null> {
    return this.fileRepository.update(id, dto);
  }

  async deleteFile(id: string): Promise<void> {
    await this.fileRepository.deleteById(id);
  }
}
