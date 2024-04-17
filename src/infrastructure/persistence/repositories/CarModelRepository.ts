import { Document } from "mongoose";
import { CarModel } from "../../../core/domain/entities/CarModel";
import CarModelModel, { CarModelDocument } from "../models/CarModel.model";
import { ICarModelRepository } from "../../../core/application/interfaces/CarModel/ICarModelRepository";
import {
  CreateCarModelDTO,
  UpdateCarModelDTO,
} from "../../../core/application/dtos/CarModel";
import { Brand } from "../../../core/domain/entities/Brand";

interface CarModelDoc extends Document, CarModelDocument {}

export class CarModelRepository implements ICarModelRepository {
  async findById(id: string): Promise<CarModel | null> {
    const carModelDoc = await CarModelModel.findById(id)
      .populate("brandId")
      .populate("files")
      .exec();
    if (!carModelDoc) return null;
    return this.docToEntity(carModelDoc);
  }

  async findAll(): Promise<CarModel[]> {
    const carModelDocs = await CarModelModel.find()
      .populate("brandId")
      .populate("files")
      .exec();
    if (!carModelDocs.length) return [];
    return carModelDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(dto: CreateCarModelDTO): Promise<CarModel> {
    const carModelDoc = new CarModelModel(dto);
    const savedCarModelDoc = await carModelDoc.save();
    const populatedCarModelDoc = await savedCarModelDoc.populate(
      "brandId",
      "files",
    );
    return this.docToEntity(populatedCarModelDoc);
  }

  async update(id: string, dto: UpdateCarModelDTO): Promise<CarModel> {
    const updatedBrandDoc = await CarModelModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate("brandId")
      .populate("files")
      .exec();
    if (!updatedBrandDoc) throw new Error("Car Model not found");
    return this.docToEntity(updatedBrandDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CarModelModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CarModelDoc): CarModel {
    const brand = new Brand(doc.brandId.name);
    brand.setId(doc._id.toString());

    const carModel = new CarModel(
      doc.name,
      brand,
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
