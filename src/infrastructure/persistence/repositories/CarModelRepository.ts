import { Document } from "mongoose";
import { CarModel } from "../../../core/domain/entities/CarModel";
import CarModelModel, { CarModelDocument } from "../models/CarModel.model";
import { ICarModelRepository } from "../../../core/application/interfaces/CarModel/ICarModelRepository";
import {
  CreateCarModelDTO,
  UpdateCarModelDTO,
} from "../../../core/application/dtos/CarModel";

interface CarModelDoc extends Document, CarModelDocument {}

export class CarModelRepository implements ICarModelRepository {
  async findById(id: string): Promise<CarModel | null> {
    const carModelDoc = await CarModelModel.findById(id).exec();
    if (!carModelDoc) return null;
    return this.docToEntity(carModelDoc);
  }

  async findAll(): Promise<CarModel[]> {
    const carModelDocs = await CarModelModel.find().exec();
    if (!carModelDocs.length) return [];
    return carModelDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(dto: CreateCarModelDTO): Promise<CarModel> {
    const carModelDoc = new CarModelModel(dto);
    const savedBrandDoc = await carModelDoc.save();
    return this.docToEntity(savedBrandDoc);
  }

  async update(id: string, dto: UpdateCarModelDTO): Promise<CarModel> {
    const updatedBrandDoc = await CarModelModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedBrandDoc) throw new Error("Car Model not found");
    return this.docToEntity(updatedBrandDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CarModelModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CarModelDoc): CarModel {
    const carModel = new CarModel(
      doc.name,
      doc.brandId,
      doc.year,
      doc.engineSize,
      doc.cylinder,
      doc.combustion,
      doc.engineType,
      doc.files,
    );
    carModel.setId(doc._id.toString());
    return carModel;
  }
}
