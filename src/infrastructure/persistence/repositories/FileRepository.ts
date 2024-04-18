import { Document } from "mongoose";
import { File } from "../../../core/domain/entities/File";
import FileModel, { FileDocument } from "../models/File.model";
import { IFileRepository } from "../../../core/application/interfaces/File/IFileRepository";
import {
  CreateFileDTO,
  UpdateFileDTO,
} from "../../../core/application/dtos/File";

interface FileDoc extends Document, FileDocument {}

export class CarModelRepository implements IFileRepository {
  async findById(id: string): Promise<File | null> {
    const fileDoc = await FileModel.findById(id).exec();
    if (!fileDoc) return null;
    return this.docToEntity(fileDoc);
  }

  async findAll(): Promise<File[]> {
    const filelDocs = await FileModel.find().exec();
    if (!filelDocs.length) return [];
    return filelDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(dto: CreateFileDTO): Promise<File> {
    const fileDoc = new FileModel(dto);
    const savedFileDoc = await fileDoc.save();
    return this.docToEntity(savedFileDoc);
  }

  async update(id: string, dto: UpdateFileDTO): Promise<File> {
    const updatedFileDoc = await FileModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedFileDoc) throw new Error("Car Model not found");
    return this.docToEntity(updatedFileDoc);
  }

  async deleteById(id: string): Promise<void> {
    await FileModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: FileDoc): File {
    const file = new File(doc.fileUrl, doc.type);
    file.setId(doc._id.toString());
    return file;
  }
}
