import { IFileService } from "../interfaces/File/IFileService";
import { CreateFileDTO, UpdateFileDTO } from "../dtos/File";
import { File } from "../../domain/entities/File";
import { IFileUseCases } from "../interfaces/File/IFileUseCases";

export class FileUseCases implements IFileUseCases {
  private fileService: IFileService;

  constructor(fileService: IFileService) {
    this.fileService = fileService;
  }

  async findAllFiles(): Promise<File[]> {
    return this.fileService.getAllFiles();
  }

  async createFile(dto: CreateFileDTO): Promise<File> {
    return this.fileService.createFile(dto);
  }

  async updateFile(id: string, dto: UpdateFileDTO): Promise<File | null> {
    return this.fileService.updateFile(id, dto);
  }

  async getFile(id: string): Promise<File | null> {
    return this.fileService.getFileById(id);
  }

  async removeFile(id: string): Promise<void> {
    return this.fileService.deleteFile(id);
  }
}
